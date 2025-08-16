import useSWR from "swr";
import { studentEndpoints } from "../../endpoints/student_api";
import { swrFetcher } from "../../base";
import { useParams } from "react-router-dom";

export default function useListAllEducatorCourses() {
	const { educatorUsername } = useParams();
	const endpoint = educatorUsername && studentEndpoints.courses.listAll(educatorUsername);
	
	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);
	
	// Sample response structure from backend
	// [
	// 	{
	// 		"id": "cc2b83c5-2d2c-461c-9bcc-affdc3210216",
	// 		"title": "Course Title",
	// 		"description": "Course description",
	// 		"trailer_video": null,
	// 		"price": "0.00",
	// 		"is_published": true,
	// 		"is_free": true,
	// 		"category": {
	// 			"id": "83bdbca4-daee-40d6-8f9e-88a2e7526f45",
	// 			"name": "Design",
	// 			"icon": null,
	// 		},
	// 		"thumbnail": null,
	// 		"created_at": "2025-08-08T22:23:20.576170Z",
	// 		"total_enrollments": 4,
	// 		"total_lessons": 0,
	// 		"total_reviews": 0,
	// 		"average_rating": "0.00",
	// 		"total_durations": 0,
	// 	}
	// ];
	
	return { isLoading, error, data, mutate };
}