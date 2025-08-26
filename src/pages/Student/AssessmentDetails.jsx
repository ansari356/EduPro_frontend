import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Play,
  Send,
  Trophy,
  Star,
  Target,
  Award
} from "lucide-react";
import { pagePaths } from "../../pagePaths";
import startAssessment from "../../apis/actions/student/startAssessment";
import submitAssessment from "../../apis/actions/student/submitAssessment";
import getAttemptDetails from "../../apis/actions/student/getAttemptDetails";
import getAssessmentAttempts from "../../apis/actions/student/getAssessmentAttempts";

// Assessment and question type constants
const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment', 
  COURSE_EXAM: 'course_exam'
};

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
  FILL_BLANK: 'fill_blank'
};

function AssessmentDetails() {
  const params = useParams();
  const { educatorUsername, assessmentId } = params;
  const navigate = useNavigate();
  const location = useLocation();
  
  const [assessment, setAssessment] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [results, setResults] = useState(null);
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  const intervalRef = useRef(null);

  // Reset assessment state
  const resetAssessmentState = () => {
    setAttemptId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(0);
    setIsStarted(false);
    setIsSubmitted(false);
    setIsLoading(false);
    setError(null);
    setShowConfirmSubmit(false);
    setResults(null);
    setIsTimedOut(false);
    
    // Clear any existing timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Get assessment data from location state and check for existing attempts
  useEffect(() => {
    console.log('🔍 useEffect triggered with location.state:', location.state);
    console.log('🔍 educatorUsername from params:', educatorUsername);
    
    if (location.state?.assessment) {
      const assessmentData = location.state.assessment;
      console.log('🔍 Assessment data found:', assessmentData);
      setAssessment(assessmentData);
      
      // If we have completed results from previous attempt, show them
      if (location.state?.results) {
        console.log('🔍 Results found in location.state, setting them');
        setResults(location.state.results);
        setIsSubmitted(true);
      } else {
        console.log('🔍 No results in location.state, checking localStorage');
        // Check if this assessment was recently completed (stored in localStorage)
        const completedKey = `assessment_completed_${assessmentData.id}`;
        const isCompleted = localStorage.getItem(completedKey);
        console.log('🔍 localStorage check:', { completedKey, isCompleted });
        
        if (isCompleted) {
          console.log('🔍 Found in localStorage, clearing it');
          // If completed, try to fetch fresh results from backend
          // If backend has no results, clear localStorage and allow retake
          try {
            // You could add a call here to check if results still exist in backend
            // For now, we'll just clear localStorage and allow retake
            localStorage.removeItem(completedKey);
            resetAssessmentState();
          } catch (error) {
            // If there's an error fetching results, clear localStorage and allow retake
            localStorage.removeItem(completedKey);
            resetAssessmentState();
          }
        } else {
          console.log('🔍 Not in localStorage, resetting state');
          // Reset state if not completed
          resetAssessmentState();
        }
      }
      
      // Now check for existing attempts since we have the assessment data
      if (educatorUsername) {
        console.log('🔍 Calling checkExistingAttempts with:', { assessmentData, educatorUsername });
        checkExistingAttempts(assessmentData);
      } else {
        console.log('🔍 No educatorUsername, cannot check attempts');
      }
    } else {
      console.log('🔍 No assessment data in location.state');
    }
  }, [location.state, educatorUsername]);

  // Function to check for existing results directly
  const checkExistingAttempts = async (assessmentData) => {
    console.log('🔍 FUNCTION CALLED: checkExistingAttempts - NEW APPROACH');
    
    try {
      console.log('🔍 Checking for existing results for assessment:', assessmentData.id);
      console.log('🔍 Assessment title:', assessmentData.title);
      
      // Try to get results directly using the assessment ID
      // We'll construct a URL that matches the pattern: /student/attempts/<uuid:attempt_id>/result/
      // Since we don't have the attempt_id, we'll try to find it by checking if there are any attempts
      // for this specific assessment
      
      // First, let's try to get attempts to find the attempt_id for this assessment
      const attempts = await getAssessmentAttempts(educatorUsername);
      console.log('🔍 Found attempts:', attempts);
      
      if (Array.isArray(attempts) && attempts.length > 0) {
        // Find the attempt for this specific assessment
        const assessmentAttempt = attempts.find(attempt => 
          attempt.assessment_title === assessmentData.title
        );
        
        if (assessmentAttempt) {
          console.log('🔍 Found attempt for this assessment:', assessmentAttempt);
          
          // Now try to get the results for this specific attempt
          try {
            console.log('🔍 Calling getAttemptDetails with attempt ID:', assessmentAttempt.id);
            const attemptResults = await getAttemptDetails(assessmentAttempt.id);
            console.log('🔍 Attempt results received:', attemptResults);
            
            if (attemptResults && !attemptResults.message) {
              // We have actual results, show them
              console.log('🔍 Setting results and isSubmitted to true');
              setResults(attemptResults);
              setIsSubmitted(true);
              console.log('🔍 State updated - results:', attemptResults, 'isSubmitted: true');
            } else if (attemptResults && attemptResults.message) {
              // Assessment is still being graded or has a message
              console.log('🔍 Got message response, treating as grading status');
              setResults({ 
                status: 'grading',
                message: attemptResults.message,
                assessment_title: assessmentData.title
              });
              setIsSubmitted(true);
              console.log('🔍 Showing grading status from message');
            }
          } catch (error) {
            console.log('🔍 Error fetching attempt details:', error);
            if (error.response?.status === 404) {
              console.log('🔍 404 - No results found, assessment not taken yet');
              // Assessment not taken yet, show start page
            } else {
              console.log('🔍 Other error:', error.response?.data);
            }
          }
        } else {
          console.log('🔍 No attempt found for this assessment, show start page');
        }
      } else {
        console.log('🔍 No attempts found, show start page');
      }
    } catch (error) {
      console.log('🔍 Could not fetch attempts:', error);
    }
  };

  // Reset state when component mounts (in case of direct navigation)
  useEffect(() => {
    // Only reset if we don't have assessment data
    if (!location.state?.assessment) {
      resetAssessmentState();
    }
  }, [location.state]);

  // Check if student can take this assessment (based on completion status)
  const canTakeAssessment = () => {
    if (!assessment) return false;
    
    // If we have results from a completed attempt or grading status, check if we can retake
    if (results) {
      console.log('🔍 canTakeAssessment check - results exist:', results);
      console.log('🔍 canTakeAssessment check - results status:', results.status);
      
      // If still being graded, prevent retaking
      if (results.status === 'grading') {
        console.log('🔍 canTakeAssessment: Still being graded, return false');
        return false;
      }
      
      // Check if we've reached max attempts
      if (assessment.max_attempts && results.attempt_number >= assessment.max_attempts) {
        console.log('🔍 canTakeAssessment: Max attempts reached, return false');
        return false;
      }
      // For now, prevent retaking even if attempts remain (can be modified later)
      console.log('🔍 canTakeAssessment: Has results, return false');
      return false;
    }
    
    // If no results, we can take it
    console.log('🔍 canTakeAssessment: No results, return true');
    return true;
  };

  // Timer countdown
  useEffect(() => {
    if (isStarted && timeRemaining > 0 && !isSubmitted) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleTimeoutSubmission();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStarted, timeRemaining, isSubmitted]);

  const startAssessmentAttempt = async () => {
    if (!assessment) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await startAssessment(assessment.id, educatorUsername);
      setAttemptId(response.attempt_id);
      setAssessment(response.assessment);
      setTimeRemaining(response.time_limit * 60);
      setIsStarted(true);
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Failed to start assessment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value, questionType) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        ...(questionType === QUESTION_TYPES.MULTIPLE_CHOICE || questionType === QUESTION_TYPES.TRUE_FALSE 
          ? { selected_option: value }
          : { text_answer: value }
        )
      }
    }));
  };

  const handleTimeoutSubmission = async () => {
    if (!attemptId) return;
    
    console.log('🔍 Time expired - auto-submitting assessment with attemptId:', attemptId);
    console.log('🔍 Current answers:', answers);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const answersArray = Object.values(answers);
      console.log('🔍 Auto-submitting answers array:', answersArray);
      
      await submitAssessment(attemptId, answersArray);
      console.log('🔍 Assessment auto-submitted successfully due to timeout');
      
      // Set timeout state
      setIsTimedOut(true);
      setIsSubmitted(true);
      
      // Store completion flag in localStorage to prevent retaking
      const completedKey = `assessment_completed_${assessment.id}`;
      localStorage.setItem(completedKey, 'true');
      
      // Clear timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
    } catch (err) {
      console.error('🔍 Error during timeout submission:', err);
      console.error('🔍 Error details:', {
        status: err.response?.status,
        message: err.response?.data?.detail || err.message,
        data: err.response?.data
      });
      
      // Even if submission fails, we still want to show the timeout page
      // The assessment has timed out regardless of submission success
      setIsTimedOut(true);
      setIsSubmitted(true);
      
      // Store completion flag in localStorage to prevent retaking
      const completedKey = `assessment_completed_${assessment.id}`;
      localStorage.setItem(completedKey, 'true');
      
      // Clear timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      console.error('Failed to auto-submit assessment, but showing timeout page:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!attemptId) return;
    
    console.log('🔍 Starting submission with attemptId:', attemptId);
    console.log('🔍 Current answers:', answers);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const answersArray = Object.values(answers);
      console.log('🔍 Submitting answers array:', answersArray);
      
      await submitAssessment(attemptId, answersArray);
      console.log('🔍 Assessment submitted successfully');
      
      // Fetch results after successful submission
      console.log('🔍 Fetching attempt details...');
      const attemptResults = await getAttemptDetails(attemptId);
      console.log('🔍 Got attempt results:', attemptResults);
      
      // Check if results are available or if still being graded
      if (attemptResults.message && attemptResults.message.includes('Please wait until all questions are graded')) {
        // Assessment submitted but still being graded
        setResults({ 
          status: 'grading',
          message: attemptResults.message,
          assessment_title: assessment.title
        });
      } else {
        // Results are available
        setResults(attemptResults);
      }
      
      setIsSubmitted(true);
      setShowConfirmSubmit(false);
      
      console.log('🔍 State updated - isSubmitted:', true, 'results:', attemptResults);
      
      // Store completion flag in localStorage to prevent retaking
      if (assessment?.id) {
        const completedKey = `assessment_completed_${assessment.id}`;
        localStorage.setItem(completedKey, 'completed');
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } catch (err) {
      console.error('🔍 Error during submission:', err);
      setError(err.response?.data?.detail || err.message);
      console.error('Failed to submit assessment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case QUESTION_TYPES.MULTIPLE_CHOICE: return 'Multiple Choice';
      case QUESTION_TYPES.TRUE_FALSE: return 'True/False';
      case QUESTION_TYPES.SHORT_ANSWER: return 'Short Answer';
      case QUESTION_TYPES.ESSAY: return 'Essay';
      case QUESTION_TYPES.FILL_BLANK: return 'Fill in the Blank';
      default: return type;
    }
  };

  const renderQuestion = (question) => {
    const { id, question_text, question_type, options } = question;
    const currentAnswer = answers[id];

    switch (question_type) {
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <div className="question-options">
            {options?.map((option) => (
                          <label 
              key={option.id} 
              className={`option-item ${currentAnswer?.selected_option === option.id ? 'option-selected' : ''} ${isSubmitted ? 'disabled' : ''}`}
            >
                <div className="option-radio">
                  <input
                    type="radio"
                    name={`question_${id}`}
                    value={option.id}
                    checked={currentAnswer?.selected_option === option.id}
                    onChange={(e) => handleAnswerChange(id, e.target.value, question_type)}
                    disabled={isSubmitted}
                  />
                  <div className="radio-custom"></div>
                </div>
                <span className="option-text">{option.option_text}</span>
              </label>
            ))}
          </div>
        );

      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <div className="question-options">
            {options?.map((option) => (
              <label 
                key={option.id} 
                className={`option-item ${currentAnswer?.selected_option === option.id ? 'option-selected' : ''} ${isSubmitted ? 'disabled' : ''}`}
              >
                <div className="option-radio">
                  <input
                    type="radio"
                    name={`question_${id}`}
                    value={option.id}
                    checked={currentAnswer?.selected_option === option.id}
                    onChange={(e) => handleAnswerChange(id, e.target.value, question_type)}
                    disabled={isSubmitted}
                  />
                  <div className="radio-custom"></div>
                </div>
                <span className="option-text">{option.option_text}</span>
              </label>
            ))}
          </div>
        );

      case QUESTION_TYPES.SHORT_ANSWER:
      case QUESTION_TYPES.ESSAY:
        return (
          <textarea
            className="form-control"
            rows={question_type === QUESTION_TYPES.ESSAY ? 4 : 2}
            placeholder={`Enter your ${question_type === QUESTION_TYPES.ESSAY ? 'essay' : 'answer'} here...`}
            value={currentAnswer?.text_answer || ''}
            onChange={(e) => handleAnswerChange(id, e.target.value, question_type)}
            disabled={isSubmitted}
          />
        );

      case QUESTION_TYPES.FILL_BLANK:
        return (
          <input
            type="text"
            className="form-control"
            placeholder="Fill in the blank..."
            value={currentAnswer?.text_answer || ''}
            onChange={(e) => handleAnswerChange(id, e.target.value, question_type)}
            disabled={isSubmitted}
          />
        );

      default:
        return <p className="text-muted">Unsupported question type: {question_type}</p>;
    }
  };

  if (!assessment) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="main-title mb-3">Assessment Not Found</h2>
          <p className="profile-joined mb-4">
            Sorry, we couldn't find the assessment you're looking for.
          </p>
          <button
            className="btn-edit-profile"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !isStarted) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="loading-spinner mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="profile-joined">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Show timeout page if assessment timed out (this takes priority over errors)
  if (isTimedOut) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-5 text-center">
                  <Clock size={64} className="text-warning mb-3" />
                  <h1 className="main-title mb-3">Time's Up!</h1>
                  <p className="profile-joined mb-4">
                    Your assessment time has expired. Your answers have been automatically submitted.
                  </p>
                  
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <BookOpen size={32} className="text-main mb-2" />
                          <h5 className="main-title mb-1">{assessment?.title || 'Assessment'}</h5>
                          <small className="text-muted">Assessment Name</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <CheckCircle size={32} className="text-success mb-2" />
                          <h5 className="main-title mb-1">Auto-Submitted</h5>
                          <small className="text-muted">Status</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <h6 className="alert-heading">What happens next?</h6>
                    <ul className="mb-0 text-start">
                      <li>Your answers have been saved and submitted</li>
                      <li>Your instructor will review and grade your assessment</li>
                      <li>You'll be able to view your results once grading is complete</li>
                    </ul>
                  </div>

                  <div className="d-flex gap-3 justify-content-center">
                    <button
                      className="btn-edit-profile"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Go Back
                    </button>
                    <button
                      className="btn-secondary-action"
                      onClick={() => {
                        // Try to fetch results if available
                        if (attemptId) {
                          getAttemptDetails(attemptId)
                            .then(results => {
                              if (results && !results.message?.includes('Please wait')) {
                                setResults(results);
                                setIsTimedOut(false);
                              } else {
                                alert('Results are not yet available. Please check back later.');
                              }
                            })
                            .catch(err => {
                              console.error('Error fetching results:', err);
                              alert('Unable to fetch results at this time. Please try again later.');
                            });
                        }
                      }}
                    >
                      <Trophy size={16} className="me-2" />
                      Check Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-danger mb-3" />
          <h2 className="main-title mb-3">Error</h2>
          <p className="profile-joined mb-4">{error}</p>
          <button
            className="btn-edit-profile"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show timeout page if assessment timed out (this takes priority over errors)
  if (isTimedOut) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-5 text-center">
                  <Clock size={64} className="text-warning mb-3" />
                  <h1 className="main-title mb-3">Time's Up!</h1>
                  <p className="profile-joined mb-4">
                    Your assessment time has expired. Your answers have been automatically submitted.
                  </p>
                  
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <BookOpen size={32} className="text-main mb-2" />
                          <h5 className="main-title mb-1">{assessment?.title || 'Assessment'}</h5>
                          <small className="text-muted">Assessment Name</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <CheckCircle size={32} className="text-success mb-2" />
                          <h5 className="main-title mb-1">Auto-Submitted</h5>
                          <small className="text-muted">Status</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <h6 className="alert-heading">What happens next?</h6>
                    <ul className="mb-0 text-start">
                      <li>Your answers have been saved and submitted</li>
                      <li>Your instructor will review and grade your assessment</li>
                      <li>You'll be able to view your results once grading is complete</li>
                    </ul>
                  </div>

                  <div className="d-flex gap-3 justify-content-center">
                    <button
                      className="btn-edit-profile"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Go Back
                    </button>
                    <button
                      className="btn-secondary-action"
                      onClick={() => {
                        // Try to fetch results if available
                        if (attemptId) {
                          getAttemptDetails(attemptId)
                            .then(results => {
                              if (results && !results.message?.includes('Please wait')) {
                                setResults(results);
                                setIsTimedOut(false);
                              } else {
                                alert('Results are not yet available. Please check back later.');
                              }
                            })
                            .catch(err => {
                              console.error('Error fetching results:', err);
                              alert('Unable to fetch results at this time. Please try again later.');
                            });
                        }
                      }}
                    >
                      <Trophy size={16} className="me-2" />
                      Check Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    console.log('🔍 !isStarted condition - canTakeAssessment():', canTakeAssessment(), 'results:', results, 'isSubmitted:', isSubmitted);
    
    // If the assessment is still being graded, show grading status page
    if (results && results.status === 'grading') {
      console.log('🔍 Showing grading status page');
      return (
        <div className="profile-root">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow-sm">
                  <div className="card-body p-5 text-center">
                    <Clock size={64} className="text-warning mb-3" />
                    <h1 className="main-title mb-3">Assessment Submitted Successfully!</h1>
                    <p className="profile-joined mb-4">
                      {results.message || 'Your assessment has been submitted and is currently being graded by your instructor.'}
                    </p>
                    <p className="text-muted mb-4">
                      You will be able to view your detailed results once grading is complete.
                    </p>
                    
                    <button
                      className="btn-edit-profile"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // If the assessment is completed or submitted with results, show results instead of start screen
    if ((!canTakeAssessment() && results) || (isSubmitted && results)) {
      console.log('🔍 Showing results page');
      // Show results
      return (
        <div className="profile-root">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Results Header */}
                <div className="card shadow-sm mb-4">
                  <div className="card-body p-4 text-center">
                    {results.is_passed ? (
                      <Trophy size={64} className="text-success mb-3" />
                    ) : (
                      <Target size={64} className="text-warning mb-3" />
                    )}
                    <h1 className="main-title mb-3">{results.assessment_title}</h1>
                    <p className="profile-joined mb-4">
                      Assessment completed • Attempt #{results.attempt_number} • Status: {results.status}
                    </p>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="row mb-4">
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body text-center">
                        <Award size={32} className="text-main mb-2" />
                        <h5 className="main-title mb-1">{results.score}</h5>
                        <small className="profile-joined">Total Score</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body text-center">
                        <Star size={32} className="text-main mb-2" />
                        <h5 className="main-title mb-1">{results.percentage}%</h5>
                        <small className="profile-joined">Percentage</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body text-center">
                        <Clock size={32} className="text-main mb-2" />
                        <h5 className="main-title mb-1">{results.time_taken}m</h5>
                        <small className="profile-joined">Time Taken</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body text-center">
                        {results.is_passed ? (
                          <CheckCircle size={32} className="text-success mb-2" />
                        ) : (
                          <AlertCircle size={32} className="text-warning mb-2" />
                        )}
                        <h5 className="main-title mb-1">{results.is_passed ? 'Passed' : 'Failed'}</h5>
                        <small className="profile-joined">Result</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answers Review */}
                <div className="card shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h4 className="main-title mb-4">Answer Review</h4>
                                         {results.answers && results.answers.length > 0 ? (
                       results.answers.map((answer, index) => (
                         <div key={answer.id} className="mb-4 p-3 border rounded">
                           <div className="d-flex justify-content-between align-items-start mb-2">
                             <h6 className="mb-1">Question {index + 1}</h6>
                             <div className="d-flex align-items-center gap-2">
                               {answer.is_correct ? (
                                 <CheckCircle size={20} className="text-success" />
                               ) : (
                                 <AlertCircle size={20} className="text-danger" />
                               )}
                               <span className="badge bg-secondary">{answer.marks_awarded} points</span>
                             </div>
                           </div>
                           <p className="mb-2">{answer.question}</p>
                           <div className="mb-2">
                             <strong>Your Answer: </strong>
                             <span className={answer.is_correct ? 'text-success' : 'text-danger'}>
                               {answer.selected_option_text || answer.text_answer}
                             </span>
                           </div>
                           {answer.teacher_feedback && (
                             <div className="alert alert-info">
                               <strong>Feedback: </strong>{answer.teacher_feedback}
                             </div>
                           )}
                         </div>
                       ))
                     ) : (
                       <div className="text-center text-muted">
                         <p>No answer details available for this assessment.</p>
                       </div>
                     )}
                  </div>
                </div>

                {/* Actions */}
                <div className="text-center">
                  <button
                    className="btn-edit-profile me-3"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft size={16} className="me-2" />
                    Back to Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="profile-root">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-5 text-center">
                  <BookOpen size={64} className="text-main mb-4" />
                  <h1 className="main-title mb-3">{assessment.title}</h1>
                  <p className="profile-joined mb-4">{assessment.description || 'Test your knowledge'}</p>
                  
                  <div className="row g-4 mb-5">
                    <div className="col-md-3">
                      <div className="text-center">
                        <Clock size={24} className="text-main mb-2" />
                        <div className="h5 mb-1">{assessment.time_limit || 0} min</div>
                        <small className="text-muted">Time Limit</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <BookOpen size={24} className="text-main mb-2" />
                        <div className="h5 mb-1">{assessment.total_questions || 0}</div>
                        <small className="text-muted">Questions</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <CheckCircle size={24} className="text-main mb-2" />
                        <div className="h5 mb-1">{assessment.max_attempts || 1}</div>
                        <small className="text-muted">Max Attempts</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <AlertCircle size={24} className="text-main mb-2" />
                        <div className="h5 mb-1">{assessment.total_marks || 0}</div>
                        <small className="text-muted">Total Marks</small>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-edit-profile btn-lg px-5"
                    onClick={startAssessmentAttempt}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner me-2" style={{ width: '1rem', height: '1rem' }}></div>
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play size={20} className="me-2" />
                        Start Assessment
                      </>
                      )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🔍 Main render logic - isStarted:', isStarted, 'isSubmitted:', isSubmitted, 'results:', results);
  
  // If we have results and are submitted, show results page
  if (isSubmitted && results) {
    console.log('🔍 Showing results page from main logic');
    
    // Check if assessment is still being graded
    if (results.status === 'grading') {
      return (
        <div className="profile-root">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow-sm">
                  <div className="card-body p-5 text-center">
                    <Clock size={64} className="text-warning mb-3" />
                    <h1 className="main-title mb-3">Assessment Submitted Successfully!</h1>
                    <p className="profile-joined mb-4">
                      {results.message || 'Your assessment has been submitted and is currently being graded by your instructor.'}
                    </p>
                    <p className="text-muted mb-4">
                      You will be able to view your detailed results once grading is complete.
                    </p>
                    
                    <button
                      className="btn-edit-profile"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Back to Courses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Show full results if grading is complete
    return (
      <div className="profile-root">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Results Header */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4 text-center">
                  {results.is_passed ? (
                    <Trophy size={64} className="text-success mb-3" />
                  ) : (
                    <Target size={64} className="text-warning mb-3" />
                  )}
                  <h1 className="main-title mb-3">{results.assessment_title}</h1>
                  <p className="profile-joined mb-4">
                    Assessment completed • Attempt #{results.attempt_number} • Status: {results.status}
                  </p>
                </div>
              </div>

              {/* Score Summary */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <Award size={32} className="text-main mb-2" />
                      <h5 className="main-title mb-1">{results.score}</h5>
                      <small className="profile-joined">Total Score</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <Star size={32} className="text-main mb-2" />
                      <h5 className="main-title mb-1">{results.percentage}%</h5>
                      <small className="profile-joined">Percentage</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <Clock size={32} className="text-main mb-2" />
                      <h5 className="main-title mb-1">{results.time_taken}m</h5>
                      <small className="profile-joined">Time Taken</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      {results.is_passed ? (
                        <CheckCircle size={32} className="text-success mb-2" />
                      ) : (
                        <AlertCircle size={32} className="text-warning mb-2" />
                      )}
                      <h5 className="main-title mb-1">{results.is_passed ? 'Passed' : 'Failed'}</h5>
                      <small className="profile-joined">Result</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answers Review */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h4 className="main-title mb-4">Answer Review</h4>
                  {results.answers && results.answers.length > 0 ? (
                    results.answers.map((answer, index) => (
                      <div key={answer.id} className="mb-4 p-3 border rounded">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1">Question {index + 1}</h6>
                          <div className="d-flex align-items-center gap-2">
                            {answer.is_correct ? (
                              <CheckCircle size={20} className="text-success" />
                            ) : (
                              <AlertCircle size={20} className="text-danger" />
                            )}
                            <span className="badge bg-secondary">{answer.marks_awarded} points</span>
                          </div>
                        </div>
                        <p className="mb-2">{answer.question}</p>
                        <div className="mb-2">
                          <strong>Your Answer: </strong>
                          <span className={answer.is_correct ? 'text-success' : 'text-danger'}>
                            {answer.selected_option_text || answer.text_answer}
                          </span>
                        </div>
                        {answer.teacher_feedback && (
                          <div className="alert alert-info">
                            <strong>Feedback: </strong>{answer.teacher_feedback}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted">
                      <p>No answer details available for this assessment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // if isSubmitted and no results, show loading
  if (isSubmitted && !results) {
    return (
      <div className="profile-root">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="loading-spinner mb-4" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h1 className="main-title mb-3">Processing Results...</h1>
                  <p className="profile-joined mb-4">
                    Your assessment has been submitted successfully. Loading your results...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions?.[currentQuestionIndex];
  const totalQuestions = assessment.questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="profile-root">
      {/* Header with Timer */}
      <div className="card border-0 shadow-sm sticky-top" style={{ zIndex: 1000 }}>
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-link text-decoration-none me-3"
                onClick={() => setShowConfirmSubmit(true)}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h4 className="mb-1">{assessment.title}</h4>
                <small className="text-muted">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </small>
              </div>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <div className="text-center">
                <div className={`h5 mb-0 ${timeRemaining <= 300 ? 'text-danger' : timeRemaining <= 600 ? 'text-warning' : 'text-main'}`}>
                  <Clock size={20} className="me-2" />
                  {formatTime(timeRemaining)}
                </div>
                <small className="text-muted">Time Remaining</small>
                {timeRemaining <= 300 && (
                  <div className="text-danger small mt-1">
                    <AlertCircle size={14} className="me-1" />
                    Time is running out!
                  </div>
                )}
              </div>
              
              <div className="progress" style={{ width: '200px', height: '8px' }}>
                <div 
                  className={`progress-bar ${timeRemaining <= 300 ? 'bg-danger' : timeRemaining <= 600 ? 'bg-warning' : ''}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Time Warning Banner */}
            {timeRemaining <= 300 && timeRemaining > 0 && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <AlertCircle size={20} className="me-2" />
                <div>
                  <strong>Warning:</strong> You have less than 5 minutes remaining! 
                  Please submit your assessment soon to avoid automatic submission.
                </div>
              </div>
            )}
            
            {currentQuestion && (
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  {/* Question Header */}
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h5 className="mb-2">Question {currentQuestionIndex + 1}</h5>
                      <span className="badge bg-secondary me-2">
                        {getQuestionTypeLabel(currentQuestion.question_type)}
                      </span>
                      <span className="badge bg-secondary">
                        {currentQuestion.mark} marks
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="question-text mb-4">
                    <p className="h6">{currentQuestion.question_text}</p>
                  </div>

                  {/* Question Options/Answer */}
                  <div className="question-content mb-4">
                    {renderQuestion(currentQuestion)}
                  </div>

                  {/* Navigation */}
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn-secondary-action"
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0 || isSubmitted}
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Previous
                    </button>

                    <div className="d-flex gap-2">
                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <button
                          className="btn-edit-profile"
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        >
                          Next
                          <ArrowLeft size={16} className="ms-2" style={{ transform: 'rotate(180deg)' }} />
                        </button>
                      ) : (
                        <button
                          className="btn-edit-profile"
                          onClick={() => setShowConfirmSubmit(true)}
                        >
                          <Send size={16} className="me-2" />
                          Submit Assessment
                        </button>
                      )}
                      

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="enrollment-modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" onClick={() => setShowConfirmSubmit(false)}>
          <div className="card enrollment-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-body p-4 text-center">
              <AlertCircle size={48} className="text-main mb-3" />
              <h4 className="main-title mb-3">Submit Assessment?</h4>
              <p className="profile-joined mb-4">
                Are you sure you want to submit your assessment? This action cannot be undone.
              </p>
              
              <div className="d-flex gap-3 justify-content-center">
                <button
                  className="btn-secondary-action"
                  onClick={() => setShowConfirmSubmit(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-edit-profile"
                  onClick={handleSubmitAssessment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner me-2" style={{ width: '1rem', height: '1rem' }}></div>
                      Submitting...
                    </>
                  ) : (
                    'Yes, Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssessmentDetails;
