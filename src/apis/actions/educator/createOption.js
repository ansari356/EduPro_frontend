import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function createOption(questionId, optionData) {
  return baseApi.post(educatorEndpoints.assessment.options(questionId), optionData);
}

