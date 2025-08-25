import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function createAssessment(assessmentData) {
  console.log("API Endpoint:", educatorEndpoints.assessment.list);
  console.log("Request Data:", assessmentData);
  console.log("Full URL:", baseApi.defaults.baseURL + educatorEndpoints.assessment.list);
  
  return baseApi.post(educatorEndpoints.assessment.list, assessmentData);
}
