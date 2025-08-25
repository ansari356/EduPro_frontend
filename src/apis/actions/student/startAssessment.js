import baseApi from '../../base';
import { studentEndpoints } from '../../endpoints/student_api';

const startAssessment = async (assessmentId, teacherUsername) => {
  try {
    const endpoint = studentEndpoints.assessments.start(assessmentId, teacherUsername);
    const response = await baseApi.post(endpoint, {
      assessment_id: assessmentId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default startAssessment;
