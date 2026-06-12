import { useState, useEffect, useCallback } from 'react';
import type { Match, Team } from '../types/index';
import teamsData from '../data/teams.json';
import matchesData from '../data/matches.json';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Load matches and teams from JSON files on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate small async delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setTeams(teamsData as Team[]);
        setMatches(matchesData as Match[]);
      } catch (error) {
        console.error('Failed to load match data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Simulate manual refresh (e.g., fetch new results)
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch fresh data from an API
      // For now, just reload from the static JSON
      setTeams(teamsData as Team[]);
      setMatches(matchesData as Match[]);
    } catch (error) {
      console.error('Failed to refresh match data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a team by ID
  const getTeam = useCallback((teamId: string): Team | undefined => {
    return teams.find(t => t.id === teamId);
  }, [teams]);

  // Get a match by ID
  const getMatch = useCallback((matchId: string): Match | undefined => {
    return matches.find(m => m.id === matchId);
  }, [matches]);

  return {
    matches,
    teams,
    loading,
    refresh,
    getTeam,
    getMatch,
  };
};
