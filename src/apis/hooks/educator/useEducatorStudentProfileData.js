import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorStudentProfileData(studentId) {
	const { isLoading, error, data, mutate } = useSWR(
		studentId && educatorEndpoints.students.profile(studentId),
		swrFetcher()
	);
	/*
	data={
    "id": 11,
    "student": {
        "user": {
            "id": "67cb21ee-3b2f-4a4c-af10-6172f26c2301",
            "first_name": "Student1",
            "last_name": "User",
            "email": "student1@example.com",
            "username": "student1",
            "slug": "student1",
            "phone": "9998887771",
            "parent_phone": "5554443331",
            "user_type": "student",
            "avatar": null,
            "logo": null,
            "is_active": true,
            "created_at": "2025-08-15T13:18:42.204578Z",
            "last_login": null
        },
        "id": "986c25ed-ab9f-48ef-9a10-75663692f72c",
        "full_name": "Student1 User",
        "bio": null,
        "profile_picture": null,
        "date_of_birth": null,
        "address": null,
        "country": null,
        "city": null,
        "gender": null
    },
    "enrollment_date": "2025-08-15",
    "notes": null,
    "is_active": true,
    "completed_lessons": 0,
    "last_activity": "2025-08-15T19:35:00.254774Z",
    "number_of_completed_courses": 0,
    "number_of_enrollment_courses": 1
	}
	*/
	return { isLoading, error, data, mutate };
}