import React, { useState, useEffect } from 'react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (!statsData) {
    return <div className="text-center text-gray-500">No stats available</div>;
  }

  return (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-green-800 px-2">Series Statistics</h2>

      {/* Top Run Scorers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-green-50 border-b border-green-100 text-green-800">Top Run Scorers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Team</th>
                <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Player</th>
                <th className="text-right p-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Runs</th>
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
                    className={`border-b border-gray-100 ${player.team === 'eng'
                      ? 'bg-blue-50/30 hover:bg-blue-50/50'
                      : 'bg-yellow-50/30 hover:bg-yellow-50/50'
                      } transition-colors`}
                  >
                    <td className="p-3">
                      <span className="text-lg">{player.team === 'eng' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : '🇦🇺'}</span>
                    </td>
                    <td className="p-3 font-medium text-gray-900">{player.name}</td>
                    <td className={`p-3 text-right font-bold ${player.team === 'eng' ? 'text-blue-700' : 'text-yellow-700'}`}>
                      {player.runs}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Wicket Takers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-green-50 border-b border-green-100 text-green-800">Top Wicket Takers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Team</th>
                <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Player</th>
                <th className="text-right p-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Wickets</th>
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
                    className={`border-b border-gray-100 ${player.team === 'eng'
                      ? 'bg-blue-50/30 hover:bg-blue-50/50'
                      : 'bg-yellow-50/30 hover:bg-yellow-50/50'
                      } transition-colors`}
                  >
                    <td className="p-3">
                      <span className="text-lg">{player.team === 'eng' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : '🇦🇺'}</span>
                    </td>
                    <td className="p-3 font-medium text-gray-900">{player.name}</td>
                    <td className={`p-3 text-right font-bold ${player.team === 'eng' ? 'text-blue-700' : 'text-yellow-700'}`}>
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
  <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
    <h2 className="text-2xl font-semibold mb-4 text-green-800">Competition Rules</h2>
    <div className="space-y-4 text-gray-700">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="font-bold text-yellow-800">Entries are now closed</p>
        <p className="text-sm text-yellow-700">Good luck to all participants!</p>
      </div>

      <p><strong>Entry Fee:</strong> $20</p>

      <h3 className="text-lg font-semibold text-green-700 mt-4">Scoring System</h3>
      <ul className="list-disc list-inside space-y-2 ml-2">
        <li><strong>1 point</strong> for correct series result (Winner)</li>
        <li><strong>1 further point</strong> for exact score (e.g. 3-1)</li>
        <li><strong>1 point</strong> for each correct runs scorer / wkt taker</li>
      </ul>

      <h3 className="text-lg font-semibold text-green-700 mt-4">Tiebreaker</h3>
      <p>Total runs scored in the 1st innings of the 1st Test.</p>
      <p className="text-sm text-gray-500 mt-1">Closest prediction wins in case of a points tie.</p>
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

  if (seriesData) {
    // Calculate Series Score & Winner
    const { england, australia } = seriesData.seriesScore;
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

    if (seriesData && statsData) {
      const { topRunScorers, topWicketTakers } = statsData;

      // Series Winner Points (1 point)
      if (actualSeriesWinner && p.seriesWinner === actualSeriesWinner) points += 1;

      // Exact Score Points (1 point)
      if (actualSeriesScoreStr && p.seriesScore === actualSeriesScoreStr) points += 1;

      // Run Scorer Points (1 point each) - use first element of top lists
      const leadRunEng = topRunScorers.eng[0];
      const leadRunAus = topRunScorers.aus[0];
      if (leadRunEng && leadRunEng.name !== 'TBD' && p.leadRunScorerEng === leadRunEng.name) points += 1;
      if (leadRunAus && leadRunAus.name !== 'TBD' && p.leadRunScorerAus === leadRunAus.name) points += 1;

      // Wicket Taker Points (1 point each) - use first element of top lists
      const leadWktEng = topWicketTakers.eng[0];
      const leadWktAus = topWicketTakers.aus[0];
      if (leadWktEng && leadWktEng.name !== 'TBD' && p.leadWktTakerEng === leadWktEng.name) points += 1;
      if (leadWktAus && leadWktAus.name !== 'TBD' && p.leadWktTakerAus === leadWktAus.name) points += 1;
    }

    return {
      ...p,
      totalPoints: points,
      rank: 1, // Will be sorted below
      tiebreakerDiff: Math.abs(p.tiebreaker - actualTiebreaker)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-green-800 px-2">Leaderboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedParticipants.map((participant, index) => (
          <div key={participant.id || index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Card Header */}
            <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold text-lg shadow-sm">
                  {participant.rank}
                </div>
                <h3 className="font-bold text-xl text-gray-900">{participant.name}</h3>
              </div>
              <div className="text-right">
                <span className="block text-xs text-green-800 uppercase font-bold tracking-wider">Total Points</span>
                <span className="block text-2xl font-extrabold text-green-700">{participant.totalPoints}</span>
              </div>
            </div>

            {/* Card Body - Predictions */}
            <div className="flex-grow flex flex-col">
              <div className="p-4 pb-2 text-center bg-white">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Series Score</p>
                <div className="flex items-baseline justify-center space-x-2">
                  <span className="font-black text-gray-800 text-2xl tracking-tight">{participant.seriesScore}</span>
                  <span className={`text-sm font-bold uppercase tracking-wide ${participant.seriesWinner === 'Australia' ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {participant.seriesWinner}
                  </span>
                </div>
              </div>

              {/* Split Team Section */}
              <div className="grid grid-cols-2 border-t border-gray-100 flex-grow">
                {/* England Column */}
                <div className="bg-blue-50/30 p-4 border-r border-gray-100 flex flex-col justify-center">
                  <div className="flex items-center justify-center mb-3 space-x-1">
                    <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">England</span>
                  </div>
                  <div className="space-y-3 text-center">
                    <div>
                      <p className="text-[10px] text-blue-600/80 uppercase font-bold tracking-wide mb-0.5">Run Scorer</p>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{participant.leadRunScorerEng}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-600/80 uppercase font-bold tracking-wide mb-0.5">Wkt Taker</p>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{participant.leadWktTakerEng}</p>
                    </div>
                  </div>
                </div>

                {/* Australia Column */}
                <div className="bg-yellow-50/30 p-4 flex flex-col justify-center">
                  <div className="flex items-center justify-center mb-3 space-x-1">
                    <span className="text-lg">🇦🇺</span>
                    <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Australia</span>
                  </div>
                  <div className="space-y-3 text-center">
                    <div>
                      <p className="text-[10px] text-yellow-700/80 uppercase font-bold tracking-wide mb-0.5">Run Scorer</p>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{participant.leadRunScorerAus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-yellow-700/80 uppercase font-bold tracking-wide mb-0.5">Wkt Taker</p>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{participant.leadWktTakerAus}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Tiebreaker (1st Innings)</p>
                  <p className="font-mono font-bold text-gray-700 text-lg">{participant.tiebreaker}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

type Tab = 'leaderboard' | 'stats' | 'rules';

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-8">
      <header className="bg-green-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto p-6 pb-0">
          <h1 className="text-3xl font-bold">ASHES PREDICTIONS 2025</h1>
          <p className="mt-2 text-green-100 mb-6">Good luck. 🤞🏏💰</p>

          {/* Tab Navigation */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-t-lg font-medium text-sm sm:text-base transition-colors duration-200 ${activeTab === 'leaderboard'
                ? 'bg-gray-50 text-green-900'
                : 'bg-green-900/40 text-green-100 hover:bg-green-900/60 hover:text-white'
                }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-t-lg font-medium text-sm sm:text-base transition-colors duration-200 ${activeTab === 'stats'
                ? 'bg-gray-50 text-green-900'
                : 'bg-green-900/40 text-green-100 hover:bg-green-900/60 hover:text-white'
                }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-3 rounded-t-lg font-medium text-sm sm:text-base transition-colors duration-200 ${activeTab === 'rules'
                ? 'bg-gray-50 text-green-900'
                : 'bg-green-900/40 text-green-100 hover:bg-green-900/60 hover:text-white'
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
