import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorCoursesData(educatorUsername) {
	
  const { isLoading, error, data, mutate } = useSWR(
   educatorUsername && educatorEndpoints.course.teacherList(educatorUsername), swrFetcher() );
   /* 
   {
        "id": "6a186759-fdc7-4fac-b6fa-9e9fe2994694",
        "title": "Course 4 by teacher1",
        "description": "This is a demo course number 4.",
        "trailer_video": null,
        "price": "4.61",
        "is_published": true,
        "is_free": false,
        "category": {
            "id": "5d13c05a-0e6f-4018-b8a4-d6e299dfaec0",
            "name": "Science",
            "icon": null
        },
        "thumbnail": null,
        "created_at": "2025-08-15T13:18:43.642890Z",
        "total_enrollments": 1,
        "total_lessons": 9,
        "total_reviews": 0,
        "average_rating": "0.00",
        "total_durations": 0
    }
    */
  return { isLoading, error, data, mutate };
}
