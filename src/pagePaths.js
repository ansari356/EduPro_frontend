export const pagePaths = {
  home: "/",
  student: {
    home: (educator_username) => `/${educator_username}`,
    about: (educator_username) => `/${educator_username}/student/about`,
    login: (educator_username) => `/${educator_username}/login`,
    signup: (educator_username) => `/${educator_username}/signup`,
    
    // Protected student routes (all under /student)
    profile: (educator_username) => `/${educator_username}/student/profile`,
    courses: (educator_username) => `/${educator_username}/student/courses`,
    courseDetails: (educator_username, courseId) =>
      `/${educator_username}/student/courses/${courseId}`,
    lessonDetails: (educator_username, courseId, lessonId) =>
      `/${educator_username}/student/course/${courseId}/lesson/${lessonId}`,
    assessmentDetails: (educator_username, assessmentId) =>
      `/${educator_username}/student/assessments/${assessmentId}`,
  },
  educator: {
    login: "/login",
    signup: "/signup",
    profile: "/educator",
    courses: "/courses",
    courseDetails: (course) => `/courses/${course}`,
    createCourse: "/courses/create",
    editCourse: (courseId) => `/courses/edit/${courseId}`,
    students: "/students",
    studentDetails: (studentId) => `/students/${studentId}`,
    coupons: "/coupons",
    assessments: "/assessments",
  },
  notFound: "*",
};
