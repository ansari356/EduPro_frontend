import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function createQuestion(assessmentId, questionData) {
  // Convert to FormData as required by API
  const formData = new FormData();
  
  // Add required fields according to API documentation
  formData.append('assessment', assessmentId);
  formData.append('question_text', questionData.question_text);
  formData.append('question_type', questionData.question_type);
  formData.append('mark', questionData.mark || questionData.points || 1); // API uses 'mark' not 'points'
  formData.append('order', questionData.order );
  
  // Add optional fields
  if (questionData.explanation) {
    formData.append('explanation', questionData.explanation);
  }
  
  if (questionData.image) {
    formData.append('image', questionData.image);
  }
  
  return baseApi.post(educatorEndpoints.assessment.questions(assessmentId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

