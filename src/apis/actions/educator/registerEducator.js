import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function registerEducator(data) {
	// {
	// 	"first_name": "",
	// 	"last_name": "",
	// 	"username": "",
	// 	"email": "",
	// 	"phone": "",
	// 	"password1": "",
	// 	"password2": "",
	// 	"avatar": null,
	// 	"logo": null
	// }
	return baseApi.post(educatorEndpoints.signup,data)
}