import React from 'react';
import type { Match, Team, Prediction } from '../types/index';
import { computeMatchStatus, formatScore } from '../utils/predictions';

interface MatchCardProps {
  match: Match;
  teamA: Team | undefined;
  teamB: Team | undefined;
  prediction: Prediction | undefined;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  teamA,
  teamB,
  prediction,
}) => {
  const status = computeMatchStatus(match);

  if (!teamA || !teamB) {
    return null;
  }

  const bgColor = status === 'completed' ? 'bg-completed' : 'bg-upcoming';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* Teams and Result Area */}
      <div className={`${bgColor} rounded-lg p-4 mb-3 flex items-center justify-between`}>
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">
            <img
              src={`https://flagcdn.com/w40/${teamA.id}.png`}
              alt={teamA.initials}
              className="inline-block w-8 h-5 object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="ml-1 align-middle">{teamA.flag}</span>
          </div>
          <div className="font-semibold text-sm">{teamA.initials}</div>
        </div>

        <div className="flex-1 text-center px-4">
          {match.finalScore ? (
            <div className="text-2xl font-bold text-gray-900">
              {formatScore(match.finalScore.teamA_goals, match.finalScore.teamB_goals)}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              {new Date(match.scheduledDateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>

        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">
            <img
              src={`https://flagcdn.com/w40/${teamB.id}.png`}
              alt={teamB.initials}
              className="inline-block w-8 h-5 object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="ml-1 align-middle">{teamB.flag}</span>
          </div>
          <div className="font-semibold text-sm">{teamB.initials}</div>
        </div>
      </div>

      {/* Prediction Display */}
      {prediction && (
        <div className="bg-prediction rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600 mb-1">Your Prediction</div>
          <div className="font-semibold text-gray-900">
            {formatScore(prediction.teamA_goals, prediction.teamB_goals)}
          </div>
        </div>
      )}

      {/* Empty Prediction Placeholder */}
      {!prediction && status === 'upcoming' && (
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500">No prediction yet</div>
        </div>
      )}
    </div>
  );
};
