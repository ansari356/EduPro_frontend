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
		moduleEnrollIn: `/course/module-enrollment/`,
		// Course modules/lessons - adjust this endpoint based on your backend structure
		courseModules: (courseId) => `/courses/${courseId}/modules/`,
		// Alternative endpoint - uncomment if this matches your backend
		// courseModules: (courseId) => `/course/${courseId}/modules/`,
		courseDetails: (courseId) => `/course/course-detail/${courseId}`,
		courseRatings: (courseId) => `/courses/${courseId}/list-ratings/`,
		listAll: (educatorUsername) => `course/teacher-list/${educatorUsername}`,
		enrollmentDelete: (courseId, enrollmentId) =>
			`/course/course-enrollment-delete/${courseId}/${enrollmentId}`,
		// New endpoint for fetching lessons within a module
		moduleLessons: (moduleId) => `/modules/${moduleId}/lessons/`,
	},

  // Assessment endpoints - Updated to match your EXACT backend structure
  assessments: {
    // Get available assessments for a teacher (EXACT ENDPOINT FROM YOUR BACKEND)
    available: (teacherUsername, courseId = null) => {
      let endpoint = `/student/assessments/${teacherUsername}/`;
      if (courseId) {
        endpoint += `?course_id=${courseId}`;
      }
      return endpoint;
    },
    
    // Start an assessment (EXACT ENDPOINT FROM YOUR BACKEND)
    start: (assessmentId, teacherUsername) => `/student/assessments/${assessmentId}/${teacherUsername}/start/`,
    
    // Submit assessment answers (EXACT ENDPOINT FROM YOUR BACKEND)
    submit: (attemptId) => `/students/attempts/${attemptId}/submit/`,
    
    // Get all attempts (EXACT ENDPOINT FROM YOUR BACKEND)
    attempts: (teacherUsername) => `/student/${teacherUsername}/attempts/`,
    
    // Get specific attempt details (EXACT ENDPOINT FROM YOUR BACKEND)
    attemptDetails: (attemptId) => `/student/attempts/${attemptId}/result/`,
  },
};