import React from 'react';

interface StatCardProps {
    variant: 'glass' | 'minimal' | 'dashboard';
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ variant, title, value, subtitle, trend, icon }) => {
    // Variant 1: Glassmorphism
    if (variant === 'glass') {
        return (
            <div className="relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-lg border border-white/20 shadow-xl text-white">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">{title}</h3>
                        {icon && <div className="p-2 bg-white/10 rounded-lg">{icon}</div>}
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tight">{value}</span>
                        {subtitle && <span className="text-sm text-white/60">{subtitle}</span>}
                    </div>

                    {trend && (
                        <div className={`mt-4 flex items-center text-sm ${trend.isPositive ? 'text-emerald-300' : 'text-rose-300'}`}>
                            <span className="font-medium">
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="ml-2 text-white/50">vs last match</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Variant 2: Minimalist
    if (variant === 'minimal') {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">{title}</h3>
                        <div className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                            {value}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        {subtitle && <span className="text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</span>}
                        {trend && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${trend.isPositive
                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Variant 3: Dashboard/Tech
    if (variant === 'dashboard') {
        return (
            <div className="bg-slate-900 rounded-lg p-0 border border-slate-700 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="p-5">
                    <div className="flex justify-between items-start">
                        <h3 className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-2">{title}</h3>
                        {icon && <div className="text-slate-500 group-hover:text-blue-400 transition-colors">{icon}</div>}
                    </div>

                    <div className="font-mono text-3xl text-white font-bold mb-1">
                        {value}
                    </div>

                    <div className="w-full h-px bg-slate-800 my-3"></div>

                    <div className="flex justify-between items-center">
                        {subtitle && <span className="text-xs text-slate-500 font-mono">{subtitle}</span>}
                        {trend && (
                            <span className={`text-xs font-mono ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {trend.isPositive ? '▲' : '▼'} {Math.abs(trend.value)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Tech decoration */}
                <div className="absolute bottom-0 right-0 p-1">
                    <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                </div>
            </div>
        );
    }

    return null;
};
