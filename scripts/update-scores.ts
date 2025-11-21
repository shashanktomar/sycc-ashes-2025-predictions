import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../src/data/series-data.json');
const CRICBUZZ_URL = 'https://www.cricbuzz.com/live-cricket-scorecard/108787/aus-vs-eng-1st-test-the-ashes-2025-26';

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
    const url = process.argv[2];
    if (!url) {
        console.error('Please provide a Cricbuzz URL as an argument.');
        console.error('Usage: pnpm tsx scripts/update-match.ts <URL>');
        process.exit(1);
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
