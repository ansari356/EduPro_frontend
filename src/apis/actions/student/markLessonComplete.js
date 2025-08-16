import baseApi from "../../base";

export default function markLessonComplete(lessonId, isCompleted) {
  return baseApi.put(`/lessons/${lessonId}/complete/`, {
    is_completed: isCompleted
  });
}
