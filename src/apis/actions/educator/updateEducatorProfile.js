import { baseAuthApi } from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

const updateEducatorProfile =  (profileData) => baseAuthApi.put(educatorEndpoints.updateProfile, profileData, {
      headers: {
        "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
      },
    });


export default updateEducatorProfile;
