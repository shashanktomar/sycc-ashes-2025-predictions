import React, { useState, useEffect } from 'react';
import { LeaderboardCardDesign } from '../components/design/LeaderboardCardDesign';
import participantsData from '../data/participants.json';
// Import local data URL for development environment
import localSeriesDataUrl from '../data/series-data.json?url';
import localSeriesStatsUrl from '../data/series-stats.json?url';

interface Participant {
  id: string;
  name: string;
  seriesScore: string;
  seriesWinner: string;
  leadRunScorerEng: string;
  leadRunScorerAus: string;
  leadWktTakerEng: string;
  leadWktTakerAus: string;
  tiebreaker: number;
}

// Define Series Data Types
interface SeriesData {
  lastUpdated: string;
  seriesScore: { england: number; australia: number; draw: number };
  matches: Record<string, {
    matchId: string;
    date: string;
    status: string;
    scores: { eng: string; aus: string };
  }>;
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

interface ParticipantWithScore extends Participant {
  totalPoints: number;
  rank: number;
  tiebreakerDiff: number;
  correctSeriesWinner?: boolean;
  correctSeriesScore?: boolean;
  correctEngRunScorer?: boolean;
  correctEngWktTaker?: boolean;
  correctAusRunScorer?: boolean;
  correctAusWktTaker?: boolean;
}

const participants: Participant[] = participantsData;

const StatsView: React.FC = () => {
  const [statsData, setStatsData] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsUrl = import.meta.env.DEV
          ? localSeriesStatsUrl
          : 'https://raw.githubusercontent.com/shashanktomar/sycc-ashes-2025-predictions/main/src/data/series-stats.json';

        const statsRes = await fetch(statsUrl);
        if (!statsRes.ok) throw new Error('Failed to fetch stats data');
        const stats = await statsRes.json();
        setStatsData(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!statsData) {
    return <div className="text-center text-slate-500">No stats available</div>;
  }

  return (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-white px-2">Series Statistics</h2>

      {/* Top Run Scorers */}
      <div className="bg-slate-900 rounded-lg shadow-sm border border-slate-800 overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-slate-800/50 border-b border-slate-700 text-blue-400">Top Run Scorers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-700">
                <th className="text-left p-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Team</th>
                <th className="text-left p-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Player</th>
                <th className="text-right p-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Runs</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...statsData.topRunScorers.eng.map(p => ({ ...p, team: 'eng' })),
                ...statsData.topRunScorers.aus.map(p => ({ ...p, team: 'aus' }))
              ]
                .sort((a, b) => b.runs - a.runs)
                .map((player, index) => (
                  <tr
                    key={`runs-${player.team}-${index}`}
                    className={`border-b border-slate-800 ${player.team === 'eng'
                      ? 'bg-blue-900/10 hover:bg-blue-900/20'
                      : 'bg-yellow-900/10 hover:bg-yellow-900/20'
                      } transition-colors`}
                  >
                    <td className="p-3">
                      <span className="text-lg">{player.team === 'eng' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : '🇦🇺'}</span>
                    </td>
                    <td className="p-3 font-medium text-white">{player.name}</td>
                    <td className={`p-3 text-right font-bold ${player.team === 'eng' ? 'text-blue-400' : 'text-yellow-400'}`}>
                      {player.runs}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Wicket Takers */}
      <div className="bg-slate-900 rounded-lg shadow-sm border border-slate-800 overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-slate-800/50 border-b border-slate-700 text-blue-400">Top Wicket Takers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-700">
                <th className="text-left p-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Team</th>
                <th className="text-left p-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Player</th>
                <th className="text-right p-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Wickets</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...statsData.topWicketTakers.eng.map(p => ({ ...p, team: 'eng' })),
                ...statsData.topWicketTakers.aus.map(p => ({ ...p, team: 'aus' }))
              ]
                .sort((a, b) => b.wickets - a.wickets)
                .map((player, index) => (
                  <tr
                    key={`wickets-${player.team}-${index}`}
                    className={`border-b border-slate-800 ${player.team === 'eng'
                      ? 'bg-blue-900/10 hover:bg-blue-900/20'
                      : 'bg-yellow-900/10 hover:bg-yellow-900/20'
                      } transition-colors`}
                  >
                    <td className="p-3">
                      <span className="text-lg">{player.team === 'eng' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : '🇦🇺'}</span>
                    </td>
                    <td className="p-3 font-medium text-white">{player.name}</td>
                    <td className={`p-3 text-right font-bold ${player.team === 'eng' ? 'text-blue-400' : 'text-yellow-400'}`}>
                      {player.wickets}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const RulesView: React.FC = () => (
  <section className="bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-800 animate-fade-in text-white">
    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Competition Rules</h2>
    <div className="space-y-4 text-slate-300">
      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="font-bold text-yellow-400">Entries are now closed</p>
        <p className="text-sm text-yellow-200/70">Good luck to all participants!</p>
      </div>

      <p><strong>Entry Fee:</strong> $20</p>

      <h3 className="text-lg font-semibold text-blue-400 mt-4">Scoring System</h3>
      <ul className="list-disc list-inside space-y-2 ml-2">
        <li><strong>1 point</strong> for correct series result (Winner)</li>
        <li><strong>1 further point</strong> for exact score (e.g. 3-1)</li>
        <li><strong>1 point</strong> for each correct runs scorer / wkt taker</li>
      </ul>

      <h3 className="text-lg font-semibold text-blue-400 mt-4">Tiebreaker</h3>
      <p>Total runs scored in the 1st innings of the 1st Test.</p>
      <p className="text-sm text-slate-500 mt-1">Closest prediction wins in case of a points tie.</p>
    </div>
  </section>
);

const LeaderboardView: React.FC = () => {
  const [seriesData, setSeriesData] = useState<SeriesData | null>(null);
  const [statsData, setStatsData] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use local file in development, GitHub raw URL in production
        const dataUrl = import.meta.env.DEV
          ? localSeriesDataUrl
          : 'https://raw.githubusercontent.com/shashanktomar/sycc-ashes-2025-predictions/main/src/data/series-data.json';

        const statsUrl = import.meta.env.DEV
          ? localSeriesStatsUrl
          : 'https://raw.githubusercontent.com/shashanktomar/sycc-ashes-2025-predictions/main/src/data/series-stats.json';

        const [dataRes, statsRes] = await Promise.all([
          fetch(dataUrl),
          fetch(statsUrl)
        ]);

        if (!dataRes.ok) throw new Error('Failed to fetch series data');
        // Stats might not exist yet if no script ran, so handle gracefully if needed, but for now assume it exists
        if (!statsRes.ok) throw new Error('Failed to fetch stats data');

        const data = await dataRes.json();
        const stats = await statsRes.json();

        setSeriesData(data);
        setStatsData(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate points dynamically based on series data
  let actualTiebreaker = 0;
  let actualSeriesScoreStr = '';
  let actualSeriesWinner = '';
  let isSeriesComplete = false;

  if (seriesData) {
    // Calculate Series Score & Winner
    const { england, australia, draw } = seriesData.seriesScore;

    // Check if series is complete (all 5 matches played)
    const totalMatchesCompleted = england + australia + draw;
    isSeriesComplete = totalMatchesCompleted >= 5;

    actualSeriesScoreStr = `${england}-${australia}`;
    if (england > australia) actualSeriesWinner = 'England';
    else if (australia > england) actualSeriesWinner = 'Australia';
    else actualSeriesWinner = 'Draw';
  }

  // Get actual tiebreaker from stats data
  if (statsData) {
    actualTiebreaker = statsData.actualTiebreaker;
  }

  const sortedParticipantsRaw = participants.map(p => {
    let points = 0;
    let correctSeriesWinner = false;
    let correctSeriesScore = false;
    let correctEngRunScorer = false;
    let correctEngWktTaker = false;
    let correctAusRunScorer = false;
    let correctAusWktTaker = false;

    if (seriesData && statsData) {
      const { topRunScorers, topWicketTakers } = statsData;

      // Series Winner Points (1 point) - Only award after series is complete (5 matches)
      if (isSeriesComplete && actualSeriesWinner && p.seriesWinner === actualSeriesWinner) {
        points += 1;
        correctSeriesWinner = true;
      }

      // Exact Score Points (1 point) - Only award after series is complete (5 matches)
      if (isSeriesComplete && actualSeriesScoreStr && p.seriesScore === actualSeriesScoreStr) {
        points += 1;
        correctSeriesScore = true;
      }

      // Run Scorer Points (1 point each) - use first element of top lists
      const leadRunEng = topRunScorers.eng[0];
      const leadRunAus = topRunScorers.aus[0];
      if (leadRunEng && leadRunEng.name !== 'TBD' && p.leadRunScorerEng === leadRunEng.name) {
        points += 1;
        correctEngRunScorer = true;
      }
      if (leadRunAus && leadRunAus.name !== 'TBD' && p.leadRunScorerAus === leadRunAus.name) {
        points += 1;
        correctAusRunScorer = true;
      }

      // Wicket Taker Points (1 point each) - use first element of top lists
      const leadWktEng = topWicketTakers.eng[0];
      const leadWktAus = topWicketTakers.aus[0];
      if (leadWktEng && leadWktEng.name !== 'TBD' && p.leadWktTakerEng === leadWktEng.name) {
        points += 1;
        correctEngWktTaker = true;
      }
      if (leadWktAus && leadWktAus.name !== 'TBD' && p.leadWktTakerAus === leadWktAus.name) {
        points += 1;
        correctAusWktTaker = true;
      }
    }

    return {
      ...p,
      totalPoints: points,
      rank: 1, // Will be sorted below
      tiebreakerDiff: Math.abs(p.tiebreaker - actualTiebreaker),
      correctSeriesWinner,
      correctSeriesScore,
      correctEngRunScorer,
      correctEngWktTaker,
      correctAusRunScorer,
      correctAusWktTaker
    };
  }).sort((a, b) => {
    // Primary Sort: Total Points (Desc)
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    // Secondary Sort: Tiebreaker Difference (Asc) - Closest to actual wins
    return a.tiebreakerDiff - b.tiebreakerDiff;
  });

  // Assign ranks (handling ties)
  const rankedParticipants: ParticipantWithScore[] = [];
  sortedParticipantsRaw.forEach((p, index) => {
    let rank = index + 1;
    if (index > 0 && p.totalPoints === sortedParticipantsRaw[index - 1].totalPoints && p.tiebreakerDiff === sortedParticipantsRaw[index - 1].tiebreakerDiff) {
      rank = rankedParticipants[index - 1].rank;
    }
    rankedParticipants.push({ ...p, rank });
  });

  const sortedParticipants = rankedParticipants;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-white px-2">Leaderboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedParticipants.map((participant, index) => (
          <LeaderboardCardDesign
            key={participant.id || index}
            variant="dashboard-hybrid"
            participant={participant}
          />
        ))}
      </div>
    </section>
  );
};

type Tab = 'leaderboard' | 'stats' | 'rules';

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-8">
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto p-6 pb-0">
          <h1 className="text-3xl font-bold tracking-tight">ASHES PREDICTIONS 2025</h1>
          <p className="mt-2 text-slate-400 mb-6">Good luck. 🤞🏏💰</p>

          {/* Tab Navigation */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-t-lg font-medium text-sm sm:text-base transition-colors duration-200 ${activeTab === 'leaderboard'
                ? 'bg-slate-950 text-blue-400 border-t border-l border-r border-slate-800'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-t-lg font-medium text-sm sm:text-base transition-colors duration-200 ${activeTab === 'stats'
                ? 'bg-slate-950 text-blue-400 border-t border-l border-r border-slate-800'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-3 rounded-t-lg font-medium text-sm sm:text-base transition-colors duration-200 ${activeTab === 'rules'
                ? 'bg-slate-950 text-blue-400 border-t border-l border-r border-slate-800'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Rules & Info
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {activeTab === 'leaderboard' ? <LeaderboardView /> : activeTab === 'stats' ? <StatsView /> : <RulesView />}
      </main>
    </div>
  );
};

export default Leaderboard;
