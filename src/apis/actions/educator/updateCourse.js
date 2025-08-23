import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";


export default  function updateCourseDetailsRequest(courseId, arg ) {
  return baseApi.patch(courseId && educatorEndpoints.course.update(courseId), arg, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

