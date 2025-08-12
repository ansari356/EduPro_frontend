import useSWR from "swr";
import { swrFetcher } from "../../base";
import { studentEndpoints } from "../../endpoints/student_api";

export default function useListCourseModules(courseId) {
	const { isLoading, error, data, mutate } = useSWR(
		courseId && studentEndpoints.courses.courseModules(courseId),
		swrFetcher()
	);
	[
		{
			"id": "bfa27880-1a46-45d8-a354-315ff28c040b",
			"title": "Course 4 by teacher1",
			"description": "This is a demo course number 4.",
			"trailer_video": null,
			"price": "74.96",
			"is_published": true,
			"is_free": false,
			"category": {
				"id": "35830086-441d-4c53-93ea-e8c292c69b9d",
				"name": "Marketing",
				"icon": null
			},
			"thumbnail": null,
			"created_at": "2025-08-08T22:23:20.580484Z",
			"total_enrollments": 3,
			"total_lessons": 0,
			"total_reviews": 0,
			"average_rating": "0.00",
			"total_durations": 0
		},
	]
	return { isLoading, error, courseModules: data, mutate };
}