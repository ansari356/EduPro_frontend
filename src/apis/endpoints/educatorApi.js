
export const educatorEndpoints = {
	login: `/teacher/login/`,
	signup: `/teacher/teacher-register/`,
	profile: `/teacher/teacher-profile/`,
	updateProfile: `/teacher/update-profile/`,
	totalRevenue: `/teacher/revenue/`,
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

		detail: (courseId) => `course/private-deatils/${courseId}`,
		update: (courseId) => `/course/update/${courseId}`,
		delete: (courseId) => `/course/course-delete/${courseId}`,
		searchFilter: `/course/course-search-filter/`,
		educatorCourses: `/course/list-by-teacher/`,
		enrollments: (courseId) => `/get_student-enrollments/${courseId}`,
		ratings: (courseId) => `/courses/${courseId}/list-ratings/`,
	},
	students: {
		profile: (studentId) => `/teacher/get-student-profile/${studentId}`,
		list: "/teacher/get_students/",
		remove: (studentId) => `/teacher/students/remove/${studentId}/`,
		block: (studentId) => `/teacher/students/toggle-block/${studentId}/`,
	},
	coupon: {
		used: "/coupon/used-coupons/",
		create: `/coupon/create/`,
		list: `/coupon/list/`,
		detail: (couponId) => `/coupon/detail/${couponId}`,
		update: (couponId) => `/coupon/update/${couponId}`,
		delete: (couponId) => `/coupon/delete/${couponId}`,
	},
	module: {
		list: (courseId) => `/courses/${courseId}/modules/`,
		create: (courseId) => `/courses/${courseId}/modules/create/`,
		detail: (moduleId) => `/modules/${moduleId}/`, // Get module details (Lessons)
		update: (moduleId) => `/modules/${moduleId}/update/`,
		delete: (moduleId) => `/modules/${moduleId}/delete/`,
	},
	lesson: {
		videoStatus: (lessonId) => `video/check-status/${lessonId}`,
		detail: (id) => `/lessons/${id}/`,
		update: (id) => `/lessons/${id}/update/`,
		delete: (id) => `/lessons/${id}/delete/`,
		list: (moduleId) => `/modules/${moduleId}/lessons/`,
		create: (moduleId) => `/modules/${moduleId}/lessons/create/`,
	},
	assessment: {
		list: `/teacher/assessments/`,
		detail: (assessmentId) => `/teacher/assessments/${assessmentId}/`,
		questions: (assessmentId) =>
			`/teacher/assessments/${assessmentId}/questions/`,
		questionDetail: (questionId) =>
			`/teacher/assessments/questions/${questionId}/`,
		options: (questionId) =>
			`/teacher/questions/${questionId}/options/`,
		optionDetail: (optionId) => `/teacher/questions/options/${optionId}/`,
		grading: {
			pending: `/teacher/grading/pending/`,
			answer: (answerId) => `/teacher/grading/answer/${answerId}/`,
		},
	},
};
