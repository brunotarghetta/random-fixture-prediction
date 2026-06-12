import React, { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { usePredictions } from '../hooks/usePredictions';
import { getTodayMatches } from '../utils/date';
import { MatchCard } from './MatchCard';
import { PredictionModal } from './PredictionModal';

export const MainPage: React.FC = () => {
  const { matches, teams, loading, refresh } = useMatches();
  const { predictions } = usePredictions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayMatches = getTodayMatches(matches);

  const handleRefresh = async () => {
    await refresh();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">World Cup Predictions</h1>
          <div className="flex gap-2">
            <button
              onClick={handleOpenModal}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Load Predictions
            </button>
            <button
              onClick={handleRefresh}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {todayMatches.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No matches today</h2>
            <p className="text-gray-600 mb-4">
              No World Cup matches are scheduled for today. 
              Click "Load Predictions" to see the full tournament schedule.
            </p>
            <button
              onClick={handleOpenModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              View All Matches
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Today's Matches ({todayMatches.length})
            </h2>
            {todayMatches.map(match => {
              const teamA = teams.find(t => t.id === match.teamA_id);
              const teamB = teams.find(t => t.id === match.teamB_id);
              const prediction = predictions[match.id];

              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  teamA={teamA}
                  teamB={teamB}
                  prediction={prediction}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Prediction Modal */}
      {isModalOpen && (
        <PredictionModal
          matches={matches}
          teams={teams}
          predictions={predictions}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
