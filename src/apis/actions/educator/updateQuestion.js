import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function updateQuestion(questionId, questionData) {
  return baseApi.patch(educatorEndpoints.assessment.questionDetail(questionId), questionData);
}

