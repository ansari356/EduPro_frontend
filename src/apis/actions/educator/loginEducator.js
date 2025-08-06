import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function loginEducator(data) {
	// {
	// 	"username": "",
	// 	"password": ""
	// }
	return baseApi.post(educatorEndpoints.login,data)
}