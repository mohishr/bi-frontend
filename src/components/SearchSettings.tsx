import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import type { SearchMode } from '@/types/search';
import { ChevronDown } from 'lucide-react';

interface SearchSettingsProps {
  mode: SearchMode;
  threshold: number;
  limit: number;
  onThresholdChange: (value: number) => void;
  onLimitChange: (value: number) => void;
  semanticWeight: number;
  keywordWeight: number;
  onSemanticWeightChange: (value: number) => void;
  onKeywordWeightChange: (value: number) => void;
}

const SearchSettings: React.FC<SearchSettingsProps> = ({
  mode,
  threshold,
  limit,
  onThresholdChange,
  onLimitChange,
  semanticWeight,
  keywordWeight,
  onSemanticWeightChange,
  onKeywordWeightChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getThresholdRange = () => {
    switch (mode) {
      case 'semantic':
        return { min: 0.3, max: 0.95, step: 0.05 };
      case 'keyword':
        return { min: 0.1, max: 0.5, step: 0.05 };
      default:
        return { min: 0.1, max: 0.95, step: 0.05 };
    }
  };

  const thresholdRange = getThresholdRange();

  return (
    <Card className="p-4 bg-background border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <h3 className="text-sm font-semibold">Settings</h3>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="space-y-4 mt-4">
          {/* Similarity Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Similarity Threshold</Label>
              <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                {threshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              value={threshold}
              onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
              min={thresholdRange.min}
              max={thresholdRange.max}
              step={thresholdRange.step}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-xs text-muted-foreground">
              {mode === 'semantic' && 'Higher = stricter similarity (0.5-0.7 recommended)'}
              {mode === 'keyword' && 'Lower = more results (0.1-0.3 typical)'}
              {mode === 'hybrid' && 'Adjust for balanced results'}
            </p>
          </div>

          {/* Results Limit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Results Per Query</Label>
              <span className="text-xs bg-primary/10 px-2 py-1 rounded">{limit}</span>
            </div>
            <input
              type="range"
              value={limit}
              onChange={(e) => onLimitChange(parseInt(e.target.value))}
              min={5}
              max={50}
              step={5}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Hybrid Mode Weights */}
          {mode === 'hybrid' && (
            <>
              <div className="pt-2 border-t">
                <h4 className="text-xs font-semibold mb-3">Hybrid Search Weights</h4>

                {/* Semantic Weight */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Semantic Weight</Label>
                    <span className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded">
                      {(semanticWeight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    value={semanticWeight}
                    onChange={(e) => {
                      const newSemantic = parseFloat(e.target.value);
                      const newKeyword = 1 - newSemantic;
                      onSemanticWeightChange(newSemantic);
                      onKeywordWeightChange(newKeyword);
                    }}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Keyword Weight */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Keyword Weight</Label>
                    <span className="text-xs bg-orange-100 text-orange-900 px-2 py-1 rounded">
                      {(keywordWeight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    value={keywordWeight}
                    onChange={(e) => {
                      const newKeyword = parseFloat(e.target.value);
                      const newSemantic = 1 - newKeyword;
                      onKeywordWeightChange(newKeyword);
                      onSemanticWeightChange(newSemantic);
                    }}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default SearchSettings;
