import useSWR from "swr";
import { swrFetcher } from "../../base";
import { studentEndpoints } from "../../endpoints/student_api";
import { useParams } from "react-router-dom";

export default function useStudentProfileData() {
	const { educatorUsername } = useParams();
	const { isLoading, error, data, mutate } = useSWR(
		studentEndpoints.profile(educatorUsername),
		swrFetcher()
	);
	// {
	// "id": 1,
	// "student": {
	//     "user": {
	//         "id": "ff2370d8-7cdf-4a11-b346-c4f62198b740",
	//         "first_name": "student",
	//         "last_name": "belal",
	//         "email": "belalelbanna7@gmail.com",
	//         "slug": "belalstudent",
	//         "phone": "01221301061",
	//         "parent_phone": "01221301063",
	//         "user_type": "student",
	//         "avatar": null,
	//         "logo": null,
	//         "is_active": true,
	//         "created_at": "2025-08-07T18:21:38.776733Z",
	//         "last_login": null
	//     },
	//     "id": "c32e8574-f41c-4875-af4c-ffca1c154756",
	//     "full_name": "student belal",
	//     "bio": null,
	//     "profile_picture": null,
	//     "date_of_birth": null,
	//     "address": null,
	//     "country": null,
	//     "city": null,
	//     "gender": null
	// },
	// "enrollment_date": "2025-08-07",
	// "notes": null,
	// "is_active": true,
	// "completed_lessons": 0,
	// "last_activity": "2025-08-07T18:21:38.779364Z",
	// "number_of_completed_courses": 0,
	// "number_of_enrollment_courses": 0
	// }
	return { isLoading, error, data, mutate };
}
