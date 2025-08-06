export const studentEndpoints = {
	// 		"/student/student-register/<teacher_username>",
	// 		"/student/student-profile/<teacher_username>",
	// 		"/student/update-profile/",
	// 		"/student/login/<teacher_username>/",
	//		"/join-teacher/<teacher_username>/",
	login: (teacherUsername) => `/student/login/${teacherUsername}/`,
	register: (teacherUsername) => `/student/student-register/${teacherUsername}`,
	profile: (teacherUsername) => `/student/student-profile/${teacherUsername}`,
	updateProfile: `/student/update-profile/`,
	join: (teacherUsername) => `/join-teacher/${teacherUsername}/`,
};