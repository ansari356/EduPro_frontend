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

	join: /*unused*/ (teacherUsername) => `/join-teacher/${teacherUsername}/`,
	educatorPublicData: (educatorUsername) =>
		`/teacher/teacher-profile/${educatorUsername}`,
	courses: {
		enrollIn: `/course/course-enrollment/`,
		enrolledIn: (teacherUsername) =>
			`/course/course-enrollment-list/${teacherUsername}`,
		// Course modules/lessons - adjust this endpoint based on your backend structure
		courseModules: (courseId) => `/courses/${courseId}/modules/`,
		// Alternative endpoint - uncomment if this matches your backend
		// courseModules: (courseId) => `/course/${courseId}/lessons/`,
		courseDetails: (courseId) => `/course/course-detail/${courseId}`,
		listAll: (educatorUsername) => `course/teacher-list/${educatorUsername}`,
		enrollmentDelete: (courseId, enrollmentId) =>
			`/course/course-enrollment-delete/${courseId}/${enrollmentId}`,
		// New endpoint for fetching lessons within a module
		moduleLessons: (moduleId) => `/modules/${moduleId}/lessons/`,
	},
};