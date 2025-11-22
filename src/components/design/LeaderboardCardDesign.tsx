
import React from 'react';

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
    totalPoints?: number;
    rank?: number;
    correctSeriesWinner?: boolean;
    correctSeriesScore?: boolean;
    correctEngRunScorer?: boolean;
    correctEngWktTaker?: boolean;
    correctAusRunScorer?: boolean;
    correctAusWktTaker?: boolean;
}

interface LeaderboardCardProps {
    variant: 'glass' | 'minimal' | 'dashboard' | 'dashboard-hybrid' | 'dashboard-hybrid-light';
    participant: Participant;
}

export const LeaderboardCardDesign: React.FC<LeaderboardCardProps> = ({ variant, participant }) => {
    const {
        name,
        rank = 1,
        totalPoints = 24,
        seriesScore,
        seriesWinner,
        leadRunScorerEng,
        leadRunScorerAus,
        leadWktTakerEng,
        leadWktTakerAus,
        tiebreaker,
        correctSeriesWinner,
        correctSeriesScore,
        correctEngRunScorer,
        correctEngWktTaker,
        correctAusRunScorer,
        correctAusWktTaker
    } = participant;

    // Variant 1: Glassmorphism
    if (variant === 'glass') {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white p-6">
                {/* Background blobs */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg border border-white/30">
                                {rank}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-white">{name}</h3>
                                <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Rank #{rank}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{totalPoints}</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Points</div>
                        </div>
                    </div>

                    {/* Main Prediction */}
                    <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
                        <div className="text-xs text-white/50 uppercase tracking-widest mb-2 text-center">Series Prediction</div>
                        <div className="flex justify-center items-baseline gap-3">
                            <span className="text-3xl font-bold">{seriesScore}</span>
                            <span className={`text - lg font - medium ${seriesWinner === 'Australia' ? 'text-yellow-300' : 'text-blue-300'} `}>
                                {seriesWinner}
                            </span>
                        </div>
                    </div>

                    {/* Teams Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* England */}
                        <div className="bg-blue-900/20 rounded-xl p-3 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                                <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                                <span className="text-xs font-bold text-blue-200 uppercase">England</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-[10px] text-blue-200/60 uppercase">Run Scorer</div>
                                    <div className="font-medium text-sm truncate">{leadRunScorerEng}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-blue-200/60 uppercase">Wkt Taker</div>
                                    <div className="font-medium text-sm truncate">{leadWktTakerEng}</div>
                                </div>
                            </div>
                        </div>

                        {/* Australia */}
                        <div className="bg-yellow-900/20 rounded-xl p-3 border border-yellow-500/20">
                            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                                <span className="text-lg">🇦🇺</span>
                                <span className="text-xs font-bold text-yellow-200 uppercase">Australia</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-[10px] text-yellow-200/60 uppercase">Run Scorer</div>
                                    <div className="font-medium text-sm truncate">{leadRunScorerAus}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-yellow-200/60 uppercase">Wkt Taker</div>
                                    <div className="font-medium text-sm truncate">{leadWktTakerAus}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <span className="text-xs text-white/40 uppercase tracking-wider">Tiebreaker</span>
                        <span className="font-mono text-sm font-bold text-white/80">{tiebreaker} runs</span>
                    </div>
                </div>
            </div>
        );
    }

    // Variant 2: Minimalist
    if (variant === 'minimal') {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-all duration-300 group">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-900 dark:text-white">
                                {rank}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white leading-tight">{name}</h3>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Points: <span className="font-bold text-zinc-900 dark:text-white">{totalPoints}</span></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{seriesScore}</div>
                            <div className={`text - xs font - bold uppercase tracking - wide ${seriesWinner === 'Australia' ? 'text-yellow-600 dark:text-yellow-500' : 'text-blue-600 dark:text-blue-500'} `}>
                                {seriesWinner}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                                <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG</span>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-0.5">Top Bat</div>
                                <div className="font-medium text-zinc-900 dark:text-zinc-200 text-sm">{leadRunScorerEng}</div>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-0.5">Top Bowl</div>
                                <div className="font-medium text-zinc-900 dark:text-zinc-200 text-sm">{leadWktTakerEng}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                                <span>🇦🇺 AUS</span>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-0.5">Top Bat</div>
                                <div className="font-medium text-zinc-900 dark:text-zinc-200 text-sm">{leadRunScorerAus}</div>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-0.5">Top Bowl</div>
                                <div className="font-medium text-zinc-900 dark:text-zinc-200 text-sm">{leadWktTakerAus}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-medium text-zinc-500">Tiebreaker Prediction</span>
                    <span className="text-sm font-mono font-semibold text-zinc-700 dark:text-zinc-300">{tiebreaker}</span>
                </div>
            </div>
        );
    }

    // Variant 3: Dashboard/Tech
    if (variant === 'dashboard') {
        return (
            <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden relative group font-mono">
                {/* Tech accents */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full"></div>

                <div className="p-5 relative z-10">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                        <div>
                            <div className="text-[10px] text-blue-500 mb-1">Participant ID: {participant.id}</div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{name}</h3>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{totalPoints}</div>
                            <div className="text-[10px] text-slate-500">Total Points</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="col-span-1 bg-slate-900/50 p-3 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 mb-1">Series</div>
                            <div className="text-xl font-bold text-white">{seriesScore}</div>
                            <div className={`text - [10px] font - bold ${seriesWinner === 'Australia' ? 'text-yellow-500' : 'text-blue-500'} `}>
                                {seriesWinner.toUpperCase()}
                            </div>
                        </div>

                        <div className="col-span-2 grid grid-cols-2 gap-2">
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                                <div className="text-[10px] text-blue-400 mb-1">Eng Bat</div>
                                <div className="text-xs text-white truncate">{leadRunScorerEng}</div>
                            </div>
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                                <div className="text-[10px] text-yellow-400 mb-1">Aus Bat</div>
                                <div className="text-xs text-white truncate">{leadRunScorerAus}</div>
                            </div>
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                                <div className="text-[10px] text-blue-400 mb-1">Eng Bowl</div>
                                <div className="text-xs text-white truncate">{leadWktTakerEng}</div>
                            </div>
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                                <div className="text-[10px] text-yellow-400 mb-1">Aus Bowl</div>
                                <div className="text-xs text-white truncate">{leadWktTakerAus}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">Ranking Status</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">Tiebreaker:</span>
                            <span className="text-white font-bold">{tiebreaker}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Variant 4: Dashboard Hybrid (Tech Style + Glass Layout)
    if (variant === 'dashboard-hybrid') {
        return (
            <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden relative group font-mono text-sm">
                {/* Tech accents */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50 rounded-bl-lg"></div>

                <div className="p-6 relative z-10">
                    {/* Header (Glass Layout) */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-none border-2 border-blue-500/50 bg-blue-900/20 flex items-center justify-center text-xl font-bold text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                {rank}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-wider text-white uppercase">{name}</h3>
                                <div className="text-[10px] text-blue-400 uppercase tracking-widest font-medium">Rank #{rank}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white text-shadow-glow">{totalPoints}</div>
                            <div className="text-[10px] text-blue-400 uppercase tracking-widest font-medium">Total Points</div>
                        </div>
                    </div>

                    {/* Main Prediction (Glass Layout) */}
                    <div className="bg-slate-900/80 rounded-none p-4 mb-4 border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-center">Series Prediction</div>
                        <div className="flex justify-center items-baseline gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-white">{seriesScore}</span>
                                {correctSeriesScore && <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] ${seriesWinner === 'Australia' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-blue-500 shadow-blue-500/50'}`}></div>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-lg font-bold uppercase ${seriesWinner === 'Australia' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                    {seriesWinner}
                                </span>
                                {correctSeriesWinner && <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] ${seriesWinner === 'Australia' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-blue-500 shadow-blue-500/50'}`}></div>}
                            </div>
                        </div>
                    </div>

                    {/* Teams Grid (Glass Layout) */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* England */}
                        <div className="bg-blue-950/10 rounded-none p-3 border border-blue-900/30 relative">
                            <div className="flex items-center gap-2 mb-3 border-b border-blue-900/30 pb-2">
                                <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">England</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Top Run Scorer</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-white text-xs truncate">{leadRunScorerEng}</div>
                                        {correctEngRunScorer && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Top Wkt Taker</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-white text-xs truncate">{leadWktTakerEng}</div>
                                        {correctEngWktTaker && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Australia */}
                        <div className="bg-yellow-950/10 rounded-none p-3 border border-yellow-900/30 relative">
                            <div className="flex items-center gap-2 mb-3 border-b border-yellow-900/30 pb-2">
                                <span className="text-lg">🇦🇺</span>
                                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Australia</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Top Run Scorer</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-white text-xs truncate">{leadRunScorerAus}</div>
                                        {correctAusRunScorer && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_5px_rgba(234,179,8,0.8)]"></div>}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Top Wkt Taker</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-white text-xs truncate">{leadWktTakerAus}</div>
                                        {correctAusWktTaker && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_5px_rgba(234,179,8,0.8)]"></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer (Glass Layout) */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Tiebreaker</span>
                        <span className="font-mono text-sm font-bold text-blue-400">{tiebreaker} <span className="text-[10px] text-slate-600">runs</span></span>
                    </div>
                </div>
            </div>
        );
    }

    // Variant 5: Dashboard Hybrid Light (Tech Style Light Mode)
    if (variant === 'dashboard-hybrid-light') {
        return (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden relative group font-mono text-sm shadow-sm">
                {/* Tech accents */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-80"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg"></div>

                <div className="p-6 relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-none border-2 border-blue-100 bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600">
                                {rank}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-wider text-slate-800 uppercase">{name}</h3>
                                <div className="text-[10px] text-blue-600 uppercase tracking-widest font-medium">Rank #{rank}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-slate-800">{totalPoints}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Total Points</div>
                        </div>
                    </div>

                    {/* Main Prediction */}
                    <div className="bg-slate-50 rounded-none p-4 mb-4 border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-center">Series Prediction</div>
                        <div className="flex justify-center items-baseline gap-3">
                            <span className="text-3xl font-bold text-slate-800">{seriesScore}</span>
                            <span className={`text - lg font - bold uppercase ${seriesWinner === 'Australia' ? 'text-yellow-600' : 'text-blue-600'} `}>
                                {seriesWinner}
                            </span>
                        </div>
                    </div>

                    {/* Teams Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* England */}
                        <div className="bg-blue-50/50 rounded-none p-3 border border-blue-100 relative">
                            <div className="absolute top-0 right-0 p-1">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2 mb-3 border-b border-blue-100 pb-2">
                                <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">England</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Top Run Scorer</div>
                                    <div className="font-bold text-slate-700 text-xs truncate">{leadRunScorerEng}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Top Wkt Taker</div>
                                    <div className="font-bold text-slate-700 text-xs truncate">{leadWktTakerEng}</div>
                                </div>
                            </div>
                        </div>

                        {/* Australia */}
                        <div className="bg-yellow-50/50 rounded-none p-3 border border-yellow-100 relative">
                            <div className="absolute top-0 right-0 p-1">
                                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2 mb-3 border-b border-yellow-100 pb-2">
                                <span className="text-lg">🇦🇺</span>
                                <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">Australia</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Top Run Scorer</div>
                                    <div className="font-bold text-slate-700 text-xs truncate">{leadRunScorerAus}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Top Wkt Taker</div>
                                    <div className="font-bold text-slate-700 text-xs truncate">{leadWktTakerAus}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tiebreaker</span>
                        <span className="font-mono text-sm font-bold text-blue-600">{tiebreaker} <span className="text-[10px] text-slate-500">runs</span></span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
