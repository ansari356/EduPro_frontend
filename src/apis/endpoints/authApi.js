export const authEndpoints = {
	// "/logout/",
	// "/token/refresh/",
	logout: `/logout/`,
	refreshToken: `/token/refresh/`,
	studnetTokenRefresh:(educatorUsername)=> `/student/refresh/${educatorUsername}/`,
};