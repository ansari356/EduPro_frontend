import baseApi from '../../base';

const getAssessmentAttempts = async (teacherUsername) => {
  try {
    const response = await baseApi.get(`/student/${teacherUsername}/attempts/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAssessmentAttempts;
