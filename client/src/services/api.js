import axios from 'axios';

// Backend runs on port 5000. Use explicit backend URL with fallback to environment variable.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch real-time dashboard analytics including:
 * - summary (totalEvents, averageMagnitude, maxMagnitude, tsunamiEvents)
 * - magnitudeDistribution
 * - dailyTrends
 * - strongestEvents
 */
export const fetchDashboardAnalytics = async () => {
  const response = await apiClient.get('/api/analytics/dashboard');
  return response.data;
};

/**
 * Fetch database connectivity and backend health status
 */
export const fetchSystemStatus = async () => {
  const response = await apiClient.get('/api/status');
  return response.data;
};
