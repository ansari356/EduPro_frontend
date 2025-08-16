import { useState, useCallback, useEffect } from 'react';
import markLessonComplete from '../../actions/student/markLessonComplete';

export default function useLessonProgress(courseId) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});

  // Load lesson progress from localStorage when courseId changes
  useEffect(() => {
    if (courseId) {
      loadLessonProgressFromStorage();
    }
  }, [courseId]);

  const loadLessonProgressFromStorage = () => {
    try {
      const storageKey = `lessonProgress_${courseId}`;
      const storedProgress = localStorage.getItem(storageKey);
      if (storedProgress) {
        const progressData = JSON.parse(storedProgress);
        setLessonProgress(progressData);
        console.log('Lesson progress loaded from storage:', progressData);
      }
    } catch (err) {
      console.error('Failed to load lesson progress from storage:', err);
      setLessonProgress({});
    }
  };

  const saveLessonProgressToStorage = (progress) => {
    try {
      const storageKey = `lessonProgress_${courseId}`;
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save lesson progress to storage:', err);
    }
  };

  // Mark lesson as completed
  const markLessonAsComplete = useCallback(async (lessonId, isCompleted = true) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await markLessonComplete(lessonId, isCompleted);
      console.log('Lesson progress updated:', response.data);
      
      // Update local progress state
      const newProgress = {
        ...lessonProgress,
        [lessonId]: isCompleted
      };
      setLessonProgress(newProgress);
      
      // Save to localStorage
      saveLessonProgressToStorage(newProgress);
      
      return response.data;
    } catch (err) {
      console.error('Failed to update lesson progress:', err);
      setError(err.response?.data?.detail || 'Failed to update lesson progress');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [lessonProgress, courseId]);

  // Calculate progress percentage
  const calculateProgress = useCallback((lessons) => {
    if (!lessons || lessons.length === 0) return 0;
    const completedCount = lessons.filter(lesson => 
      lessonProgress[lesson.id] || lesson.is_completed || lesson.completed || lesson.status === 'completed'
    ).length;
    return Math.round((completedCount / lessons.length) * 100);
  }, [lessonProgress]);

  // Get completed lessons count
  const getCompletedLessonsCount = useCallback((lessons) => {
    if (!lessons) return 0;
    return lessons.filter(lesson => 
      lessonProgress[lesson.id] || lesson.is_completed || lesson.completed || lesson.status === 'completed'
    ).length;
  }, [lessonProgress]);

  // Get total lessons count
  const getTotalLessonsCount = useCallback((lessons) => {
    if (!lessons) return 0;
    return lessons.length;
  }, []);

  // Get next lesson (first uncompleted lesson in sequence)
  const getNextLesson = useCallback((lessons) => {
    if (!lessons) return null;
    return lessons.find(lesson => 
      !(lessonProgress[lesson.id] || lesson.is_completed || lesson.completed || lesson.status === 'completed')
    ) || null;
  }, [lessonProgress]);

  // Get attended sessions (completed lessons)
  const getAttendedSessions = useCallback((lessons) => {
    if (!lessons) return [];
    return lessons.filter(lesson => 
      lessonProgress[lesson.id] || lesson.is_completed || lesson.completed || lesson.status === 'completed'
    );
  }, [lessonProgress]);

  // Get remaining lessons (uncompleted lessons)
  const getRemainingLessons = useCallback((lessons) => {
    if (!lessons) return [];
    return lessons.filter(lesson => 
      !(lessonProgress[lesson.id] || lesson.is_completed || lesson.completed || lesson.status === 'completed')
    );
  }, [lessonProgress]);

  // Get lesson statistics
  const getLessonStats = useCallback((lessons) => {
    if (!lessons) {
      return {
        total: 0,
        completed: 0,
        remaining: 0,
        progress: 0,
        nextLesson: null
      };
    }

    const completed = getCompletedLessonsCount(lessons);
    const total = getTotalLessonsCount(lessons);
    const progress = calculateProgress(lessons);
    const nextLesson = getNextLesson(lessons);

    return {
      total,
      completed,
      remaining: total - completed,
      progress,
      nextLesson
    };
  }, [calculateProgress, getCompletedLessonsCount, getTotalLessonsCount, getNextLesson]);

  // Refresh lesson progress (reload from storage)
  const refreshProgress = useCallback(() => {
    loadLessonProgressFromStorage();
  }, []);

  return {
    markLessonAsComplete,
    calculateProgress,
    getCompletedLessonsCount,
    getTotalLessonsCount,
    getNextLesson,
    getAttendedSessions,
    getRemainingLessons,
    getLessonStats,
    lessonProgress,
    refreshProgress,
    isUpdating,
    error
  };
}
