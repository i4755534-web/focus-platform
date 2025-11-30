'use client';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface CompatibilityScoreProps {
  score: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CompatibilityScore({ score, showLabel = true, size = 'md' }: CompatibilityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Отличная совместимость';
    if (score >= 60) return 'Хорошая совместимость';
    if (score >= 40) return 'Средняя совместимость';
    return 'Низкая совместимость';
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className={`font-medium ${sizeClasses[size]} ${getScoreColor(score)}`}>
          {score}%
        </span>
      )}
      <div className="flex-1 min-w-[100px]">
        <Progress
          value={score}
          className="h-2"
          // Custom color based on score
          style={{
            '--progress-background': score >= 80 ? '#16a34a' :
                                   score >= 60 ? '#ca8a04' :
                                   score >= 40 ? '#ea580c' : '#dc2626'
          } as React.CSSProperties}
        />
      </div>
      {showLabel && (
        <Badge variant="outline" className={`${sizeClasses[size]} ${getScoreColor(score)}`}>
          {getScoreText(score)}
        </Badge>
      )}
    </div>
  );
}