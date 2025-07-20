import axios from "axios";

const baseDomain = "http://localhost:8000";

const baseURL = `${baseDomain}/api/v1`;

const baseApi = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

const baseAuthApi = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});



const swrFetcher = (url) => baseApi.get(url).then((res) => res.data);


export {baseAuthApi, baseDomain, baseURL , swrFetcher};

export default baseApi;