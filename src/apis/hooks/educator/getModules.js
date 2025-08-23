//getModules.js
import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function getModules(courseId) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.module.list(courseId), swrFetcher() );
/*
  data is an array of objects with the following properties:

  data = [
    {
        "id": "5847229f-8fbf-4ae4-9c3a-31d273a38313",
        "title": "Module 1 for Course 3 by teacher1",
        "course": "Course 3 by teacher1",
        "order": 1,
        "price": "0.00",
        "is_free": true,
        "total_lessons": 0,
        "total_duration": 0,
        "image_url": null
    },
  ]
*/
  return { isLoading, error, data, mutate };
}


