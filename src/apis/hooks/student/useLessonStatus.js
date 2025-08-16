import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage lesson completion status and provide real-time analytics
 * This simulates backend lesson status tracking until the actual endpoint is available
 */
export default function useLessonStatus(courseId, lessons = []) {
  const [lessonStatuses, setLessonStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load lesson statuses from localStorage on mount
  useEffect(() => {
    if (courseId && lessons.length > 0) {
      try {
        const storedStatuses = localStorage.getItem(`lessonStatuses_${courseId}`);
        if (storedStatuses) {
          setLessonStatuses(JSON.parse(storedStatuses));
        }
      } catch (err) {
        console.error('Failed to load lesson statuses:', err);
      }
    }
  }, [courseId, lessons]);

  // Save lesson statuses to localStorage
  const saveStatuses = useCallback((statuses) => {
    if (courseId) {
      try {
        localStorage.setItem(`lessonStatuses_${courseId}`, JSON.stringify(statuses));
      } catch (err) {
        console.error('Failed to save lesson statuses:', err);
      }
    }
  }, [courseId]);

  // Check if a lesson is completed
  const isLessonCompleted = useCallback((lessonId) => {
    return lessonStatuses[lessonId] || false;
  }, [lessonStatuses]);

  // Mark a lesson as completed
  const markLessonCompleted = useCallback((lessonId) => {
    setLessonStatuses(prev => {
      const newStatuses = { ...prev, [lessonId]: true };
      saveStatuses(newStatuses);
      return newStatuses;
    });
  }, [saveStatuses]);

  // Mark a lesson as incomplete
  const markLessonIncomplete = useCallback((lessonId) => {
    setLessonStatuses(prev => {
      const newStatuses = { ...prev, [lessonId]: false };
      saveStatuses(newStatuses);
      return newStatuses;
    });
  }, [saveStatuses]);

  // Calculate analytics
  const calculateAnalytics = useCallback(() => {
    if (!lessons || lessons.length === 0) {
      return {
        completedLessons: 0,
        totalLessons: 0,
        progress: 0,
        nextLesson: null
      };
    }

    const completedLessons = Object.values(lessonStatuses).filter(Boolean).length;
    const totalLessons = lessons.length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find next incomplete lesson
    const nextLesson = lessons.find(lesson => !lessonStatuses[lesson.id]);

    return {
      completedLessons,
      totalLessons,
      progress,
      nextLesson
    };
  }, [lessons, lessonStatuses]);

  // Refresh lesson statuses (placeholder for future backend integration)
  const refreshStatuses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual backend API call when available
      // const response = await getLessonStatuses(courseId);
      // setLessonStatuses(response.data);
      
      // For now, just recalculate from localStorage
      const storedStatuses = localStorage.getItem(`lessonStatuses_${courseId}`);
      if (storedStatuses) {
        setLessonStatuses(JSON.parse(storedStatuses));
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh lesson statuses');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Get current analytics
  const analytics = calculateAnalytics();

  return {
    // Lesson status methods
    isLessonCompleted,
    markLessonCompleted,
    markLessonIncomplete,
    
    // Analytics data
    completedLessons: analytics.completedLessons,
    totalLessons: analytics.totalLessons,
    progress: analytics.progress,
    nextLesson: analytics.nextLesson,
    
    // State management
    lessonStatuses,
    refreshStatuses,
    isLoading,
    error
  };
}
