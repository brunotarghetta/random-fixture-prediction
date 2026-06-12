import React, { useState, useMemo } from 'react';
import type { Match, Team, PredictionStore } from '../types/index';
import { isMatchLocked } from '../utils/predictions';
import { usePredictions } from '../hooks/usePredictions';
import { PredictionInput } from './PredictionInput';

interface PredictionModalProps {
  matches: Match[];
  teams: Team[];
  predictions: PredictionStore;
  onClose: () => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  matches,
  teams,
  predictions,
  onClose,
}) => {
  const { savePredictions } = usePredictions();
  const [editedPredictions, setEditedPredictions] = useState<PredictionStore>(predictions);

  // Group matches by round
  const matchesByRound = useMemo(() => {
    const grouped: Record<string, Match[]> = {};
    matches.forEach(match => {
      const round = match.round || 'Unknown';
      if (!grouped[round]) {
        grouped[round] = [];
      }
      grouped[round].push(match);
    });
    return grouped;
  }, [matches]);

  const handleTeamA_GoalsChange = (matchId: string, value: number) => {
    setEditedPredictions(prev => {
      const current = prev[matchId] || { matchId, teamA_goals: 0, teamB_goals: 0, createdAt: new Date().toISOString() };
      return {
        ...prev,
        [matchId]: {
          ...current,
          teamA_goals: value,
        },
      };
    });
  };

  const handleTeamB_GoalsChange = (matchId: string, value: number) => {
    setEditedPredictions(prev => {
      const current = prev[matchId] || { matchId, teamA_goals: 0, teamB_goals: 0, createdAt: new Date().toISOString() };
      return {
        ...prev,
        [matchId]: {
          ...current,
          teamB_goals: value,
        },
      };
    });
  };

  const handleSave = () => {
    // Filter out empty predictions (where both goals are 0)
    const filteredPredictions: PredictionStore = {};
    Object.entries(editedPredictions).forEach(([matchId, pred]) => {
      if (pred.teamA_goals > 0 || pred.teamB_goals > 0 || predictions[matchId]) {
        filteredPredictions[matchId] = {
          ...pred,
          createdAt: pred.createdAt || new Date().toISOString(),
        };
      }
    });

    savePredictions(filteredPredictions);
    onClose();
  };

  const getFlagUrl = (teamId: string): string => {
    return `https://flagcdn.com/w20/${teamId}.png`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Tournament Predictions</h2>
        </div>

        {/* Matches List */}
        <div className="overflow-y-auto flex-1 p-4">
          {Object.entries(matchesByRound).map(([round, roundMatches]) => (
            <div key={round} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 sticky top-0 bg-white py-2">
                {round}
              </h3>
              {roundMatches.map(match => {
                const teamA = teams.find(t => t.id === match.teamA_id);
                const teamB = teams.find(t => t.id === match.teamB_id);
                const isLocked = isMatchLocked(match);
                const pred = editedPredictions[match.id];

                return (
                  <div
                    key={match.id}
                    className={`bg-gray-50 rounded-lg p-3 mb-2 flex items-center justify-between ${
                      isLocked ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-2">
                      <img
                        src={getFlagUrl(match.teamA_id)}
                        alt={teamA?.initials}
                        className="inline-block w-6 h-4 object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="text-sm font-semibold text-gray-900 w-16 truncate">
                        {teamA?.initials || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500 mx-2">vs</span>
                      <img
                        src={getFlagUrl(match.teamB_id)}
                        alt={teamB?.initials}
                        className="inline-block w-6 h-4 object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="text-sm font-semibold text-gray-900 w-16 truncate">
                        {teamB?.initials || 'N/A'}
                      </span>
                    </div>

                    <div className="ml-4">
                      <PredictionInput
                        matchId={match.id}
                        teamA_goals={pred?.teamA_goals || 0}
                        teamB_goals={pred?.teamB_goals || 0}
                        isLocked={isLocked}
                        onTeamA_GoalsChange={(value) => handleTeamA_GoalsChange(match.id, value)}
                        onTeamB_GoalsChange={(value) => handleTeamB_GoalsChange(match.id, value)}
                      />
                    </div>

                    {isLocked && <span className="ml-2 text-xs text-gray-500">Locked</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sticky bottom-0 bg-white flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Save Predictions
          </button>
        </div>
      </div>
    </div>
  );
};
