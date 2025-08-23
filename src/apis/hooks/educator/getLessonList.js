//getLessonList.js
import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function getLessonList(moduleId) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.lesson.list(moduleId), swrFetcher() );

/*
  data is an array of objects with the following properties:

  data = [
    {
        "id": "07e428b3-a422-424a-842b-4052959265d0",
        "title": "Lesson 1 in Module 1 for Course 3 by teacher1",
        "module": "Module 1 for Course 3 by teacher1",
        "otp": null,
        "playback_info": null,
        "description": "Content for lesson 1.",
        "order": 1,
        "is_published": true,
        "is_free": true,
        "duration": 1578,
        "created_at": "2025-08-15T13:18:43.776078Z",
        "document_url": null,
        "thumbnail_url": null
    },
  ]
*/
  return { isLoading, error, data, mutate };
}


