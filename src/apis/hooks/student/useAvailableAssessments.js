import { useState, useEffect } from 'react';
import getAvailableAssessments from '../../actions/student/getAvailableAssessments';

const useAvailableAssessments = (teacherUsername, courseId = null) => {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teacherUsername) {
      return;
    }

    const fetchAssessments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getAvailableAssessments(teacherUsername, courseId);
        setAssessments(data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [teacherUsername, courseId]);

  const refreshAssessments = async () => {
    if (!teacherUsername) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAvailableAssessments(teacherUsername);
      setAssessments(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assessments,
    isLoading,
    error,
    refreshAssessments
  };
};

export default useAvailableAssessments;
