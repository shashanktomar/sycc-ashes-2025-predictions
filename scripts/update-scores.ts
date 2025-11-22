import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../src/data/series-data.json');

// Ashes 2025-26 match URLs (all matches)
const MATCH_URLS: Record<string, { dates: [string, string]; url: string }> = {
    '1st Test': {
        dates: ['2025-11-21', '2025-11-25'],
        url: 'https://www.cricbuzz.com/live-cricket-scorecard/108787/aus-vs-eng-1st-test-the-ashes-2025-26'
    },
    '2nd Test': {
        dates: ['2025-12-04', '2025-12-08'],
        url: 'https://www.cricbuzz.com/live-cricket-scorecard/108788/aus-vs-eng-2nd-test-the-ashes-2025-26'
    },
    '3rd Test': {
        dates: ['2025-12-17', '2025-12-21'],
        url: 'https://www.cricbuzz.com/live-cricket-scorecard/108789/aus-vs-eng-3rd-test-the-ashes-2025-26'
    },
    '4th Test': {
        dates: ['2025-12-26', '2025-12-30'],
        url: 'https://www.cricbuzz.com/live-cricket-scorecard/108790/aus-vs-eng-4th-test-the-ashes-2025-26'
    },
    '5th Test': {
        dates: ['2026-01-04', '2026-01-08'],
        url: 'https://www.cricbuzz.com/live-cricket-scorecard/108791/aus-vs-eng-5th-test-the-ashes-2025-26'
    }
};

// Types
interface PlayerStats {
    runs: number;
    wickets: number;
}

interface MatchData {
    matchId: string;
    date: string;
    status: string;
    result: string;
    scores: { eng: string; aus: string };
    playerStats: {
        eng: Record<string, PlayerStats>;
        aus: Record<string, PlayerStats>;
    };
}

interface SeriesData {
    lastUpdated: string;
    seriesScore: { england: number; australia: number; draw: number };
    matches: Record<string, MatchData>;
}


// Helper to extract match ID from URL
function getMatchIdFromUrl(url: string): string | null {
    const match = url.match(/live-cricket-scorecard\/(\d+)\//);
    return match ? match[1] : null;
}

// Helper to get current match URL based on date
function getCurrentMatchUrl(currentDate?: Date): string | null {
    const today = currentDate || new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    for (const [matchName, matchInfo] of Object.entries(MATCH_URLS)) {
        const [startDate, endDate] = matchInfo.dates;
        if (todayStr >= startDate && todayStr <= endDate) {
            console.log(`Auto-detected match: ${matchName} (${startDate} to ${endDate})`);
            return matchInfo.url;
        }
    }

    return null;
}

async function scrapeCricbuzz(url: string): Promise<MatchData | null> {
    console.log(`Fetching data from ${url}...`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        // Optional: Write to debug file if needed
        // await fs.writeFile(path.join(__dirname, 'debug.html'), html);

        const $ = cheerio.load(html);

        const pageMatchTitle = $('h1').first().text().trim().split('-')[0].trim();
        const matchStatus = $('.text-cbLive').text().trim();

        console.log('Page Title:', pageMatchTitle);
        console.log('Match Status:', matchStatus);

        const matchId = getMatchIdFromUrl(url);
        if (!matchId) {
            throw new Error('Could not extract match ID from URL');
        }

        // Initialize Data
        const playerStats = {
            eng: {} as Record<string, PlayerStats>,
            aus: {} as Record<string, PlayerStats>
        };

        const scores = {
            eng: [] as string[],
            aus: [] as string[]
        };

        // Iterate over innings
        const inningDivs = $('div[id^="team-"]');
        const processedInningIds = new Set<string>();

        inningDivs.each((_, inning) => {
            const inningId = $(inning).attr('id') || '';
            if (!inningId || processedInningIds.has(inningId) || !inningId.includes('innings')) return;
            processedInningIds.add(inningId);

            const teamNameRaw = $(inning).find('.font-bold').first().text().trim(); // e.g. "ENG 1st Innings"
            const scoreRaw = $(inning).find('span.font-bold').first().text().trim(); // e.g. "172-10"

            // Determine team
            let teamKey: 'eng' | 'aus' | null = null;
            if (teamNameRaw.toUpperCase().includes('ENG')) teamKey = 'eng';
            else if (teamNameRaw.toUpperCase().includes('AUS')) teamKey = 'aus';

            if (!teamKey) return;

            // Add score
            scores[teamKey].push(scoreRaw);

            // Parse Scorecard for this inning
            const scorecardId = `scard-${inningId}`;
            const scorecardDiv = $(`#${scorecardId}`).first();

            // Batting Stats
            scorecardDiv.find('.scorecard-bat-grid').each((_, row) => {
                const nameAnchor = $(row).find('a');
                if (nameAnchor.length === 0) return; // Header row or empty

                const playerName = nameAnchor.text().trim();
                // Runs is usually the 2nd child (index 1)
                const runsText = $(row).children().eq(1).text().trim();
                const runs = parseInt(runsText, 10) || 0;

                if (!playerStats[teamKey!][playerName]) {
                    playerStats[teamKey!][playerName] = { runs: 0, wickets: 0 };
                }
                playerStats[teamKey!][playerName].runs += runs;
            });

            // Bowling Stats (Opposing Team)
            const bowlingTeamKey = teamKey === 'eng' ? 'aus' : 'eng';

            scorecardDiv.find('.scorecard-bowl-grid').each((_, row) => {
                const nameAnchor = $(row).find('a');
                if (nameAnchor.length === 0) return;

                const playerName = nameAnchor.text().trim();
                // Wickets is usually the 5th child (index 4)
                const wicketsText = $(row).children().eq(4).text().trim();
                const wickets = parseInt(wicketsText, 10) || 0;

                if (!playerStats[bowlingTeamKey][playerName]) {
                    playerStats[bowlingTeamKey][playerName] = { runs: 0, wickets: 0 };
                }
                playerStats[bowlingTeamKey][playerName].wickets += wickets;
            });
        });

        return {
            matchId: matchId,
            date: new Date().toISOString().split('T')[0],
            status: matchStatus,
            result: matchStatus, // Using status as result for now
            scores: {
                eng: scores.eng.join(' & ') || '0/0',
                aus: scores.aus.join(' & ') || '0/0'
            },
            playerStats
        };

    } catch (error) {
        console.error('Error scraping Cricbuzz:', error);
        return null;
    }
}

async function updateScores() {
    // Try to get URL from command line argument, otherwise auto-detect based on date
    let url = process.argv[2];

    if (!url) {
        console.log('No URL provided, attempting to auto-detect current match...');
        url = getCurrentMatchUrl() || '';

        if (!url) {
            console.error('No URL provided and could not auto-detect current match.');
            console.error('No match is scheduled for today.');
            console.error('Usage: pnpm tsx scripts/update-scores.ts [URL]');
            process.exit(1);
        }
    }

    try {
        // 1. Read existing data
        let seriesData: SeriesData;
        try {
            const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
            seriesData = JSON.parse(fileContent);
        } catch (error) {
            // If file doesn't exist or is invalid, start fresh
            seriesData = {
                lastUpdated: new Date().toISOString(),
                seriesScore: { england: 0, australia: 0, draw: 0 },
                matches: {}
            };
        }

        // 2. Fetch new data
        const newMatchData = await scrapeCricbuzz(url);

        if (!newMatchData) {
            console.log('No match data returned. Exiting.');
            return;
        }

        // 3. Update specific match
        // Merge with existing matches, do not overwrite the entire object
        if (!seriesData.matches) {
            seriesData.matches = {};
        }
        seriesData.matches[newMatchData.matchId] = newMatchData;

        seriesData.lastUpdated = new Date().toISOString();

        // 4. Save back to file
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(seriesData, null, 2));
        console.log(`Series data updated successfully for match ${newMatchData.matchId}!`);

    } catch (error) {
        console.error('Error updating scores:', error);
        process.exit(1);
    }
}

updateScores();
