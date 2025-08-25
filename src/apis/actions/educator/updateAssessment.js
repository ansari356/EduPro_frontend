import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function updateAssessment(assessmentId, assessmentData) {
  return baseApi.put(educatorEndpoints.assessment.detail(assessmentId), assessmentData);
}

