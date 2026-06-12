import { useState, useEffect, useCallback } from 'react';
import type { Prediction, PredictionStore } from '../types/index';
import { storage } from '../utils/storage';

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<PredictionStore>({});
  const [loading, setLoading] = useState(true);

  // Load predictions from localStorage on mount
  useEffect(() => {
    const loadPredictions = () => {
      const stored = storage.getPredictions();
      setPredictions(stored);
      setLoading(false);
    };

    loadPredictions();
  }, []);

  // Save a single prediction
  const savePrediction = useCallback((matchId: string, teamA_goals: number, teamB_goals: number) => {
    const prediction: Prediction = {
      matchId,
      teamA_goals,
      teamB_goals,
      createdAt: new Date().toISOString(),
    };

    const updated = { ...predictions, [matchId]: prediction };
    setPredictions(updated);
    storage.savePrediction(matchId, prediction);
  }, [predictions]);

  // Save multiple predictions
  const savePredictions = useCallback((newPredictions: PredictionStore) => {
    const updated = { ...predictions, ...newPredictions };
    setPredictions(updated);
    storage.savePredictions(updated);
  }, [predictions]);

  // Delete a prediction
  const deletePrediction = useCallback((matchId: string) => {
    const updated = { ...predictions };
    delete updated[matchId];
    setPredictions(updated);
    storage.deletePrediction(matchId);
  }, [predictions]);

  // Clear all predictions
  const clearAllPredictions = useCallback(() => {
    setPredictions({});
    storage.clearPredictions();
  }, []);

  // Get prediction for a specific match
  const getPrediction = useCallback((matchId: string): Prediction | undefined => {
    return predictions[matchId];
  }, [predictions]);

  return {
    predictions,
    loading,
    savePrediction,
    savePredictions,
    deletePrediction,
    clearAllPredictions,
    getPrediction,
  };
};
