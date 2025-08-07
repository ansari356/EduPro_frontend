import baseApi from "../base";
import { authEndpoints } from "../endpoints/authApi";

export default function logoutUser() {
	return baseApi.post(authEndpoints.logout);
}