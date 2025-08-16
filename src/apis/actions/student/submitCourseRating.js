import baseApi from "../../base";

export default function submitCourseRating(courseId, ratingData) {
  return baseApi.post(`/courses/${courseId}/ratings/create/`, {
    rating: ratingData.rating,
    comment: ratingData.comment || null
  });
}
