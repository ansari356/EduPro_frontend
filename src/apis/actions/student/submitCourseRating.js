import baseApi from "../../base";

export default function submitCourseRating(courseId, ratingData) {
  // Comment is now required, so we can send it directly
  return baseApi.post(`/courses/${courseId}/ratings/create/`, {
    rating: ratingData.rating,
    comment: ratingData.comment.trim()
  });
}
