import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import baseApi from "../../base";
import useEducatorCoursesData from "./useEducatorCoursesData";

export default function useEducatorAllModulesData() {
  const { data: courses } = useEducatorCoursesData();
  
  // Create a combined endpoint to fetch all modules from all courses
  const shouldFetch = courses && courses.length > 0;
  
  const { isLoading, error, data, mutate } = useSWR(
    shouldFetch ? 'all-modules' : null,
    async () => {
      const allModules = [];
      
      for (const course of courses) {
        try {
          const response = await baseApi.get(educatorEndpoints.module.list(course.id));
          const modules = response.data;
          
          modules.forEach(module => {
            allModules.push({
              ...module,
              course_title: course.title,
              course_id: course.id
            });
          });
        } catch (error) {
          console.error(`Error fetching modules for course ${course.id}:`, error);
        }
      }
      
      return allModules;
    }
  );

  return { isLoading, error, data, mutate };
}
