import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function deleteOption(optionId) {
  return baseApi.delete(educatorEndpoints.assessment.optionDetail(optionId));
}

