import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../src/data/series-data.json');
const STATS_FILE_PATH = path.join(__dirname, '../src/data/series-stats.json');

// Types
interface PlayerStats {
    runs: number;
    wickets: number;
}

interface InningsStats {
    innings1?: Record<string, PlayerStats>;
    innings2?: Record<string, PlayerStats>;
}

interface MatchData {
    matchId: string;
    date: string;
    status: string;
    result: string;
    scores: { eng: string; aus: string };
    playerStats: {
        eng: InningsStats;
        aus: InningsStats;
    };
}

interface SeriesData {
    lastUpdated: string;
    seriesScore: { england: number; australia: number; draw: number };
    matches: Record<string, MatchData>;
}

interface AggregatedStats {
    lastUpdated: string;
    actualTiebreaker: number;
    topRunScorers: {
        eng: Array<{ name: string; runs: number }>;
        aus: Array<{ name: string; runs: number }>;
    };
    topWicketTakers: {
        eng: Array<{ name: string; wickets: number }>;
        aus: Array<{ name: string; wickets: number }>;
    };
}

// Helper to normalize player names by removing designations like (c), (wk)
function normalizePlayerName(name: string): string {
    return name.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

async function generateStats() {
    try {
        // 1. Read existing data
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const seriesData: SeriesData = JSON.parse(fileContent);

        // 2. Aggregate Stats
        const aggregated = {
            eng: { runs: {} as Record<string, number>, wickets: {} as Record<string, number> },
            aus: { runs: {} as Record<string, number>, wickets: {} as Record<string, number> }
        };

        // Iterate over all matches to aggregate
        if (seriesData.matches) {
            Object.values(seriesData.matches).forEach((m: MatchData) => {
                // Helper to aggregate stats from innings
                const aggregateTeamStats = (teamKey: 'eng' | 'aus') => {
                    const teamStats = m.playerStats?.[teamKey];
                    if (!teamStats) return;

                    // Aggregate from innings1
                    if (teamStats.innings1) {
                        Object.entries(teamStats.innings1).forEach(([player, stats]) => {
                            const normalizedName = normalizePlayerName(player);
                            if (!aggregated[teamKey].runs[normalizedName]) aggregated[teamKey].runs[normalizedName] = 0;
                            if (!aggregated[teamKey].wickets[normalizedName]) aggregated[teamKey].wickets[normalizedName] = 0;
                            aggregated[teamKey].runs[normalizedName] += stats.runs;
                            aggregated[teamKey].wickets[normalizedName] += stats.wickets;
                        });
                    }

                    // Aggregate from innings2
                    if (teamStats.innings2) {
                        Object.entries(teamStats.innings2).forEach(([player, stats]) => {
                            const normalizedName = normalizePlayerName(player);
                            if (!aggregated[teamKey].runs[normalizedName]) aggregated[teamKey].runs[normalizedName] = 0;
                            if (!aggregated[teamKey].wickets[normalizedName]) aggregated[teamKey].wickets[normalizedName] = 0;
                            aggregated[teamKey].runs[normalizedName] += stats.runs;
                            aggregated[teamKey].wickets[normalizedName] += stats.wickets;
                        });
                    }
                };

                // Aggregate both teams
                aggregateTeamStats('eng');
                aggregateTeamStats('aus');
            });
        }

        // Helper to sort and slice
        const getTopList = (stats: Record<string, number>, limit: number = 5) => {
            return Object.entries(stats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, limit)
                .map(([name, value]) => ({ name, value })); // standardized to value for internal use, but we want runs/wickets in output
        };

        // Helper for specific output format
        const getTopRuns = (stats: Record<string, number>) =>
            getTopList(stats).map(i => ({ name: i.name, runs: i.value }));

        const getTopWickets = (stats: Record<string, number>) =>
            getTopList(stats).map(i => ({ name: i.name, wickets: i.value }));

        const topRunEng = getTopRuns(aggregated.eng.runs);
        const topRunAus = getTopRuns(aggregated.aus.runs);
        const topWktEng = getTopWickets(aggregated.eng.wickets);
        const topWktAus = getTopWickets(aggregated.aus.wickets);

        // Tiebreaker: Runs in 1st Innings of 1st Test (England batted first: 172)
        // This value is now fixed as the 1st innings is complete
        const actualTiebreaker = 172;

        const statsData: AggregatedStats = {
            lastUpdated: new Date().toISOString(),
            actualTiebreaker: actualTiebreaker,
            topRunScorers: {
                eng: topRunEng,
                aus: topRunAus
            },
            topWicketTakers: {
                eng: topWktEng,
                aus: topWktAus
            }
        };

        // 3. Save to stats file
        await fs.writeFile(STATS_FILE_PATH, JSON.stringify(statsData, null, 2));
        console.log('Series stats generated successfully!');

    } catch (error) {
        console.error('Error generating stats:', error);
        process.exit(1);
    }
}

generateStats();
