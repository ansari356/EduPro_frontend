import { useParams } from "react-router-dom";
import { studentEndpoints } from "../../endpoints/student_api";
import useSWR from "swr";
import { swrFetcher } from "../../base";

export default function useListEnrolledCourses() {
	const { educatorUsername } = useParams();
	const { isLoading, error, data, mutate } = useSWR(
		educatorUsername && studentEndpoints.courses.enrolledIn(educatorUsername),
		swrFetcher()
	)
	// [
	// 	{
	// 		id: "cc2b83c5-2d2c-461c-9bcc-affdc3210216",
	// 		title: "Course 3 by teacher2",
	// 		description: "This is a demo course number 3.",
	// 		trailer_video: null,
	// 		price: "0.00",
	// 		is_published: true,
	// 		is_free: true,
	// 		category: {
	// 			id: "83bdbca4-daee-40d6-8f9e-88a2e7526f45",
	// 			name: "Design",
	// 			icon: null,
	// 		},
	// 		thumbnail: null,
	// 		created_at: "2025-08-08T22:23:20.576170Z",
	// 		total_enrollments: 4,
	// 		total_lessons: 0,
	// 		total_reviews: 0,
	// 		average_rating: "0.00",
	// 		total_durations: 0,
	// 	}
	// ];
	return { isLoading, error, enrolledInCourses: data?.results, mutate };
}