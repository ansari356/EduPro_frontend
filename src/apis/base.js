import axios from "axios";

const baseDomain = "http://127.0.0.1:8000";

const baseURL = `${baseDomain}/api/v1`;

const baseApi = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});

const baseAuthApi = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});



const swrFetcher = () => (url) => baseApi.get(url).then((res) => res.data);
const swrPostFetcher = (data) => (url) => baseApi.post(url, data).then((res) => res.data);


export {baseAuthApi, baseDomain, baseURL , swrFetcher, swrPostFetcher};

export default baseApi;