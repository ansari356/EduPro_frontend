import { useState, useEffect } from 'react';
import baseApi from '../../base';

const useLessonStatus = (lessonId) => {
  const [lessonStatus, setLessonStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get lesson status
  const getLessonStatus = async () => {
    if (!lessonId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await baseApi.get(`/lessons/${lessonId}/status/`);
      setLessonStatus(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error fetching lesson status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark lesson as complete
  const markLessonComplete = async () => {
    if (!lessonId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await baseApi.patch(`/lessons/${lessonId}/status/`, {
        is_completed: true
      });
      setLessonStatus(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error marking lesson complete:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update lesson status
  const updateLessonStatus = async (statusData) => {
    if (!lessonId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await baseApi.put(`/lessons/${lessonId}/status/`, statusData);
      setLessonStatus(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error updating lesson status:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch status on mount and when lessonId changes
  useEffect(() => {
    getLessonStatus();
  }, [lessonId]);

  return {
    lessonStatus,
    isLoading,
    error,
    getLessonStatus,
    markLessonComplete,
    updateLessonStatus,
    isCompleted: lessonStatus?.is_completed || false
  };
};

export default useLessonStatus;
