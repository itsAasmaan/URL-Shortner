import { useQuery } from '@tanstack/react-query';
import analyticsService from '../services/analyticsService';

export const useURLStats = (shortCode: string, days: number = 30) => {
  return useQuery({
    queryKey: ['urlStats', shortCode, days],
    queryFn: () => analyticsService.getURLStats(shortCode, days),
    enabled: !!shortCode,
  });
};

export const useClickHistory = (shortCode: string, limit: number = 100) => {
  return useQuery({
    queryKey: ['clickHistory', shortCode, limit],
    queryFn: () => analyticsService.getClickHistory(shortCode, limit),
    enabled: !!shortCode,
  });
};