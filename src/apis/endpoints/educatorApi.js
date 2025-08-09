
export const educatorEndpoints = {

		login: `/teacher/login/`,
		signup: `/teacher/teacher-register/`,
		profile: `/teacher/teacher-profile/`,
		updateProfile: `/teacher/update-profile/`,
		removeStudent: (studentId) => `/teacher/students/remove/${studentId}/`,
		getStudents: `/teacher/get_students/`,
	courseCategory: {

		create: `/course/category/create/`,
		list: `/course/category/list/`,
		update: (categoryId) => `/course/category/update/${categoryId}`,
	},
	course: {

		create: `/course/create/`,
		list: `/course/list/`,
		detail: (courseId) => `/course/course-detail/${courseId}`,
		update: (courseId) => `/course/update/${courseId}`,
		delete: (courseId) => `/course/course-delete/${courseId}`,
		enrollment: `/course/course-enrollment/`,
		enrollmentList: (teacherUsername) =>
			`/course/course-enrollment-list/${teacherUsername}`,
		enrollmentDelete: (courseId, enrollmentId) =>
			`/course/course-enrollment-delete/${courseId}/${enrollmentId}`,
		searchFilter: `/course/course-search-filter/`,
		teacherList: (teacherUsername) =>
		`/course/teacher-list/${teacherUsername}`,
	},
	coupon: {

		create: `/coupon/create/`,
		list: `/coupon/list/`,
		detail: (couponId) => `/coupon/detail/${couponId}`,
		update: (couponId) => `/coupon/update/${couponId}`,
		delete: (couponId) => `/coupon/delete/${couponId}`,
	},
	module: {
	
		list: (courseId) => `/courses/${courseId}/modules/`,
		create: (courseId) => `/courses/${courseId}/modules/create/`,
		detail: (moduleId) => `/modules/${moduleId}/`,
		update: (moduleId) => `/modules/${moduleId}/update/`,
		delete: (moduleId) => `/modules/${moduleId}/delete/`,
	},
	lesson: {

		detail: (id) => `/lessons/${id}/`,
		update: (id) => `/lessons/${id}/update/`,
		delete: (id) => `/lessons/${id}/delete/`,
		list: (moduleId) => `/modules/${moduleId}/lessons/`,
		create: (moduleId) => `/modules/${moduleId}/lessons/create/`,
	},
};
