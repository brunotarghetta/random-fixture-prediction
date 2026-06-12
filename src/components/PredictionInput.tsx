import React from 'react';

interface PredictionInputProps {
  matchId: string;
  teamA_goals: number;
  teamB_goals: number;
  isLocked: boolean;
  onTeamA_GoalsChange: (value: number) => void;
  onTeamB_GoalsChange: (value: number) => void;
}

export const PredictionInput: React.FC<PredictionInputProps> = ({
  matchId,
  teamA_goals,
  teamB_goals,
  isLocked,
  onTeamA_GoalsChange,
  onTeamB_GoalsChange,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        min="0"
        max="99"
        value={teamA_goals}
        onChange={(e) => onTeamA_GoalsChange(Math.max(0, parseInt(e.target.value) || 0))}
        disabled={isLocked}
        className={`w-12 px-2 py-1 border rounded text-center font-semibold ${
          isLocked
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300'
            : 'border-gray-300 focus:border-blue-500 focus:outline-none'
        }`}
        aria-label={`${matchId} - Team A goals`}
      />
      <span className="text-gray-500 font-semibold">-</span>
      <input
        type="number"
        min="0"
        max="99"
        value={teamB_goals}
        onChange={(e) => onTeamB_GoalsChange(Math.max(0, parseInt(e.target.value) || 0))}
        disabled={isLocked}
        className={`w-12 px-2 py-1 border rounded text-center font-semibold ${
          isLocked
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300'
            : 'border-gray-300 focus:border-blue-500 focus:outline-none'
        }`}
        aria-label={`${matchId} - Team B goals`}
      />
    </div>
  );
};
