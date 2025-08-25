import baseApi from '../../base';
import { studentEndpoints } from '../../endpoints/student_api';

const submitAssessment = async (attemptId, answers) => {
  try {
    const response = await baseApi.put(studentEndpoints.assessments.submit(attemptId), {
      answers: answers
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default submitAssessment;
