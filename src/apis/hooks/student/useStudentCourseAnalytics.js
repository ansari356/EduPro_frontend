import { useState, useEffect, useCallback } from 'react';
import useListEnrolledCourses from './useListEnrolledCourses';

/**
 * Hook to provide comprehensive learning analytics for enrolled courses
 * This simulates backend analytics until the actual endpoint is available
 */
export default function useStudentCourseAnalytics() {
  const { enrolledInCourses, isLoading: coursesLoading } = useListEnrolledCourses();
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalCompletedLessons: 0,
    overallProgress: 0,
    totalEnrollments: 0,
    averageRating: 0,
    totalReviews: 0,
    totalDuration: 0,
    nextLesson: null,
    courses: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate analytics from enrolled courses
  const calculateAnalytics = useCallback(() => {
    if (!enrolledInCourses || enrolledInCourses.length === 0) {
      return {
        totalCourses: 0,
        totalLessons: 0,
        totalCompletedLessons: 0,
        overallProgress: 0,
        totalEnrollments: 0,
        averageRating: 0,
        totalReviews: 0,
        totalDuration: 0,
        nextLesson: null,
        courses: []
      };
    }

    // Load lesson progress from localStorage for each course
    const coursesWithProgress = enrolledInCourses.map(course => {
      const courseProgress = localStorage.getItem(`lessonProgress_${course.id}`);
      let completedLessons = 0;
      let totalLessons = course.total_lessons || 0;
      
      if (courseProgress) {
        try {
          const progressData = JSON.parse(courseProgress);
          completedLessons = Object.values(progressData).filter(Boolean).length;
          if (totalLessons === 0) {
            totalLessons = Object.keys(progressData).length;
          }
        } catch (err) {
          console.error('Failed to parse course progress:', err);
        }
      }

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...course,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        progress: progress,
        next_lesson: {
          topic: "Continue with next lesson",
          course: course.title || course.name
        }
      };
    });

    // Calculate overall statistics
    const totalCourses = coursesWithProgress.length;
    const totalLessons = coursesWithProgress.reduce((sum, course) => sum + (course.total_lessons || 0), 0);
    const totalCompletedLessons = coursesWithProgress.reduce((sum, course) => sum + (course.completed_lessons || 0), 0);
    const overallProgress = totalLessons > 0 ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0;
    
    // Calculate total duration (placeholder - would come from backend)
    const totalDuration = coursesWithProgress.reduce((sum, course) => {
      // Convert duration strings to minutes (placeholder logic)
      const durationStr = course.total_durations || "0";
      const duration = parseInt(durationStr) || 0;
      return sum + duration;
    }, 0);

    // Find next lesson across all courses
    const nextLesson = coursesWithProgress.find(course => course.progress < 100);
    const nextLessonData = nextLesson ? {
      title: "Continue learning",
      course: nextLesson.title || nextLesson.name,
      module_name: nextLesson.title || nextLesson.name
    } : null;

    return {
      totalCourses,
      totalLessons,
      totalCompletedLessons,
      overallProgress,
      totalEnrollments: totalCourses, // Assuming one enrollment per course
      averageRating: 4.5, // Placeholder - would come from backend
      totalReviews: 0, // Placeholder - would come from backend
      totalDuration,
      nextLesson: nextLessonData,
      courses: coursesWithProgress
    };
  }, [enrolledInCourses]);

  // Update analytics when enrolled courses change
  useEffect(() => {
    if (!coursesLoading) {
      const newAnalytics = calculateAnalytics();
      setAnalytics(newAnalytics);
    }
  }, [coursesLoading, calculateAnalytics]);

  // Refresh analytics (placeholder for future backend integration)
  const refreshAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual backend API call when available
      // const response = await getStudentAnalytics();
      // setAnalytics(response.data);
      
      // For now, recalculate from current data
      const newAnalytics = calculateAnalytics();
      setAnalytics(newAnalytics);
    } catch (err) {
      setError(err.message || 'Failed to refresh analytics');
    } finally {
      setIsLoading(false);
    }
  }, [calculateAnalytics]);

  return {
    analytics,
    refreshAnalytics,
    isLoading: coursesLoading || isLoading,
    error
  };
}
