import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import baseApi from "../../base";
import useEducatorCoursesData from "./useEducatorCoursesData";

export default function useEducatorAllLessonsData() {
  const { data: courses } = useEducatorCoursesData();
  
  // Create a combined endpoint to fetch all lessons from all courses
  const shouldFetch = courses && courses.length > 0;
  
  const { isLoading, error, data, mutate } = useSWR(
    shouldFetch ? 'all-lessons' : null,
    async () => {
      const allLessons = [];
      
      for (const course of courses) {
        try {
          // First get modules for this course
          const modulesResponse = await baseApi.get(educatorEndpoints.module.list(course.id));
          const modules = modulesResponse.data;
          
          // Then get lessons for each module
          for (const module of modules) {
            try {
              const lessonsResponse = await baseApi.get(educatorEndpoints.lesson.list(module.id));
              const lessons = lessonsResponse.data;
              
              lessons.forEach(lesson => {
                allLessons.push({
                  ...lesson,
                  course_title: course.title,
                  module_title: module.title,
                  course_id: course.id,
                  module_id: module.id
                });
              });
            } catch (error) {
              console.error(`Error fetching lessons for module ${module.id}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error fetching modules for course ${course.id}:`, error);
        }
      }
      
      return allLessons;
    }
  );

  return { isLoading, error, data, mutate };
}
