//getRatesandReviews.js

import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function getRatesandReviews(courseId) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.course.ratings(courseId), swrFetcher() );

  return { isLoading, error, data, mutate };
}


