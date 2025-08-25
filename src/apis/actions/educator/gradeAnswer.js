import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function gradeAnswer(answerId, gradeData) {
  return baseApi.put(educatorEndpoints.assessment.grading.answer(answerId), gradeData);
}

