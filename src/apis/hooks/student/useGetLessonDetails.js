import { useState, useEffect } from 'react';
import baseApi from '../../base';

const useGetLessonDetails = (lessonId) => {
  const [lessonData, setLessonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) {
      setLessonData(null);
      return;
    }

    const fetchLessonDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await baseApi.get(`/lessons/${lessonId}/`);
        setLessonData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
        console.error('Error fetching lesson details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonDetails();
  }, [lessonId]);

  return { lessonData, isLoading, error };
};

export default useGetLessonDetails;
