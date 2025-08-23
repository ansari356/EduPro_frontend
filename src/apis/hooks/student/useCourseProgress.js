import { useState, useEffect, useMemo, useCallback } from 'react';
import baseApi from '../../base';

const useCourseProgress = (courseId, lessons = []) => {
  const [lessonStatuses, setLessonStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a stable lesson IDs string for dependencies
  const lessonIds = useMemo(() => {
    return lessons.map(lesson => lesson.id).sort().join(',');
  }, [lessons]);

  // Fetch status for all lessons in the course
  const fetchAllLessonStatuses = useCallback(async () => {
    if (!courseId || lessons.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const statusPromises = lessons.map(lesson => 
        baseApi.get(`/lessons/${lesson.id}/status/`)
          .then(response => ({ lessonId: lesson.id, status: response.data }))
          .catch(err => ({ lessonId: lesson.id, status: null, error: err }))
      );
      
      const results = await Promise.all(statusPromises);
      const statusMap = {};
      
      results.forEach(result => {
        if (result.status) {
          statusMap[result.lessonId] = result.status;
        }
      });
      
      setLessonStatuses(statusMap);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error fetching lesson statuses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, lessonIds, lessons]);

  // Refresh all lesson statuses
  const refreshStatuses = useCallback(async () => {
    await fetchAllLessonStatuses();
  }, [fetchAllLessonStatuses]);

  // Check if a specific lesson is completed
  const isLessonCompleted = useMemo(() => {
    return (lessonId) => lessonStatuses[lessonId]?.is_completed || false;
  }, [lessonStatuses]);

  // Calculate course progress analytics
  const analytics = useMemo(() => {
    if (!lessons || lessons.length === 0) {
      return {
        completedLessons: 0,
        totalLessons: 0,
        progress: 0,
        nextLesson: null
      };
    }

    const completedLessons = Object.values(lessonStatuses).filter(status => status?.is_completed).length;
    const totalLessons = lessons.length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find next incomplete lesson
    const nextLesson = lessons.find(lesson => !lessonStatuses[lesson.id]?.is_completed);

    return {
      completedLessons,
      totalLessons,
      progress,
      nextLesson
    };
  }, [lessons, lessonStatuses]);

  // Fetch statuses on mount and when fetchAllLessonStatuses changes
  useEffect(() => {
    fetchAllLessonStatuses();
  }, [fetchAllLessonStatuses]);

  return {
    // Lesson status methods
    lessonStatuses,
    isLessonCompleted,
    
    // Analytics data
    completedLessons: analytics.completedLessons,
    totalLessons: analytics.totalLessons,
    progress: analytics.progress,
    nextLesson: analytics.nextLesson,
    
    // State management
    isLoading,
    error,
    refreshStatuses
  };
};

export default useCourseProgress;
