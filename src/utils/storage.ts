import type { Prediction, PredictionStore, User, UserSession, UserRegistry } from '../types/index';

const PREDICTIONS_KEY = 'predictions_v1';
const SESSION_KEY = 'session_v1';
const USERS_KEY = 'users_v1';

export const storage = {
  /**
   * Get all predictions from localStorage (legacy global key)
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
   * Save a single prediction to localStorage (legacy global key)
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
   * Save multiple predictions to localStorage (legacy global key)
   */
  savePredictions(predictions: PredictionStore): void {
    try {
      localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
    } catch (error) {
      console.error('Failed to save predictions to storage:', error);
    }
  },

  /**
   * Delete a prediction from localStorage (legacy global key)
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
   * Clear all predictions from localStorage (legacy global key)
   */
  clearPredictions(): void {
    try {
      localStorage.removeItem(PREDICTIONS_KEY);
    } catch (error) {
      console.error('Failed to clear predictions from storage:', error);
    }
  },

  // ====== Per-user prediction storage ======

  /**
   * Get per-user predictions from localStorage
   */
  getUserPredictions(username: string): PredictionStore {
    try {
      const key = this.userPredictionsKey(username);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to read user predictions from storage:', error);
      return {};
    }
  },

  /**
   * Save a single prediction under a user's namespace
   */
  saveUserPrediction(username: string, matchId: string, prediction: Prediction): void {
    try {
      const key = this.userPredictionsKey(username);
      const allPredictions = this.getUserPredictions(username);
      allPredictions[matchId] = prediction;
      localStorage.setItem(key, JSON.stringify(allPredictions));
    } catch (error) {
      console.error('Failed to save user prediction to storage:', error);
    }
  },

  /**
   * Save multiple predictions under a user's namespace
   */
  saveUserPredictions(username: string, predictions: PredictionStore): void {
    try {
      const key = this.userPredictionsKey(username);
      localStorage.setItem(key, JSON.stringify(predictions));
    } catch (error) {
      console.error('Failed to save user predictions to storage:', error);
    }
  },

  /**
   * Delete a prediction from a user's namespace
   */
  deleteUserPrediction(username: string, matchId: string): void {
    try {
      const key = this.userPredictionsKey(username);
      const allPredictions = this.getUserPredictions(username);
      delete allPredictions[matchId];
      localStorage.setItem(key, JSON.stringify(allPredictions));
    } catch (error) {
      console.error('Failed to delete user prediction from storage:', error);
    }
  },

  /**
   * Clear all predictions for a user
   */
  clearUserPredictions(username: string): void {
    try {
      const key = this.userPredictionsKey(username);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear user predictions from storage:', error);
    }
  },

  /**
   * Generate the per-user predictions storage key
   */
  userPredictionsKey(username: string): string {
    return `predictions_v1_${username}`;
  },

  // ====== Authentication storage ======

  /**
   * Get the current session from localStorage
   */
  getSession(): UserSession | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to read session from storage:', error);
      return null;
    }
  },

  /**
   * Save the session to localStorage
   */
  saveSession(session: UserSession): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  },

  /**
   * Clear the session from localStorage
   */
  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session from storage:', error);
    }
  },

  /**
   * Get all users from the registry
   */
  getUsers(): UserRegistry {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to read users from storage:', error);
      return {};
    }
  },

  /**
   * Save or update a user in the registry
   */
  saveUser(user: User): void {
    try {
      const users = this.getUsers();
      users[user.username] = user;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  },
};
