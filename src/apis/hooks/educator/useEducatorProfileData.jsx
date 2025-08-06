import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorProfileData() {
	// {
    // "user": {
    //     "id": "5235c9db-bf68-4af8-8d7e-942efb52f406",
    //     "first_name": "sdf",
    //     "last_name": "j;;j",
    //     "email": "belal@gmail.com",
    //     "phone": "01221301062"
    // },
    // "id": "ac58c6ec-6de8-49df-b35d-bdc3574ad01f",
    // "full_name": "sdf j;;j",
    // "bio": null,
    // "profile_picture": null,
    // "date_of_birth": null,
    // "address": null,
    // "country": null,
    // "city": null,
    // "number_of_courses": 0,
    // "specialization": null,
    // "institution": null,
    // "experiance": null,
    // "number_of_students": 0,
    // "rating": "0.00",
    // "gender": null,
    // "created_at": "2025-08-05T20:40:39.547968Z",
    // "logo": null,
    // "primary_color": null,
    // "primary_color_light": null,
    // "primary_color_dark": null,
    // "secondary_color": null,
    // "accent_color": null,
    // "background_color": null
	// }
	const {isLoading ,error,data} = useSWR(educatorEndpoints.profile ,swrFetcher())
	return {isLoading,error,data};
}