import baseApi from '../../base';
import { studentEndpoints } from '../../endpoints/student_api';

const getAvailableAssessments = async (teacherUsername, courseId = null) => {
  try {
    const endpoint = studentEndpoints.assessments.available(teacherUsername, courseId);
    const response = await baseApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAvailableAssessments;
