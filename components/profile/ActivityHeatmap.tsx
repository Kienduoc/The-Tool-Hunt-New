import React from 'react';
import { eachDayOfInterval, subDays, format, isValid, getDay, startOfWeek, endOfWeek, differenceInCalendarDays } from 'date-fns';

interface ActivityHeatmapProps {
    dates: string[]; // Array of ISO date strings
    title?: string;
    totalHunts?: number;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ dates, title = "Activity", totalHunts }) => {
    const today = new Date();

    // Get last 365 days
    // We want to end on today.
    // We want to start roughly 52 weeks ago.
    const startDate = subDays(today, 364);

    // Align start date to the beginning of the week (Sunday) to ensure the grid starts correctly
    // This might result in slightly more than 365 days, but that's fine for grid alignment.
    const gridStartDate = startOfWeek(startDate);

    // Create array of all dates in the interval
    const allDates = eachDayOfInterval({
        start: gridStartDate,
        end: today,
    });

    const dateCounts = dates.reduce((acc, dateStr) => {
        const date = new Date(dateStr);
        if (!isValid(date)) return acc;

        // Normalize to YYYY-MM-DD
        const fmtDate = format(date, 'yyyy-MM-dd');
        acc[fmtDate] = (acc[fmtDate] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const getIntensityClass = (count: number) => {
        if (!count || count === 0) return 'bg-muted/40';
        if (count === 1) return 'bg-primary/40';
        if (count === 2) return 'bg-primary/60';
        if (count === 3) return 'bg-primary/80';
        return 'bg-primary';
    };

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Calculate month labels positions
    // We iterate through weeks to find where months change
    const weeks = Math.ceil(allDates.length / 7);

    // We want to place month labels at the start of the first week of that month
    const monthLabels: { label: string, weekIndex: number }[] = [];

    let currentMonthStr = "";

    // Iterate through each week
    for (let i = 0; i < weeks; i++) {
        const dateInWeek = allDates[i * 7]; // First day of the week (Sunday)
        if (dateInWeek) {
            const monthStr = format(dateInWeek, 'MMM');
            if (monthStr !== currentMonthStr) {
                // Only add label if it fits (not too close to end?)
                // Actually GitHub just shows them.
                // We need to skip if we just added one? No.
                // But usually we want the label to be where the month *mostly* starts or just at change.
                // GitHub puts it on the first week where the month appears?
                // Let's stick to simple change detection.
                monthLabels.push({ label: monthStr, weekIndex: i });
                currentMonthStr = monthStr;
            }
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{totalHunts} {title} in the last year</h3>
            </div>

            <div className="flex overflow-x-auto pb-2">
                <div className="flex flex-col gap-1 min-w-max">
                    <div className="flex flex-row">
                        {/* Day Labels Column */}
                        <div className="flex flex-col gap-1 w-8 shrink-0 text-[10px] text-muted-foreground leading-[12px] pt-[20px] pr-2 text-right">
                            <span className="h-3"></span> {/* Sun */}
                            <span className="h-3">Mon</span>
                            <span className="h-3"></span> {/* Tue */}
                            <span className="h-3">Wed</span>
                            <span className="h-3"></span> {/* Thu */}
                            <span className="h-3">Fri</span>
                            <span className="h-3"></span> {/* Sat */}
                        </div>

                        {/* Heatmap Area */}
                        <div className="flex flex-col">
                            {/* Month Labels */}
                            <div className="flex h-5 relative mb-1 w-full">
                                {monthLabels.map((m, idx) => (
                                    <span
                                        key={idx}
                                        className="absolute text-xs text-muted-foreground"
                                        style={{ left: `${m.weekIndex * 14}px` }} // 12px width + 2px gap approx = 14px per column
                                    >
                                        {m.label}
                                    </span>
                                ))}
                            </div>

                            {/* The Grid */}
                            <div
                                className="grid grid-rows-7 grid-flow-col gap-1"
                            >
                                {allDates.map((date) => {
                                    const dateStr = format(date, 'yyyy-MM-dd');
                                    const count = dateCounts[dateStr] || 0;

                                    return (
                                        <div
                                            key={dateStr}
                                            className={`w-3 h-3 rounded-sm ${getIntensityClass(count)}`}
                                            title={`${count} items on ${format(date, 'MMM d, yyyy')}`}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted/40"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary/80"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
