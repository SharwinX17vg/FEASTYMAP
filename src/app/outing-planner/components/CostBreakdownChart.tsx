'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { CostBreakdown } from './plannerTypes';

interface Props {
  breakdown: CostBreakdown;
  budget: number;
}

const CHART_COLORS = ['#F97316', '#0D9488', '#6366F1', '#D97706'];
const LABELS = ['Food', 'Transport', 'Entertainment', 'Shopping'];

export default function CostBreakdownChart({ breakdown, budget }: Props) {
  const data = [
    { name: 'Food', value: breakdown.food },
    { name: 'Transport', value: breakdown.transport },
    { name: 'Entertainment', value: breakdown.entertainment },
    { name: 'Shopping', value: breakdown.shopping },
  ].filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Spend Distribution
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0];
                return (
                  <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs font-semibold text-foreground">{d.name}</p>
                    <p className="font-mono-data text-sm font-bold text-primary">
                      ₹{Number(d.value).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((Number(d.value) / breakdown.total) * 100)}% of spend
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.map((entry, idx) => (
          <div key={`legend-${entry.name}`} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
            />
            <span className="text-2xs text-muted-foreground">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}