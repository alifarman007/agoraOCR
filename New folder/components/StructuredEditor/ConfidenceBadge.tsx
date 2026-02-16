import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: number;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  // Normalize confidence (sometimes models return 0-100, sometimes 0-1)
  const score = confidence > 1 ? confidence / 100 : confidence;

  if (score >= 0.9) {
    return (
      <div className="inline-flex items-center text-green-600" title={`High Confidence (${(score * 100).toFixed(0)}%)`}>
        <CheckCircle2 className="h-4 w-4" />
      </div>
    );
  }

  if (score >= 0.7) {
    return (
      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200" title="Please review this field">
        Review
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200" title="Low confidence - check carefully">
      <AlertCircle className="h-3 w-3" />
      <span>Low Conf.</span>
    </div>
  );
};

export default ConfidenceBadge;