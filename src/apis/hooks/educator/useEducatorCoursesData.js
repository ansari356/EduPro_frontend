import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorCoursesData() {
	
  const { isLoading, error, data, mutate } = useSWR(
		educatorEndpoints.course.educatorCourses,
	swrFetcher()
);
   	 /* 
   API Response Structure for educator's own courses:
   [
       {
           "id": "b259b8be-b0a6-43b1-b5a0-026210797c87",
           "title": "Introduction to Astrophysics",
           "description": "Introduction to Astrophysics is the study of the physical nature of celestial objects...",
           "trailer_video": null,
           "price": "100.00",
           "is_published": true,
           "is_free": false,
           "category": {
               "id": "2c746147-7e28-4f90-8e50-b3af0e662f65",
               "name": "Physics",
               "icon": null
           },
           "thumbnail": "http://127.0.0.1:8000/media/course_thumbnails/maxresdefault.jpg",
           "created_at": "2025-08-23T13:58:31.197484Z",
           "total_enrollments": 5,
           "total_lessons": 3,
           "total_reviews": 1,
           "average_rating": "5.00",
           "total_durations": 0
       }
   ]
    */
  return { isLoading, error, data, mutate };
}
