import { useState, useEffect, useCallback } from 'react';
import type { Prediction, PredictionStore } from '../types/index';
import { storage } from '../utils/storage';

export const usePredictions = (username?: string) => {
  const [predictions, setPredictions] = useState<PredictionStore>({});
  const [loading, setLoading] = useState(true);

  // Load predictions from localStorage on mount or when username changes
  useEffect(() => {
    const loadPredictions = () => {
      let stored: PredictionStore;
      
      if (username) {
        // Load per-user predictions
        stored = storage.getUserPredictions(username);
      } else {
        // Fallback to legacy global predictions (for backward compatibility)
        stored = storage.getPredictions();
      }
      
      setPredictions(stored);
      setLoading(false);
    };

    loadPredictions();
  }, [username]);

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
    
    if (username) {
      storage.saveUserPrediction(username, matchId, prediction);
    } else {
      storage.savePrediction(matchId, prediction);
    }
  }, [predictions, username]);

  // Save multiple predictions
  const savePredictions = useCallback((newPredictions: PredictionStore) => {
    const updated = { ...predictions, ...newPredictions };
    setPredictions(updated);
    
    if (username) {
      storage.saveUserPredictions(username, updated);
    } else {
      storage.savePredictions(updated);
    }
  }, [predictions, username]);

  // Delete a prediction
  const deletePrediction = useCallback((matchId: string) => {
    const updated = { ...predictions };
    delete updated[matchId];
    setPredictions(updated);
    
    if (username) {
      storage.deleteUserPrediction(username, matchId);
    } else {
      storage.deletePrediction(matchId);
    }
  }, [predictions, username]);

  // Clear all predictions
  const clearAllPredictions = useCallback(() => {
    setPredictions({});
    
    if (username) {
      storage.clearUserPredictions(username);
    } else {
      storage.clearPredictions();
    }
  }, [username]);

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
