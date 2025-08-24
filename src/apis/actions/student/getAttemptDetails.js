import baseApi from '../../base';
import { studentEndpoints } from '../../endpoints/student_api';

const getAttemptDetails = async (attemptId) => {
  try {
    const response = await baseApi.get(studentEndpoints.assessments.attemptDetails(attemptId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAttemptDetails;
