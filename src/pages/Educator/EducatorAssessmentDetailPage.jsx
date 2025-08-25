import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Users,
  BarChart3,
  ArrowLeft,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react";
import useEducatorAssessmentQuestionsData from "../../apis/hooks/educator/useEducatorAssessmentQuestionsData";
import createQuestion from "../../apis/actions/educator/createQuestion";
import updateQuestion from "../../apis/actions/educator/updateQuestion";
import deleteQuestion from "../../apis/actions/educator/deleteQuestion";
import createOption from "../../apis/actions/educator/createOption";
import updateOption from "../../apis/actions/educator/updateOption";
import deleteOption from "../../apis/actions/educator/deleteOption";
import { educatorEndpoints } from "../../apis/endpoints/educatorApi";
import baseApi from "../../apis/base";
import QuestionModal from "../../components/common/QuestionModal/QuestionModal";

export default function EducatorAssessmentDetailPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState("questions");

  // Mock assessment data - in real app, this would come from a hook
  const [assessment, setAssessment] = useState({
    id: assessmentId,
    title: "Sample Assessment",
    description: "This is a sample assessment for demonstration purposes.",
    assessment_type: "quiz",
    passing_grade: 70,
    created_at: new Date().toISOString(),
    total_questions: 0,
    total_attempts: 0,
    average_score: 0
  });

  const { 
    data: questions, 
    isLoading: questionsLoading, 
    error: questionsError, 
    mutate: mutateQuestions 
  } = useEducatorAssessmentQuestionsData(assessmentId);

  // Form state for questions
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
  
  const [questionLoading, setQuestionLoading] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Toggle dropdown function
  const toggleDropdown = (questionId) => {
    setOpenDropdownId(openDropdownId === questionId ? null : questionId);
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

  // Update assessment stats when questions change
  useEffect(() => {
    if (questions) {
      setAssessment(prev => ({
        ...prev,
        total_questions: questions.length,
        total_attempts: questions.reduce((sum, q) => sum + (q.attempts || 0), 0),
        average_score: questions.length > 0 ? 
          questions.reduce((sum, q) => sum + (q.average_score || 0), 0) / questions.length : 0
      }));
    }
  }, [questions]);

  // Question management functions
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    
    if (!assessmentId) {
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
        order:        parseInt(questionForm.order) || 1,
        explanation: questionForm.explanation?.trim() || undefined,
        image: questionForm.image || undefined
      };
      
      console.log("Creating question with data:", questionData);
      const questionResponse = await createQuestion(assessmentId, questionData);
      console.log("Question created successfully:", questionResponse);
      
      // Step 2: Create options if this is a multiple choice or true/false question
      if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && validOptions.length > 0) {
        // Try different possible response structures
        let questionId = questionResponse.data?.id || 
                        questionResponse.id || 
                        questionResponse.data?.question?.id ||
                        questionResponse.question?.id;
        
        console.log("Extracted question ID:", questionId);
        
        if (!questionId) {
          console.error("Could not extract question ID from response:", questionResponse);
          console.log("Attempting to fetch questions to find the newly created question...");
          
          // Fallback: Try to fetch the questions and find the one we just created
          try {
            const questionsResponse = await baseApi.get(educatorEndpoints.assessment.questions(assessmentId));
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
            alert("Question created successfully, but options could not be added automatically. Please edit the question to add options.");
            
            setShowCreateQuestion(false);
            mutateQuestions();
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
      
      setShowCreateQuestion(false);
      mutateQuestions();
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
        order: null, // As per your comment
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
      mutateQuestions();
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
    if (!questionId) {
      alert("Invalid question ID");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      setDeletingQuestionId(questionId);
      
      try {
        console.log("Deleting question:", questionId);
        await deleteQuestion(questionId);
        
        // Refresh the questions list
        if (mutateQuestions) {
          await mutateQuestions();
        }
        
        alert("Question deleted successfully!");
        
      } catch (error) {
        console.error("Error deleting question:", error);
        console.error("Error response:", error.response?.data);
        
        let errorMessage = "Failed to delete question. Please try again.";
        
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
        
        alert(`Error deleting question:\n${errorMessage}`);
      } finally {
        setDeletingQuestionId(null);
      }
    }
  };



  // Edit functions
  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setQuestionForm({
      question_text: question.question_text || "",
      question_type: question.question_type || "multiple_choice",
      points: question.points || question.mark || 1,
      order: question.order || 1,
      explanation: question.explanation || "",
      image: null, // Don't pre-populate file input
      options: question.options || [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false }
      ]
    });
    setShowCreateQuestion(true);
  };

  if (questionsLoading) {
    return (
      <div className="profile-root p-4">
        <div className="container text-center py-5">
          <div className="loading-spinner"></div>
          <p className="mt-3 text-muted">Loading assessment details...</p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="profile-root p-4">
        <div className="container">
          <div className="alert alert-danger">
            Error loading assessment: {questionsError.message}
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
                <button
                  className="btn btn-link-custom me-3"
                  onClick={() => navigate("/assessments")}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="header-avatar me-3">
                  <FileText size={20} />
                </div>
                <div>
                  <h1 className="main-title mb-0">{assessment.title}</h1>
                  <p className="profile-role mb-0">{assessment.assessment_type} • {assessment.total_questions} questions</p>
                </div>
              </div>
              <button
                className="btn-edit-profile d-flex align-items-center"
                onClick={() => setShowCreateQuestion(true)}
              >
                <Plus size={18} className="me-2" />
                Add Question
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Stats */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <FileText size={24} className="mb-2" />
                <h4 className="mb-1">{assessment.total_questions}</h4>
                <p className="mb-0">Total Questions</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <Users size={24} className="mb-2" />
                <h4 className="mb-1">{assessment.total_attempts}</h4>
                <p className="mb-0">Total Attempts</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <BarChart3 size={24} className="mb-2" />
                <h4 className="mb-1">{assessment.average_score.toFixed(1)}%</h4>
                <p className="mb-0">Average Score</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <CheckCircle size={24} className="mb-2" />
                <h4 className="mb-1">{assessment.passing_grade}%</h4>
                <p className="mb-0">Passing Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <ul className="nav nav-tabs border-0" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
                  onClick={() => setActiveTab("questions")}
                >
                  <FileText size={16} className="me-2" />
                  Questions ({assessment.total_questions})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "attempts" ? "active" : ""}`}
                  onClick={() => setActiveTab("attempts")}
                >
                  <Users size={16} className="me-2" />
                  Student Attempts ({assessment.total_attempts})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 size={16} className="me-2" />
                  Analytics
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="section-title mb-4">Assessment Questions</h4>
              
              {questions && questions.length > 0 ? (
                <div className="row">
                  {questions.map((question, index) => (
                    <div key={question.id} className="col-12 mb-4">
                      <div className="card card-hoverable">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center">
                              <span className="badge bg-primary me-2">Q{index + 1}</span>
                              <span className="badge bg-secondary me-2">{question.question_type}</span>
                              <span className="badge bg-info">{question.points} pts</span>
                            </div>
                            <div className="dropdown position-relative">
                              <button
                                className="btn btn-link-custom dropdown-toggle"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(question.id);
                                }}
                                disabled={deletingQuestionId === question.id}
                              >
                                {deletingQuestionId === question.id ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                  <Settings size={16} />
                                )}
                              </button>
                              <ul 
                                className={`dropdown-menu ${openDropdownId === question.id ? 'show' : ''}`}
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
                                      handleEditQuestion(question);
                                      setOpenDropdownId(null);
                                    }}
                                    disabled={deletingQuestionId === question.id}
                                  >
                                    <Edit size={16} className="me-2" />
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteQuestion(question.id);
                                      setOpenDropdownId(null);
                                    }}
                                    disabled={deletingQuestionId === question.id}
                                  >
                                    {deletingQuestionId === question.id ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Deleting...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 size={16} className="me-2" />
                                        Delete
                                      </>
                                    )}
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          <h6 className="card-title mb-3">{question.question_text}</h6>
                          
                          {question.options && question.options.length > 0 && (
                            <div className="mb-3">
                              <label className="form-label">Options:</label>
                              <div className="row">
                                {question.options.map((option, optIndex) => (
                                  <div key={optIndex} className="col-md-6 mb-2">
                                    <div className={`d-flex align-items-center p-2 rounded ${option.is_correct ? 'bg-success text-white' : 'bg-light'}`}>
                                      <span className="me-2">
                                        {option.is_correct ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                      </span>
                                      {option.option_text}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              <Clock size={14} className="me-1" />
                              Created: {question.created_at ? new Date(question.created_at).toLocaleDateString() : "N/A"}
                            </small>
                            <div className="d-flex gap-2">
                              <span className="text-muted">
                                Attempts: {question.attempts || 0}
                              </span>
                              <span className="text-muted">
                                Avg Score: {question.average_score || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <FileText size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No questions yet</h5>
                  <p className="text-muted">Add your first question to get started</p>
                  <button
                    className="btn-edit-profile"
                    onClick={() => setShowCreateQuestion(true)}
                  >
                    <Plus size={16} className="me-2" />
                    Add First Question
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attempts Tab */}
        {activeTab === "attempts" && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="section-title mb-4">Student Attempts</h4>
              <div className="text-center py-5">
                <Users size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Student Attempts Coming Soon</h5>
                <p className="text-muted">View detailed student performance and results</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="section-title mb-4">Assessment Analytics</h4>
              <div className="text-center py-5">
                <BarChart3 size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Analytics Coming Soon</h5>
                <p className="text-muted">Detailed performance insights and trends</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Question Modal */}
      <QuestionModal
        show={showCreateQuestion}
        onClose={() => {
          setShowCreateQuestion(false);
          setSelectedQuestion(null);
        }}
        onSubmit={selectedQuestion ? handleUpdateQuestion : handleCreateQuestion}
        questionForm={questionForm}
        setQuestionForm={setQuestionForm}
        selectedQuestion={selectedQuestion}
        isLoading={questionLoading}
      />
    </div>
  );
}

