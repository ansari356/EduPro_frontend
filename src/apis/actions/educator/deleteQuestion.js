import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function deleteQuestion(questionId) {
  return baseApi.delete(educatorEndpoints.assessment.questionDetail(questionId));
}

