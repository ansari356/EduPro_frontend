import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  BarChart3,
  Settings,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useEducatorAssessmentsData from "../../apis/hooks/educator/useEducatorAssessmentsData";
import useEducatorAllAttempts from "../../apis/hooks/educator/useEducatorAllAttempts";
import useEducatorPendingGradingData from "../../apis/hooks/educator/useEducatorPendingGradingData";
import useEducatorCoursesData from "../../apis/hooks/educator/useEducatorCoursesData";
import useEducatorStudentProfileData from "../../apis/hooks/educator/useEducatorStudentProfileData";
import useEducatorAllLessonsData from "../../apis/hooks/educator/useEducatorAllLessonsData";
import useEducatorAllModulesData from "../../apis/hooks/educator/useEducatorAllModulesData";
import createAssessment from "../../apis/actions/educator/createAssessment";
import updateAssessment from "../../apis/actions/educator/updateAssessment";
import deleteAssessment from "../../apis/actions/educator/deleteAssessment";
import createQuestion from "../../apis/actions/educator/createQuestion";
import updateQuestion from "../../apis/actions/educator/updateQuestion";
import deleteQuestion from "../../apis/actions/educator/deleteQuestion";
import createOption from "../../apis/actions/educator/createOption";
import updateOption from "../../apis/actions/educator/updateOption";
import deleteOption from "../../apis/actions/educator/deleteOption";
import gradeAnswer from "../../apis/actions/educator/gradeAnswer";
import { educatorEndpoints } from "../../apis/endpoints/educatorApi";
import baseApi from "../../apis/base";
import QuestionModal from "../../components/common/QuestionModal/QuestionModal";
import useEducatorQuestionDetail from "../../apis/hooks/educator/useEducatorQuestionDetail";

// Student Avatar Component that fetches student profile data
function StudentAvatar({ studentName, attemptId }) {
  // Extract student ID from attempt ID or use a different approach
  // For now, we'll use the student name to create a nice avatar
  const firstLetter = studentName?.[0]?.toUpperCase() || "S";

  return (
    <div className="d-flex align-items-center">
      <div
        className="avatar-circle me-3 d-flex align-items-center justify-content-center"
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "var(--color-secondary)",
          color: "var(--color-primary-dark)",
          fontSize: "16px",
          fontWeight: "600"
        }}
      >
        {firstLetter}
      </div>
      <div>
        <div className="fw-bold">{studentName || "Unknown Student"}</div>
        <small className="text-muted">Attempt: {attemptId?.slice(-8) || "N/A"}</small>
      </div>
    </div>
  );
}

export default function EducatorAssessmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assessments");
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [showGradeAnswer, setShowGradeAnswer] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // Toggle dropdown function
  const toggleDropdown = (assessmentId) => {
    setOpenDropdownId(openDropdownId === assessmentId ? null : assessmentId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Data hooks
  const { data: assessments, isLoading: assessmentsLoading, error: assessmentsError, mutate: mutateAssessments } = useEducatorAssessmentsData();
  const { data: pendingGrading, isLoading: gradingLoading, error: gradingError, mutate: mutateGrading } = useEducatorPendingGradingData();
  // const { attempts: allAttempts, summary: attemptsSummary, isLoading: attemptsLoading, error: attemptsError, mutate: mutateAttempts } = useEducatorAllAttempts();
  const { data: courses, isLoading: coursesLoading } = useEducatorCoursesData();
  const { data: lessons, isLoading: lessonsLoading } = useEducatorAllLessonsData();
  const { data: modules, isLoading: modulesLoading } = useEducatorAllModulesData();

  // Debug logging (remove in production)
  // console.log("Courses data:", courses);
  // console.log("Lessons data:", lessons);
  // console.log("Modules data:", modules);

  // Hook to fetch full question details when editing (after editingQuestionId state is declared)
  const {
    data: questionDetail,
    isLoading: questionDetailLoading,
    error: questionDetailError
  } = useEducatorQuestionDetail(editingQuestionId);

  // Form states
  const [assessmentForm, setAssessmentForm] = useState({
    title: "",
    description: "",
    assessment_type: "quiz",
    lesson: "",
    module: "",
    course: "",
    passing_score: 70,
    is_published: false,
    is_timed: false,
  });

  const [gradingForm, setGradingForm] = useState({
    marks_awarded: "",
    teacher_feedback: "",
    is_correct: false,
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    question_type: "multiple_choice",
    points: 1,
    order: 1,
    explanation: "",
    image: null,
    options: [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false }
    ]
  });



  // Populate form when question details are loaded
  useEffect(() => {
    if (questionDetail && editingQuestionId) {
      console.log("Populating form with question details:", questionDetail);
      setQuestionForm({
        question_text: questionDetail.question_text || "",
        question_type: questionDetail.question_type || "multiple_choice",
        points: questionDetail.points || questionDetail.mark || 1,
        order: questionDetail.order || 1,
        explanation: questionDetail.explanation || "",
        image: null, // Don't pre-populate file input
        options: questionDetail.options && questionDetail.options.length > 0
          ? questionDetail.options.map(opt => ({
            id: opt.id,
            option_text: opt.option_text || "",
            is_correct: Boolean(opt.is_correct)
          }))
          : [
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false }
          ]
      });
      setShowCreateQuestion(true);
    }
  }, [questionDetail, editingQuestionId]);

  // Filtered and sorted assessments
  const filteredAssessments = assessments?.filter(assessment => {
    try {
      const matchesSearch = searchTerm === "" ||
        (assessment.title && assessment.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assessment.description && assessment.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Fix: Use is_published instead of status since API returns is_published boolean
      const matchesStatus = filterStatus === "all" ||
        (filterStatus === "published" && assessment.is_published) ||
        (filterStatus === "draft" && !assessment.is_published);

      return matchesSearch && matchesStatus;
    } catch (error) {
      console.error("Error filtering assessment:", error, assessment);
      return false;
    }
  }) || [];

  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    try {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle undefined/null values
      if (aValue === undefined || aValue === null) aValue = "";
      if (bValue === undefined || bValue === null) bValue = "";

      // Handle date sorting
      if (sortBy === "created_at") {
        aValue = new Date(aValue).getTime() || 0;
        bValue = new Date(bValue).getTime() || 0;
      }

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    } catch (error) {
      console.error("Error sorting assessments:", error);
      return 0;
    }
  });

  // Assessment management functions
  const handleCreateAssessment = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      if (!assessmentForm.title?.trim()) {
        alert("Assessment title is required");
        return;
      }

      if (!assessmentForm.assessment_type) {
        alert("Assessment type is required");
        return;
      }

      // Validate relationship field based on assessment type
      if (assessmentForm.assessment_type === "quiz" && !assessmentForm.lesson) {
        alert("Please select a lesson for the quiz");
        return;
      }

      if (assessmentForm.assessment_type === "assignment" && !assessmentForm.module) {
        alert("Please select a module for the assignment");
        return;
      }

      if (assessmentForm.assessment_type === "course_exam" && !assessmentForm.course) {
        alert("Please select a course for the exam");
        return;
      }

      // Prepare the data for API
      const assessmentData = {
        title: assessmentForm.title.trim(),
        description: assessmentForm.description?.trim() || undefined,
        assessment_type: assessmentForm.assessment_type,
        is_published: Boolean(assessmentForm.is_published),
        is_timed: Boolean(assessmentForm.is_timed),
        time_limit: assessmentForm.is_timed ? parseInt(assessmentForm.time_limit) || 30 : undefined,
        max_attempts: parseInt(assessmentForm.max_attempts) || 3,
        passing_score: assessmentForm.passing_score ? parseFloat(assessmentForm.passing_score) : undefined
      };

      // Add the appropriate relationship based on assessment type
      if (assessmentForm.assessment_type === "quiz" && assessmentForm.lesson) {
        assessmentData.lesson = assessmentForm.lesson;
      } else if (assessmentForm.assessment_type === "assignment" && assessmentForm.module) {
        assessmentData.module = assessmentForm.module;
      } else if (assessmentForm.assessment_type === "course_exam" && assessmentForm.course) {
        assessmentData.course = assessmentForm.course;
      }

      console.log("Creating assessment with data:", assessmentData);
      const response = await createAssessment(assessmentData);
      console.log("Assessment created successfully:", response);

      // Reset form and close modal
      const resetForm = {
        title: "",
        description: "",
        assessment_type: "quiz",
        lesson: "",
        module: "",
        course: "",
        passing_score: 70,
        is_published: false,
        is_timed: false,
        time_limit: 30,
        max_attempts: 3
      };

      setShowCreateAssessment(false);
      setAssessmentForm(resetForm);

      // Refresh data
      if (mutateAssessments) {
        await mutateAssessments();
      }

    } catch (error) {
      console.error("Error creating assessment:", error);

      // Enhanced error handling
      let errorMessage = "Failed to create assessment. Please try again.";

      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          // Handle validation errors
          const errorMessages = [];
          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error creating assessment:\n${errorMessage}`);
    }
  };

  const handleUpdateAssessment = async (e) => {
    e.preventDefault();

    if (!selectedAssessment?.id) {
      alert("No assessment selected for update");
      return;
    }

    try {
      const updateData = {
        ...assessmentForm,
        title: assessmentForm.title?.trim(),
        description: assessmentForm.description?.trim() || undefined,
        is_published: Boolean(assessmentForm.is_published),
        is_timed: Boolean(assessmentForm.is_timed),
        time_limit: assessmentForm.is_timed ? parseInt(assessmentForm.time_limit) || 30 : undefined,
        max_attempts: parseInt(assessmentForm.max_attempts) || 3,
        passing_score: assessmentForm.passing_score ? parseFloat(assessmentForm.passing_score) : undefined
      };

      await updateAssessment(selectedAssessment.id, updateData);
      setShowCreateAssessment(false);
      setSelectedAssessment(null);

      if (mutateAssessments) {
        await mutateAssessments();
      }
    } catch (error) {
      console.error("Error updating assessment:", error);
      alert(`Failed to update assessment: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!assessmentId) {
      alert("Invalid assessment ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      try {
        await deleteAssessment(assessmentId);
        if (mutateAssessments) {
          await mutateAssessments();
        }
      } catch (error) {
        console.error("Error deleting assessment:", error);
        alert(`Failed to delete assessment: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Question management functions
  const handleCreateQuestion = async (e) => {
    e.preventDefault();

    if (!selectedAssessment?.id) {
      alert("No assessment selected");
      return;
    }

    if (!questionForm.question_text?.trim()) {
      alert("Question text is required");
      return;
    }

    // Validate options for multiple choice questions
    const validOptions = questionForm.options?.filter(opt => opt.option_text?.trim() !== "") || [];
    if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && validOptions.length < 2) {
      alert("Please provide at least 2 options for this question type");
      return;
    }

    // Ensure at least one correct answer for multiple choice
    if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && !validOptions.some(opt => opt.is_correct)) {
      alert("Please mark at least one option as correct");
      return;
    }

    setQuestionLoading(true);

    try {
      // Step 1: Create the question
      const questionData = {
        question_text: questionForm.question_text.trim(),
        question_type: questionForm.question_type,
        mark: parseInt(questionForm.points) || 1, // API uses 'mark' field
        order: parseInt(questionForm.order) || 1,
        explanation: questionForm.explanation?.trim() || undefined,
        image: questionForm.image || undefined
      };

      console.log("Creating question with data:", questionData);
      const questionResponse = await createQuestion(selectedAssessment.id, questionData);
      console.log("Question created successfully:", questionResponse);
      console.log("Full response structure:", JSON.stringify(questionResponse, null, 2));

      // Step 2: Create options if this is a multiple choice or true/false question
      if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && validOptions.length > 0) {
        // Try different possible response structures
        let questionId = questionResponse.data?.id ||
          questionResponse.id ||
          questionResponse.data?.question?.id ||
          questionResponse.question?.id;

        console.log("Extracted question ID:", questionId);
        console.log("Response data:", questionResponse.data);

        if (!questionId) {
          console.error("Could not extract question ID from response:", questionResponse);
          console.log("Attempting to fetch questions to find the newly created question...");

          // Fallback: Try to fetch the questions and find the one we just created
          try {
            const questionsResponse = await baseApi.get(educatorEndpoints.assessment.questions(selectedAssessment.id));
            const questionsData = questionsResponse.data;
            console.log("Fetched questions:", questionsData);

            // Find the question with matching text (most recently created)
            const newQuestion = questionsData.find(q =>
              q.question_text === questionForm.question_text.trim()
            );

            if (newQuestion && newQuestion.id) {
              questionId = newQuestion.id;
              console.log("Found question ID from questions list:", questionId);
            }
          } catch (fetchError) {
            console.error("Error fetching questions for fallback:", fetchError);
          }

          if (!questionId) {
            console.warn("Could not extract question ID - options will not be created automatically");
            console.warn("You may need to edit the question to add options manually");

            // Don't throw error, just skip options creation
            alert("Question created successfully, but options could not be added automatically. Please edit the question to add options.");

            // Reset form and close modal
            const resetQuestionForm = {
              question_text: "",
              question_type: "multiple_choice",
              points: 1,
              order: 1,
              explanation: "",
              image: null,
              options: [
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false }
              ]
            };

            setShowCreateQuestion(false);
            setQuestionForm(resetQuestionForm);

            if (mutateAssessments) {
              await mutateAssessments();
            }

            return; // Exit early, skip options creation
          }
        }

        console.log("Creating options for question:", questionId);

        // Create each option
        for (let i = 0; i < validOptions.length; i++) {
          const option = validOptions[i];
          const optionData = {
            question: questionId,
            option_text: option.option_text.trim(),
            is_correct: Boolean(option.is_correct),
            order: i + 1
          };

          console.log(`Creating option ${i + 1}:`, optionData);
          await createOption(questionId, optionData);
        }

        console.log("All options created successfully");
      }

      // Reset form and close modal
      const resetQuestionForm = {
        question_text: "",
        question_type: "multiple_choice",
        points: 1,
        order: 1,
        explanation: "",
        image: null,
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false }
        ]
      };

      setShowCreateQuestion(false);
      setQuestionForm(resetQuestionForm);

      if (mutateAssessments) {
        await mutateAssessments();
      }

      alert("Question created successfully!");

    } catch (error) {
      console.error("Error creating question:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Failed to create question. Please try again.";

      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          const errorMessages = [];
          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error creating question:\n${errorMessage}`);
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();

    if (!selectedQuestion?.id) {
      alert("No question selected for update");
      return;
    }

    if (!questionForm.question_text?.trim()) {
      alert("Question text is required");
      return;
    }

    // Validate options for multiple choice questions
    const validOptions = questionForm.options?.filter(opt => opt.option_text?.trim() !== "") || [];
    if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && validOptions.length < 2) {
      alert("Please provide at least 2 options for this question type");
      return;
    }

    // Ensure at least one correct answer for multiple choice
    if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && !validOptions.some(opt => opt.is_correct)) {
      alert("Please mark at least one option as correct");
      return;
    }

    setQuestionLoading(true);

    try {
      // Step 1: Update the question
      const questionData = {
        question_text: questionForm.question_text.trim(),
        question_type: questionForm.question_type,
        mark: parseInt(questionForm.points) || 1, // API uses 'mark' field
        order: parseInt(questionForm.order) || 1,
        explanation: questionForm.explanation?.trim() || undefined,
        image: questionForm.image || undefined
      };

      console.log("Updating question with data:", questionData);
      await updateQuestion(selectedQuestion.id, questionData);

      // Step 2: Handle options for multiple choice and true/false questions
      if (questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") {
        const existingOptions = selectedQuestion.options || [];

        console.log("Existing options:", existingOptions);
        console.log("New options:", validOptions);

        // Delete options that are no longer present
        for (const existingOption of existingOptions) {
          const stillExists = validOptions.some(newOpt =>
            newOpt.id === existingOption.id ||
            (newOpt.option_text.trim() === existingOption.option_text && newOpt.is_correct === existingOption.is_correct)
          );

          if (!stillExists && existingOption.id) {
            console.log("Deleting option:", existingOption.id);
            try {
              await deleteOption(existingOption.id);
            } catch (deleteError) {
              console.warn("Failed to delete option:", existingOption.id, deleteError);
            }
          }
        }

        // Update or create options
        for (let i = 0; i < validOptions.length; i++) {
          const option = validOptions[i];
          const optionData = {
            question: selectedQuestion.id,
            option_text: option.option_text.trim(),
            is_correct: Boolean(option.is_correct),
            order: i + 1
          };

          // Check if this is an existing option (has an ID) or a new one
          if (option.id) {
            // Update existing option
            console.log(`Updating option ${option.id}:`, optionData);
            try {
              await updateOption(option.id, optionData);
            } catch (updateError) {
              console.warn("Failed to update option, trying to create new one:", updateError);
              // If update fails, try to create a new option
              await createOption(selectedQuestion.id, optionData);
            }
          } else {
            // Create new option
            console.log(`Creating new option:`, optionData);
            await createOption(selectedQuestion.id, optionData);
          }
        }

        console.log("All options updated successfully");
      }

      setShowCreateQuestion(false);
      setSelectedQuestion(null);
      setEditingQuestionId(null);

      if (mutateAssessments) {
        await mutateAssessments();
      }

      alert("Question updated successfully!");

    } catch (error) {
      console.error("Error updating question:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Failed to update question. Please try again.";

      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          const errorMessages = [];
          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error updating question:\n${errorMessage}`);
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(questionId);
        mutateAssessments();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };



  // Grading functions
  const handleGradeAnswer = async (e) => {
    e.preventDefault();

    if (!selectedAnswer?.id) {
      alert("No answer selected for grading");
      return;
    }

    const pointsAwarded = parseInt(gradeForm.points_awarded) || 0;
    const maxPoints = selectedAnswer.question?.points || 0;

    if (pointsAwarded < 0 || pointsAwarded > maxPoints) {
      alert(`Points awarded must be between 0 and ${maxPoints}`);
      return;
    }

    try {
      await gradeAnswer(selectedAnswer.id, {
        points_awarded: pointsAwarded,
        teacher_feedback: gradeForm.teacher_feedback?.trim() || undefined,
        is_correct: pointsAwarded > 0
      });

      setShowGradeAnswer(false);
      setSelectedAnswer(null);
      setGradeForm({ points_awarded: 0, teacher_feedback: "" });

      if (mutateGrading) {
        await mutateGrading();
      }
    } catch (error) {
      console.error("Error grading answer:", error);
      alert(`Failed to grade answer: ${error.response?.data?.message || error.message}`);
    }
  };

  // Edit functions
  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setAssessmentForm({
      title: assessment.title || "",
      description: assessment.description || "",
      assessment_type: assessment.assessment_type || "quiz",
      lesson: assessment.lesson || "",
      module: assessment.module || "",
      course: assessment.course || "",
      passing_score: assessment.passing_score || assessment.passing_grade || 70,
      is_published: Boolean(assessment.is_published),
      is_timed: Boolean(assessment.is_timed),
      time_limit: assessment.time_limit || 30,
      max_attempts: assessment.max_attempts || 3
    });
    setShowCreateAssessment(true);
  };

  const handleEditQuestion = (question) => {
    console.log("Starting to edit question:", question.id);
    setSelectedQuestion(question);
    setEditingQuestionId(question.id);
    // The form will be populated automatically when questionDetail is loaded via useEffect
  };

  const handleGradeAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setGradingForm({
      marks_awarded: answer.marks_awarded || "0.00",
      teacher_feedback: answer.teacher_feedback || "",
      is_correct: answer.is_correct || false,
    });
    setShowGradeAnswer(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await baseApi.put(
        educatorEndpoints.assessment.grading.answer(selectedAnswer.id),
        gradingForm
      );

      if (response.status === 200) {
        // Refresh the pending grading data
        mutateGrading();
        setShowGradeAnswer(false);
        setSelectedAnswer(null);
        setGradingForm({
          marks_awarded: "",
          teacher_feedback: "",
          is_correct: false,
        });
        alert("Answer graded successfully!");
      }
    } catch (error) {
      console.error("Error grading answer:", error);
      alert("Failed to grade answer. Please try again.");
    }
  };

  if (assessmentsLoading) {
    return (
      <div className="profile-root p-4">
        <div className="container text-center py-5">
          <div className="loading-spinner"></div>
          <p className="mt-3 text-muted">Loading assessments...</p>
        </div>
      </div>
    );
  }

  if (assessmentsError) {
    return (
      <div className="profile-root p-4">
        <div className="container">
          <div className="alert alert-danger">
            <h5 className="alert-heading">Error Loading Assessments</h5>
            <p className="mb-0">
              {assessmentsError.response?.data?.message ||
                assessmentsError.message ||
                "Failed to load assessments. Please try refreshing the page."}
            </p>
            <hr />
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root p-4">
      <div className="container">
        {/* Header */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="header-avatar me-3">
                  <FileText size={20} />
                </div>
                <div>
                  <h1 className="main-title mb-0">Assessment Management</h1>
                  <p className="profile-role mb-0">Create and manage assessments for your courses</p>
                </div>
              </div>
              <button
                className="btn-edit-profile d-flex align-items-center"
                onClick={() => setShowCreateAssessment(true)}
              >
                <Plus size={18} className="me-2" />
                Create Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <ul className="nav nav-tabs border-0" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "assessments" ? "active" : ""}`}
                  onClick={() => setActiveTab("assessments")}
                >
                  <FileText size={16} className="me-2" />
                  Assessments
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "grading" ? "active" : ""}`}
                  onClick={() => setActiveTab("grading")}
                >
                  <CheckCircle size={16} className="me-2" />
                  Pending Grading
                  {pendingGrading && pendingGrading.length > 0 && (
                    <span className="badge bg-warning ms-2">{pendingGrading.length}</span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <FileText size={32} className="mb-2" />
                      <h3 className="mb-1">{assessments?.length || 0}</h3>
                      <p className="mb-0">Total Assessments</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-4">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <CheckCircle size={32} className="mb-2" />
                      <h3 className="mb-1">{pendingGrading?.length || 0}</h3>
                      <p className="mb-0">Pending Grading</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-4">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <Users size={32} className="mb-2" />
                      <h3 className="mb-1">0</h3>
                      <p className="mb-0">Total Attempts</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-4">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <BarChart3 size={32} className="mb-2" />
                      <h3 className="mb-1">0%</h3>
                      <p className="mb-0">Avg. Score</p>
                    </div>
                  </div>
                </div>
              </div> 
        {/* Assessments Tab */}
        {activeTab === "assessments" && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Search and Filters */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search assessments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="created_at">Created Date</option>
                      <option value="title">Title</option>
                      <option value="assessment_type">Type</option>
                    </select>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Assessments List */}
              <div className="row">
                {sortedAssessments.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <FileText size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No assessments found</h5>
                    <p className="text-muted">Create your first assessment to get started</p>
                  </div>
                ) : (
                  sortedAssessments.map((assessment) => (
                    <div key={assessment.id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card card-hoverable h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="text-main text-uppercase fw-bold">{assessment.assessment_type}</div>
                            <div className="dropdown position-relative">
                              <button
                                className="btn btn-link-custom dropdown-toggle"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(assessment.id);
                                }}
                              >
                                <Settings size={16} />
                              </button>
                              <ul
                                className={`dropdown-menu ${openDropdownId === assessment.id ? 'show' : ''}`}
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: '0',
                                  zIndex: 1000
                                }}
                              >

                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedAssessment(assessment);
                                      setShowCreateQuestion(true);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    <Plus size={16} className="me-2" />
                                    Add Question
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteAssessment(assessment.id);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    <Trash2 size={16} className="me-2" />
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <h5 className="card-title line-clamp-2">{assessment.title}</h5>
                          <p className="card-text text-muted line-clamp-3">
                            {assessment.description || "No description provided"}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">
                              <Clock size={14} className="me-1" />
                              {assessment.created_at ? new Date(assessment.created_at).toLocaleDateString() : "N/A"}
                            </span>
                            <span className="text-muted">
                              Passing: {assessment.passing_score || assessment.passing_grade || 70}%
                            </span>
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn-edit-profile btn-sm flex-fill"
                              onClick={() => {
                                setSelectedAssessment(assessment);
                                setShowCreateQuestion(true);
                              }}
                            >
                              <Plus size={14} className="me-1" />
                              Questions
                            </button>
                            <button
                              className="btn-secondary-action btn-sm flex-fill"
                              onClick={() => {
                                navigate(`/assessments/${assessment.id}`);
                              }}
                            >
                              <Eye size={14} className="me-1" />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pending Grading Tab */}
        {activeTab === "grading" && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="section-title mb-4">Pending Grading</h4>

              {gradingError ? (
                <div className="alert alert-warning">
                  <h6 className="alert-heading">Error Loading Pending Grading</h6>
                  <p className="mb-0">
                    {gradingError.response?.data?.message ||
                      gradingError.message ||
                      "Failed to load pending grading items."}
                  </p>
                </div>
              ) : gradingLoading ? (
                <div className="text-center py-5">
                  <div className="loading-spinner"></div>
                  <p className="mt-3 text-muted">Loading pending grading...</p>
                </div>
              ) : pendingGrading && pendingGrading.length > 0 ? (
                <div className="table-responsive custom-table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Assessment</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Max Points</th>
                        <th>Current Marks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingGrading.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <StudentAvatar
                              studentName={item.student_name}
                              attemptId={item.attempt_id}
                            />
                          </td>
                          <td>{item.assessment_title || "Unknown Assessment"}</td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: "200px" }}>
                              {item.question_text || "Unknown Question"}
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: "200px" }}>
                              {item.text_answer || "No answer provided"}
                            </div>
                          </td>
                          <td>{item.question_mark || 0}</td>
                          <td>
                            <span className={`badge ${item.is_correct ? 'bg-success' : 'bg-warning'}`}>
                              {item.marks_awarded || "0.00"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-edit-profile btn-sm"
                              onClick={() => handleGradeAnswerClick(item)}
                            >
                              Grade
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <CheckCircle size={48} className="text-success mb-3" />
                  <h5 className="text-success">All caught up!</h5>
                  <p className="text-muted">No pending grading items</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Create/Edit Assessment Modal */}
      {showCreateAssessment && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedAssessment ? "Edit Assessment" : "Create New Assessment"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateAssessment(false);
                    setSelectedAssessment(null);
                    setAssessmentForm({
                      title: "",
                      description: "",
                      assessment_type: "quiz",
                      lesson: "",
                      module: "",
                      course: "",
                      passing_score: 70,
                      is_published: false,
                      is_timed: false,
                      time_limit: 30,
                      max_attempts: 3
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={selectedAssessment ? handleUpdateAssessment : handleCreateAssessment}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={assessmentForm.title}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <select
                          className="form-select"
                          value={assessmentForm.assessment_type}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, assessment_type: e.target.value }))}
                        >
                          <option value="quiz">Quiz (Lesson)</option>
                          <option value="assignment">Assignment (Module)</option>
                          <option value="course_exam">Course Exam</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={assessmentForm.description}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, description: e.target.value }))}
                    ></textarea>
                  </div>

                  {/* Dynamic relationship field based on assessment type */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        {assessmentForm.assessment_type === "quiz" && (
                          <>
                            <label className="form-label">Lesson *</label>
                            <select
                              className="form-select"
                              value={assessmentForm.lesson}
                              onChange={(e) => setAssessmentForm(prev => ({ ...prev, lesson: e.target.value }))}
                              required
                              disabled={lessonsLoading}
                            >
                              <option value="">
                                {lessonsLoading ? "Loading lessons..." : "Select Lesson"}
                              </option>
                              {lessons?.map(lesson => (
                                <option key={lesson.id} value={lesson.id}>
                                  {lesson.course_title} → {lesson.module_title} → {lesson.title}
                                </option>
                              ))}
                            </select>
                            {lessonsLoading && (
                              <small className="text-muted">Loading lessons from your courses...</small>
                            )}
                          </>
                        )}

                        {assessmentForm.assessment_type === "assignment" && (
                          <>
                            <label className="form-label">Module *</label>
                            <select
                              className="form-select"
                              value={assessmentForm.module}
                              onChange={(e) => setAssessmentForm(prev => ({ ...prev, module: e.target.value }))}
                              required
                              disabled={modulesLoading}
                            >
                              <option value="">
                                {modulesLoading ? "Loading modules..." : "Select Module"}
                              </option>
                              {modules?.map(module => (
                                <option key={module.id} value={module.id}>
                                  {module.course_title} → {module.title}
                                </option>
                              ))}
                            </select>
                            {modulesLoading && (
                              <small className="text-muted">Loading modules from your courses...</small>
                            )}
                          </>
                        )}

                        {assessmentForm.assessment_type === "course_exam" && (
                          <>
                            <label className="form-label">Course *</label>
                            <select
                              className="form-select"
                              value={assessmentForm.course}
                              onChange={(e) => setAssessmentForm(prev => ({ ...prev, course: e.target.value }))}
                              required
                              disabled={coursesLoading}
                            >
                              <option value="">
                                {coursesLoading ? "Loading courses..." : "Select Course"}
                              </option>
                              {courses?.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                              ))}
                            </select>
                            {coursesLoading && (
                              <small className="text-muted">Loading your courses...</small>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Passing Score (%)</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          max="100"
                          value={assessmentForm.passing_score}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, passing_score: parseFloat(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional settings */}
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Max Attempts</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={assessmentForm.max_attempts}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, max_attempts: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="isTimedCheck"
                            checked={assessmentForm.is_timed}
                            onChange={(e) => setAssessmentForm(prev => ({ ...prev, is_timed: e.target.checked }))}
                          />
                          <label className="form-check-label" htmlFor="isTimedCheck">
                            Time Limited
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      {assessmentForm.is_timed && (
                        <div className="mb-3">
                          <label className="form-label">Time Limit (minutes)</label>
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={assessmentForm.time_limit}
                            onChange={(e) => setAssessmentForm(prev => ({ ...prev, time_limit: parseInt(e.target.value) }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPublishedCheck"
                        checked={assessmentForm.is_published}
                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, is_published: e.target.checked }))}
                      />
                      <label className="form-check-label" htmlFor="isPublishedCheck">
                        Publish immediately
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateAssessment(false);
                      setSelectedAssessment(null);
                      setAssessmentForm({
                        title: "",
                        description: "",
                        assessment_type: "quiz",
                        lesson: "",
                        module: "",
                        course: "",
                        passing_score: 70,
                        is_published: false,
                        is_timed: false,
                        time_limit: 30,
                        max_attempts: 3
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-edit-profile">
                    {selectedAssessment ? "Update Assessment" : "Create Assessment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      <QuestionModal
        show={showCreateQuestion}
        onClose={() => {
          setShowCreateQuestion(false);
          setSelectedQuestion(null);
          setEditingQuestionId(null);
        }}
        onSubmit={selectedQuestion ? handleUpdateQuestion : handleCreateQuestion}
        questionForm={questionForm}
        setQuestionForm={setQuestionForm}
        selectedQuestion={selectedQuestion}
        isLoading={questionLoading || questionDetailLoading}
      />

      {/* Grade Answer Modal */}
      {showGradeAnswer && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Grade Answer</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowGradeAnswer(false);
                    setSelectedAnswer(null);
                    setGradingForm({ marks_awarded: "", teacher_feedback: "", is_correct: false });
                  }}
                ></button>
              </div>
              <form onSubmit={handleGradeSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Student Answer</label>
                    <div className="form-control-plaintext bg-light p-3">
                      {selectedAnswer?.text_answer || "No answer provided"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Question</label>
                    <div className="form-control-plaintext bg-light p-3">
                      {selectedAnswer?.question_text || "No question text"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Marks Awarded</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      min="0"
                      max={selectedAnswer?.question_mark || 0}
                      value={gradingForm.marks_awarded}
                      onChange={(e) => setGradingForm(prev => ({ ...prev, marks_awarded: e.target.value }))}
                    />
                    <small className="text-muted">
                      Maximum marks: {selectedAnswer?.question_mark || 0}
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Is Correct</label>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isCorrect"
                        checked={gradingForm.is_correct}
                        onChange={(e) => setGradingForm(prev => ({ ...prev, is_correct: e.target.checked }))}
                      />
                      <label className="form-check-label" htmlFor="isCorrect">
                        Mark this answer as correct
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Teacher Feedback (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={gradingForm.teacher_feedback}
                      onChange={(e) => setGradingForm(prev => ({ ...prev, teacher_feedback: e.target.value }))}
                      placeholder="Provide feedback to the student..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowGradeAnswer(false);
                      setSelectedAnswer(null);
                      setGradingForm({ marks_awarded: "", teacher_feedback: "", is_correct: false });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-edit-profile">
                    Submit Grade
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

