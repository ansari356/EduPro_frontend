import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function updateOption(optionId, optionData) {
  return baseApi.put(educatorEndpoints.assessment.optionDetail(optionId), optionData);
}

