import { useMemo } from 'react';
import { type Archetype, generateStats } from '../types';

interface StatPreviewProps {
  archetype: Archetype;
}

const STAT_LABELS: { key: string; label: string; cssClass?: string }[] = [
  { key: 'strength', label: 'Strength' },
  { key: 'faith', label: 'Faith', cssClass: 'faith' },
  { key: 'psyPower', label: 'Psy Power', cssClass: 'psy' },
  { key: 'machineAffinity', label: 'Machine Affinity' },
  { key: 'corruption', label: 'Corruption', cssClass: 'corruption' },
  { key: 'luck', label: 'Luck' },
];

export function StatPreview({ archetype }: StatPreviewProps) {
  const stats = useMemo(() => generateStats(archetype), [archetype]);

  return (
    <div className="panel" data-testid="stat-preview">
      <div className="panel-title">Projected Stats</div>
      <div className="panel-subtitle">† SIMULACRUM VIRTUTIS †</div>
      <div className="stats-grid">
        {STAT_LABELS.map(({ key, label, cssClass }) => {
          const value = stats[key as keyof typeof stats];
          return (
            <div className="stat-bar" key={key} data-testid={`stat-${key}`}>
              <div className="stat-bar-label">
                <span>{label}</span>
                <span className="stat-bar-value">{value}</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className={`stat-bar-fill ${cssClass ?? ''}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
