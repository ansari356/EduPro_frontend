import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function deleteAssessment(assessmentId) {
  return baseApi.delete(educatorEndpoints.assessment.detail(assessmentId));
}

