import React, { useState } from 'react';

interface Participant {
  rank: number;
  name: string;
  seriesScore: string;
  leadRunScorerEng: string;
  leadRunScorerAus: string;
  leadWktTakerEng: string;
  leadWktTakerAus: string;
  tiebreaker: number;
  totalPoints: number;
}

import participantsData from '../data/participants.json';

interface Participant {
  id: string;
  rank: number;
  name: string;
  seriesScore: string;
  seriesWinner: string;
  leadRunScorerEng: string;
  leadRunScorerAus: string;
  leadWktTakerEng: string;
  leadWktTakerAus: string;
  tiebreaker: number;
  totalPoints: number;
}

const participants: Participant[] = participantsData;

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
        <li><strong>5 points</strong> for correct series score</li>
        <li><strong>3 points</strong> for correct leading run scorer (each team)</li>
        <li><strong>3 points</strong> for correct leading wicket taker (each team)</li>
      </ul>

      <h3 className="text-lg font-semibold text-green-700 mt-4">Tiebreaker</h3>
      <p>Total runs scored in the 1st innings of the 1st Test.</p>
    </div>
  </section>
);

const LeaderboardView: React.FC = () => (
  <section className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-semibold mb-4 text-green-800 px-2">Leaderboard</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {participants.map((participant, index) => (
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

type Tab = 'leaderboard' | 'rules';

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
        {activeTab === 'leaderboard' ? <LeaderboardView /> : <RulesView />}
      </main>
    </div>
  );
};

export default Leaderboard;
