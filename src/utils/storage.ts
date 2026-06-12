import type { Prediction, PredictionStore } from '../types/index';

const PREDICTIONS_KEY = 'predictions_v1';

export const storage = {
  /**
   * Get all predictions from localStorage
   */
  getPredictions(): PredictionStore {
    try {
      const data = localStorage.getItem(PREDICTIONS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to read predictions from storage:', error);
      return {};
    }
  },

  /**
   * Save a single prediction to localStorage
   */
  savePrediction(matchId: string, prediction: Prediction): void {
    try {
      const allPredictions = this.getPredictions();
      allPredictions[matchId] = prediction;
      localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(allPredictions));
    } catch (error) {
      console.error('Failed to save prediction to storage:', error);
    }
  },

  /**
   * Save multiple predictions to localStorage
   */
  savePredictions(predictions: PredictionStore): void {
    try {
      localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
    } catch (error) {
      console.error('Failed to save predictions to storage:', error);
    }
  },

  /**
   * Delete a prediction from localStorage
   */
  deletePrediction(matchId: string): void {
    try {
      const allPredictions = this.getPredictions();
      delete allPredictions[matchId];
      localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(allPredictions));
    } catch (error) {
      console.error('Failed to delete prediction from storage:', error);
    }
  },

  /**
   * Clear all predictions from localStorage
   */
  clearPredictions(): void {
    try {
      localStorage.removeItem(PREDICTIONS_KEY);
    } catch (error) {
      console.error('Failed to clear predictions from storage:', error);
    }
  },
};
