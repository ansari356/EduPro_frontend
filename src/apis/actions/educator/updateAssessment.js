import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function updateAssessment(assessmentId, assessmentData) {
  return baseApi.patch(educatorEndpoints.assessment.detail(assessmentId), assessmentData);
}

