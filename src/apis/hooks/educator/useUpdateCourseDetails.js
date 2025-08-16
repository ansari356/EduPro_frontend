import useSWR from "swr/mutation";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function useUpdateCourseDetails(courseId) {


  const { trigger, data, error, isMutating } = useSWR(
    courseId && educatorEndpoints.course.update(courseId),
  );

  return {
    updateCourse: trigger, // function to call
    data,
    error,
    isMutating,
  };
}
