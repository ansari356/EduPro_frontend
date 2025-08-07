export const pagePaths = {
  home: "/",
  student: {
    educator: (educator_username) => `/${educator_username}`,
    login: (educator_username) => `/${educator_username}/login`,
    signup: (educator_username) => `/${educator_username}/signup`,
    profile: (educator_username) => `/${educator_username}/student/profile`,
    courses: (educator_username) => `/${educator_username}/student/courses`,
    courseDetails: (educator_username, courseId) =>
      `/${educator_username}/student/courses/${courseId}`,
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
  },
  notFound: "*",
};
