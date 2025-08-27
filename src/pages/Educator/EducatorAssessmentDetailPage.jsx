import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
	XCircle,
	Info,
	Calendar,
	Timer,
	Target,
	BookOpen,
	AlertCircle
} from "lucide-react";
import useEducatorAssessmentDetail from "../../apis/hooks/educator/useEducatorAssessmentDetail";
import useEducatorAssessmentAttempts from "../../apis/hooks/educator/useEducatorAssessmentAttempts";
import createQuestion from "../../apis/actions/educator/createQuestion";
import updateQuestion from "../../apis/actions/educator/updateQuestion";
import deleteQuestion from "../../apis/actions/educator/deleteQuestion";
import createOption from "../../apis/actions/educator/createOption";
import updateOption from "../../apis/actions/educator/updateOption";
import deleteOption from "../../apis/actions/educator/deleteOption";
import updateAssessment from "../../apis/actions/educator/updateAssessment";
import deleteAssessment from "../../apis/actions/educator/deleteAssessment";
import { educatorEndpoints } from "../../apis/endpoints/educatorApi";
import baseApi from "../../apis/base";
import QuestionModal from "../../components/common/QuestionModal/QuestionModal";

export default function EducatorAssessmentDetailPage() {
	const { assessmentId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [showCreateQuestion, setShowCreateQuestion] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [activeTab, setActiveTab] = useState("details");
	const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
	const [assessmentForm, setAssessmentForm] = useState({
		title: "",
		description: "",
		assessment_type: "quiz",
		is_published: false,
		is_timed: false,
		time_limit: null,
		max_attempts: 3,
		passing_score: "70.00",
		available_from: "",
		available_until: ""
	});
	const [assessmentUpdateLoading, setAssessmentUpdateLoading] = useState(false);
	const [deletingAssessment, setDeletingAssessment] = useState(false);

	// Fetch assessment details with questions included
	const {
		assessment,
		questions,
		isLoading: assessmentLoading,
		error: assessmentError,
		mutate: mutateAssessment
	} = useEducatorAssessmentDetail(assessmentId);

	// Fetch assessment attempts
	const {
		attempts,
		isLoading: attemptsLoading,
		error: attemptsError,
		mutate: mutateAttempts
	} = useEducatorAssessmentAttempts(assessmentId);

	// State declarations
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

	// Helper function to populate form when editing a question
	const populateQuestionForm = (question) => {
		console.log("Populating form with question details:", question);

		// Handle options based on question type and available data
		let formOptions = [];

		if (question.question_type === "multiple_choice" || question.question_type === "true_false") {
			if (question.options && question.options.length > 0) {
				// Map existing options, handling missing is_correct field
				formOptions = question.options.map(opt => ({
					id: opt.id,
					option_text: opt.option_text || "",
					is_correct: Boolean(opt.is_correct || false), // Default to false if not provided
					order: opt.order || 1
				}));

				// Sort options by order if available
				formOptions.sort((a, b) => (a.order || 0) - (b.order || 0));

				// If no option is marked as correct, mark the first one as correct for editing convenience
				const hasCorrectOption = formOptions.some(opt => opt.is_correct);
				if (!hasCorrectOption && formOptions.length > 0) {
					formOptions[0].is_correct = true;
				}
			} else {
				// Create default options if none exist
				if (question.question_type === "true_false") {
					formOptions = [
						{ option_text: "True", is_correct: true, order: 1 },
						{ option_text: "False", is_correct: false, order: 2 }
					];
				} else {
					formOptions = [
						{ option_text: "", is_correct: true, order: 1 },
						{ option_text: "", is_correct: false, order: 2 }
					];
				}
			}
		}

		setQuestionForm({
			question_text: question.question_text || "",
			question_type: question.question_type || "multiple_choice",
			points: question.points || parseFloat(question.mark) || 1,
			order: question.order || 1,
			explanation: question.explanation || "",
			image: null, // Don't pre-populate file input
			options: formOptions
		});
		setShowCreateQuestion(true);
	};

	// Question management functions
	const handleCreateQuestion = async (e) => {
		e.preventDefault();

		if (!assessmentId) {
			alert(t('assessments.noAssessmentSelected'));
			return;
		}

		if (!questionForm.question_text?.trim()) {
			alert(t('assessments.questionTextRequired'));
			return;
		}

		// Validate options for multiple choice questions
		const validOptions = questionForm.options?.filter(opt => opt.option_text?.trim() !== "") || [];
		if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && validOptions.length < 2) {
			alert(t('assessments.provideAtLeast2Options'));
			return;
		}

		// Ensure at least one correct answer for multiple choice
		if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && !validOptions.some(opt => opt.is_correct)) {
			alert(t('assessments.markAtLeastOneCorrect'));
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
						alert(t('assessments.questionCreatedSuccessfully') + " " + t('assessments.optionsNotAddedAutomatically'));

						setShowCreateQuestion(false);
						mutateAssessment();
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
			mutateAssessment();
			alert(t('assessments.questionCreatedSuccessfully'));

		} catch (error) {
			console.error("Error creating question:", error);
			console.error("Error response:", error.response?.data);

			let errorMessage = t('assessments.failedToCreateQuestion');

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

			alert(`${t('assessments.errorCreatingQuestion')}\n${errorMessage}`);
		} finally {
			setQuestionLoading(false);
		}
	};

	const handleUpdateQuestion = async (e) => {
		e.preventDefault();

		if (!selectedQuestion?.id) {
			alert(t('assessments.noQuestionSelectedForUpdate'));
			return;
		}

		if (!questionForm.question_text?.trim()) {
			alert(t('assessments.questionTextRequired'));
			return;
		}

		// Validate options for multiple choice questions
		const validOptions = questionForm.options?.filter(opt => opt.option_text?.trim() !== "") || [];
		if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && validOptions.length < 2) {
			alert(t('assessments.provideAtLeast2Options'));
			return;
		}

		// Ensure at least one correct answer for multiple choice
		if ((questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && !validOptions.some(opt => opt.is_correct)) {
			alert(t('assessments.markAtLeastOneCorrect'));
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
			mutateAssessment();
			alert(t('assessments.questionUpdatedSuccessfully'));

		} catch (error) {
			console.error("Error updating question:", error);
			console.error("Error response:", error.response?.data);

			let errorMessage = t('assessments.failedToUpdateQuestion');

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

			alert(`${t('assessments.errorUpdatingQuestion')}\n${errorMessage}`);
		} finally {
			setQuestionLoading(false);
		}
	};

	const handleDeleteQuestion = async (questionId) => {
		if (!questionId) {
			alert(t('assessments.invalidQuestionId'));
			return;
		}

		if (window.confirm(t('assessments.areYouSureDeleteQuestion'))) {
			setDeletingQuestionId(questionId);

			try {
				console.log("Deleting question:", questionId);
				await deleteQuestion(questionId);

				// Refresh the questions list
				if (mutateAssessment) {
					await mutateAssessment();
				}

				alert(t('assessments.questionDeletedSuccessfully'));

			} catch (error) {
				console.error("Error deleting question:", error);
				console.error("Error response:", error.response?.data);

				let errorMessage = t('assessments.failedToDeleteQuestion');

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

				alert(`${t('assessments.errorDeletingQuestion')}\n${errorMessage}`);
			} finally {
				setDeletingQuestionId(null);
			}
		}
	};



	// Helper function to format datetime for input
	const formatDateTimeForInput = (dateString) => {
		if (!dateString) return "";
		try {
			const date = new Date(dateString);
			// Format to YYYY-MM-DDTHH:MM format for datetime-local input
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day}T${hours}:${minutes}`;
		} catch (error) {
			console.error("Error formatting date:", error);
			return "";
		}
	};

	// Helper function to validate datetime
	const validateDateTime = (dateString) => {
		if (!dateString) return true; // Empty is valid
		try {
			const date = new Date(dateString);
			return !isNaN(date.getTime());
		} catch (error) {
			return false;
		}
	};

	// Input handlers for datetime fields
	const handleAvailableFromChange = (e) => {
		const value = e.target.value;

		if (!value) {
			setAssessmentForm({ ...assessmentForm, available_from: "" });
			return;
		}

		if (validateDateTime(value)) {
			// Check if available_from is before available_until
			if (assessmentForm.available_until && new Date(value) >= new Date(assessmentForm.available_until)) {
				alert(t('assessments.availableFromDateBeforeUntil'));
				return;
			}
			setAssessmentForm({ ...assessmentForm, available_from: value });
		} else {
			alert(t('assessments.enterValidDateTime'));
		}
	};

	const handleAvailableUntilChange = (e) => {
		const value = e.target.value;

		if (!value) {
			setAssessmentForm({ ...assessmentForm, available_until: "" });
			return;
		}

		if (validateDateTime(value)) {
			// Check if available_until is after available_from
			if (assessmentForm.available_from && new Date(value) <= new Date(assessmentForm.available_from)) {
				alert(t('assessments.availableUntilDateAfterFrom'));
				return;
			}
			setAssessmentForm({ ...assessmentForm, available_until: value });
		} else {
			alert(t('assessments.enterValidDateTime'));
		}
	};

	// Assessment update functions
	const populateAssessmentForm = (assessmentData) => {
		setAssessmentForm({
			title: assessmentData.title || "",
			description: assessmentData.description || "",
			assessment_type: assessmentData.assessment_type || "quiz",
			is_published: Boolean(assessmentData.is_published),
			is_timed: Boolean(assessmentData.is_timed),
			time_limit: assessmentData.time_limit || null,
			max_attempts: assessmentData.max_attempts || 3,
			passing_score: assessmentData.passing_score || "70.00",
			available_from: formatDateTimeForInput(assessmentData.available_from),
			available_until: formatDateTimeForInput(assessmentData.available_until)
		});
	};

	const handleUpdateAssessment = async (e) => {
		e.preventDefault();

		if (!assessmentForm.title?.trim()) {
			alert(t('assessments.titleRequired'));
			return;
		}

		// Validate date range
		if (assessmentForm.available_from && assessmentForm.available_until) {
			const fromDate = new Date(assessmentForm.available_from);
			const untilDate = new Date(assessmentForm.available_until);

			if (fromDate >= untilDate) {
				alert(t('assessments.availableFromDateBeforeUntil'));
				return;
			}
		}

		// Validate that dates are not in the past (optional warning)
		const now = new Date();
		if (assessmentForm.available_until && new Date(assessmentForm.available_until) < now) {
			if (!window.confirm(t('assessments.availableUntilDateInPast'))) {
				return;
			}
		}

		setAssessmentUpdateLoading(true);

		try {
			const updateData = {
				title: assessmentForm.title.trim(),
				description: assessmentForm.description?.trim() || "",
				is_published: assessmentForm.is_published,
				is_timed: assessmentForm.is_timed,
				time_limit: assessmentForm.is_timed ? parseInt(assessmentForm.time_limit) || null : null,
				max_attempts: parseInt(assessmentForm.max_attempts) || 3,
				passing_score: parseFloat(assessmentForm.passing_score) || 70.00,
				available_from: assessmentForm.available_from ? new Date(assessmentForm.available_from).toISOString() : null,
				available_until: assessmentForm.available_until ? new Date(assessmentForm.available_until).toISOString() : null
			};

			console.log("Updating assessment with data:", updateData);
			await updateAssessment(assessmentId, updateData);

			setShowUpdateAssessment(false);
			mutateAssessment();
			alert(t('assessments.assessmentUpdatedSuccessfully'));

		} catch (error) {
			console.error("Error updating assessment:", error);
			console.error("Error response:", error.response?.data);

			let errorMessage = t('assessments.failedToUpdateAssessment');

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

			alert(`${t('assessments.errorUpdatingAssessment')}\n${errorMessage}`);
		} finally {
			setAssessmentUpdateLoading(false);
		}
	};

	// Helper function to set current datetime as default
	const setCurrentDateTime = (field) => {
		const now = new Date();
		const formattedNow = formatDateTimeForInput(now.toISOString());

		if (field === 'available_from') {
			setAssessmentForm({ ...assessmentForm, available_from: formattedNow });
		} else if (field === 'available_until') {
			// Set default to 1 week from now
			const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
			const formattedLater = formatDateTimeForInput(oneWeekLater.toISOString());
			setAssessmentForm({ ...assessmentForm, available_until: formattedLater });
		}
	};

	// Helper function to clear datetime field
	const clearDateTime = (field) => {
		if (field === 'available_from') {
			setAssessmentForm({ ...assessmentForm, available_from: "" });
		} else if (field === 'available_until') {
			setAssessmentForm({ ...assessmentForm, available_until: "" });
		}
	};

	const handleEditAssessment = () => {
		if (assessment) {
			populateAssessmentForm(assessment);
			setShowUpdateAssessment(true);
		}
	};

	const handleDeleteAssessment = async () => {
		if (!assessmentId) {
			alert("No assessment selected");
			return;
		}

		const confirmDelete = window.confirm(
			t('assessments.areYouSureDeleteAssessment', { title: assessment?.title || t('assessments.thisAssessment') })
		);

		if (!confirmDelete) return;

		// Additional confirmation for safety
		const confirmText = window.prompt(
			t('assessments.pleaseTypeDelete')
		);

		if (confirmText !== 'DELETE') {
			alert(t('assessments.deletionCancelled'));
			return;
		}

		setDeletingAssessment(true);

		try {
			console.log("Deleting assessment:", assessmentId);
			await deleteAssessment(assessmentId);

			alert(t('assessments.assessmentDeletedSuccessfully'));

			// Navigate back to assessments list
			navigate("/assessments");

		} catch (error) {
			console.error("Error deleting assessment:", error);
			console.error("Error response:", error.response?.data);

			let errorMessage = t('assessments.failedToDeleteAssessment');

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

			alert(`${t('assessments.errorDeletingAssessment')}\n${errorMessage}`);
		} finally {
			setDeletingAssessment(false);
		}
	};

	// Edit functions
	const handleEditQuestion = (question) => {
		console.log("Starting to edit question:", question.id);
		setSelectedQuestion(question);
		// Populate the form directly with the question data from assessment details
		populateQuestionForm(question);
	};

	if (assessmentLoading) {
		return (
			<div className="profile-root p-4">
				<div className="container text-center py-5">
					<div className="loading-spinner"></div>
					<p className="mt-3 text-muted">{t('assessments.loadingAssessmentDetails')}</p>
				</div>
			</div>
		);
	}

	if (assessmentError) {
		return (
			<div className="profile-root p-4">
				<div className="container">
					<div className="alert alert-danger">
						{t('assessments.errorLoadingAssessment')} {assessmentError.message}
					</div>
				</div>
			</div>
		);
	}

	// If assessment data is not yet available, show loading
	if (!assessment) {
		return (
			<div className="profile-root p-4">
				<div className="container text-center py-5">
					<div className="loading-spinner"></div>
					<p className="mt-3 text-muted">{t('assessments.loadingAssessmentDetails')}</p>
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
									<h1 className="main-title mb-0">
										{assessment.title || t('assessments.assessment')}
									</h1>
									<p className="profile-role mb-0">
										<span
											style={{
												color:
													assessment.assessment_type === "quiz"
														? "var(--bs-primary)"
														: assessment.assessment_type === "assignment"
															? "var(--bs-warning)"
															: assessment.assessment_type === "course_exam"
																? "var(--bs-danger)"
																: "var(--bs-secondary)",
											}}
										>
											{assessment.assessment_type === "quiz" ? t('assessments.quiz') :
												assessment.assessment_type === "assignment" ? t('assessments.assignment') :
													assessment.assessment_type === "course_exam" ? t('assessments.courseExam') :
														assessment.assessment_type?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || t('assessments.quiz')}
										</span>
										<span className="text-muted">
											{" "}
											• {assessment.total_questions || 0} {t('assessments.questions')}
										</span>
									</p>
								</div>
							</div>
							<div className="d-flex gap-2">
								<button
									className="btn-secondary-action me-3 gap-2"
									onClick={() => navigate("/assessments")}
								>
									<ArrowLeft size={20} /> {t('assessments.backToAssessments')}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Assessment Stats */}
				<div className="row g-3 mb-4">
					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
									<FileText size={24} />
								</div>
								<h4 className="mt-2" style={{ color: "var(--bs-primary)" }}>
									{assessment.total_questions || 0}
								</h4>
								<p className="profile-role">{t('assessments.totalQuestions')}</p>
							</div>
						</div>
					</div>

					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
									<Users size={24} />
								</div>
								<h4 className="mt-2" style={{ color: "var(--bs-info)" }}>
									{assessment.total_attempts || 0}
								</h4>
								<p className="profile-role">{t('assessments.totalAttempts')}</p>
							</div>
						</div>
					</div>

					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
									<BarChart3 size={24} />
								</div>
								<h4
									className="mb-1 mt-2"
									style={{ color: "var(--bs-warning)" }}
								>
									{(assessment.average_score || 0).toFixed(1)}%
								</h4>
								<p className="profile-role">{t('assessments.avgScore')}</p>
							</div>
						</div>
					</div>

					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
									<CheckCircle size={24} />
								</div>
								<h4 className="mt-2" style={{ color: "var(--bs-success)" }}>
									{assessment.passing_score || assessment.passing_grade || 70}%
								</h4>
								<p className="profile-role">{t('assessments.passingScore')}</p>
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
									className={`nav-link ${activeTab === "details" ? "active" : ""
										}`}
									onClick={() => setActiveTab("details")}
								>
									<Info size={16} className="me-2" />
									{t('assessments.assessmentDetails')}
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${activeTab === "questions" ? "active" : ""
										}`}
									onClick={() => setActiveTab("questions")}
								>
									<FileText size={16} className="me-2" />
									{t('assessments.questions')} ({assessment.total_questions || 0})
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${activeTab === "attempts" ? "active" : ""
										}`}
									onClick={() => setActiveTab("attempts")}
								>
									<Users size={16} className="me-2" />
									{t('assessments.attempts')} ({assessment.total_attempts || 0})
								</button>
							</li>
						</ul>
					</div>
				</div>

				{/* Details Tab */}
				{activeTab === "details" && (
					<div className="card border-0 shadow-sm">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h4 className="section-title mb-0">{t('assessments.assessmentDetails')}</h4>
								<div className="d-flex gap-2">
									<button
										className="btn-secondary-action"
										onClick={handleEditAssessment}
									>
										<Edit size={16} className="me-2" />
										{t('assessments.editAssessment')}
									</button>
									<button
									className="btn-secondary-danger d-flex align-items-center"
									onClick={handleDeleteAssessment}
									disabled={deletingAssessment}
								>
									{deletingAssessment ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-2"
												role="status"
												aria-hidden="true"
											></span>
											{t('assessments.deleting')}
										</>
									) : (
										<>
											<Trash2 size={18} className="me-2" /> {t('assessments.deleteAssessment')}
										</>
									)}
								</button>
								</div>
							</div>

							<div className="row g-4">
								{/* Basic Information */}
								<div className="col-lg-6">
									<div className="about-bubble h-100">
										<div className="card-header  ">
											<h5 className="card-title text-main mb-0">
												<BookOpen size={20} className="me-2" />
												{t('assessments.basicInformation')}
											</h5>
										</div>
										<div className="card-body">
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">{t('assessments.title')}</label>
												<p className="mb-0">{assessment.title || "N/A"}</p>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.description')}
												</label>
												<p className="mb-0 text-muted">
													{assessment.description || t('assessments.noDescriptionProvided')}
												</p>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.assessmentType')}
												</label>
												<p
													className="mb-0 fw-semibold"
													style={{
														color:
															assessment.assessment_type === "quiz"
																? "var(--bs-primary)"
																: assessment.assessment_type === "assignment"
																	? "var(--bs-warning)"
																	: assessment.assessment_type === "course_exam"
																		? "var(--bs-danger)"
																		: "var(--bs-secondary)",
													}}
												>
													{assessment.assessment_type === "quiz" ? t('assessments.quiz') :
														assessment.assessment_type === "assignment" ? t('assessments.assignment') :
															assessment.assessment_type === "course_exam" ? t('assessments.courseExam') :
																assessment.assessment_type?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || t('assessments.quiz')}
												</p>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.relatedTo')}
												</label>
												{assessment.related_to ? (
													<div className="d-flex flex-column">
														<span
															className="me-2 fw-semibold text-uppercase small"
															style={{
																color:
																	assessment.related_to.type === "lesson"
																		? "var(--bs-info)"
																		: assessment.related_to.type === "module"
																			? "var(--bs-success)"
																			: assessment.related_to.type === "course"
																				? "var(--bs-primary)"
																				: "var(--bs-secondary)",
															}}
														>
															{assessment.related_to.type}
														</span>
														<span className="text-main">
															{assessment.related_to.title}
														</span>
													</div>

												) : (
													<p className="mb-0 text-muted">
														{t('assessments.notLinkedToContent')}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Status & Availability */}
								<div className="col-lg-6">
									<div className="about-bubble h-100">
										<div className="card-header">
											<h5 className="card-title text-main mb-0">
												<CheckCircle size={20} className="me-2" />
												{t('assessments.statusAndAvailability')}
											</h5>
										</div>
										<div className="card-body">
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.publicationStatus')}
												</label>
												<div className="d-flex align-items-center">
													<span
														className="fw-semibold"
														style={{
															color: assessment.is_published
																? "var(--bs-success)"
																: "var(--bs-warning)",
														}}
													>
														{assessment.is_published ? (
															<>
																<CheckCircle size={16} className="me-2" />
																{t('assessments.published')}
															</>
														) : (
															<>
																<AlertCircle size={16} className="me-2" />
																{t('assessments.draft')}
															</>
														)}
													</span>
												</div>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.availability')}
												</label>
												<div className="d-flex align-items-center">
													<span
														className="fw-semibold"
														style={{
															color: assessment.is_available
																? "var(--bs-success)"
																: "var(--bs-danger)",
														}}
													>
														{assessment.is_available ? (
															<>
																<CheckCircle size={16} className="me-2" />
																{t('assessments.available')}
															</>
														) : (
															<>
																<XCircle size={16} className="me-2" />
																{t('assessments.notAvailable')}
															</>
														)}
													</span>
												</div>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.availableFrom')}
												</label>
												<p className="mb-0">
													{assessment.available_from ? (
														<span style={{ color: "var(--bs-info)" }}>
															<Calendar size={14} className="me-1" />
															{new Date(
																assessment.available_from
															).toLocaleString()}
														</span>
													) : (
														<span className="text-muted">
															{t('assessments.noStartDateSet')}
														</span>
													)}
												</p>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.availableUntil')}
												</label>
												<p className="mb-0">
													{assessment.available_until ? (
														<span style={{ color: "var(--bs-info)" }}>
															<Calendar size={14} className="me-1" />
															{new Date(
																assessment.available_until
															).toLocaleString()}
														</span>
													) : (
														<span className="text-muted">{t('assessments.noEndDateSet')}</span>
													)}
												</p>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.created')}
												</label>
												<p className="mb-0">
													<span style={{ color: "var(--bs-secondary)" }}>
														<Clock size={14} className="me-1" />
														{assessment.created_at
															? new Date(assessment.created_at).toLocaleString()
															: "N/A"}
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Timing & Attempts */}
								<div className="col-lg-6">
									<div className="about-bubble h-100">
										<div className="card-header  ">
											<h5 className="card-title text-main mb-0">
												<Timer size={20} className="me-2" />
												{t('assessments.timingAndAttempts')}
											</h5>
										</div>
										<div className="card-body">
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.timedAssessment')}
												</label>
												<div className="d-flex align-items-center">
													<span
														className="fw-semibold"
														style={{
															color: assessment.is_timed
																? "var(--bs-warning)"
																: "var(--bs-secondary)",
														}}
													>
														{assessment.is_timed ? (
															<>
																<Timer size={16} className="me-2" />
																{t('assessments.timed')}
															</>
														) : (
															t('assessments.noTimeLimit')
														)}
													</span>
												</div>
											</div>
											{assessment.is_timed && (
												<div className="mb-3">
													<label className="form-label text-main fw-semibold">
														{t('assessments.timeLimit')}
													</label>
													<p className="mb-0">
														<span style={{ color: "var(--bs-warning)" }}>
															<Clock size={14} className="me-1" />
															{assessment.time_limit
																? `${assessment.time_limit} ${t('assessments.minutes')}`
																: t('assessments.notSpecified')}
														</span>
													</p>
												</div>
											)}
											<div className="mb-3">
												<label className="form-label fw-semibold text-main">
													{t('assessments.maximumAttempts')}
												</label>
												<p className="mb-0">
													<span style={{ color: "var(--bs-primary)" }}>
														<Target size={14} className="me-1" />
														{assessment.max_attempts || t('assessments.unlimited')}
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Scoring */}
								<div className="col-lg-6">
									<div className="about-bubble h-100">
										<div className="card-header  ">
											<h5 className="card-title text-main mb-0">
												<Target size={20} className="me-2" />
												{t('assessments.scoringInformation')}
											</h5>
										</div>
										<div className="card-body">
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.totalQuestions')}
												</label>
												<p className="mb-0">
													<span style={{ color: "var(--bs-info)" }}>
														<FileText size={14} className="me-1" />
														{assessment.total_questions || 0}
													</span>
												</p>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.totalMarks')}
												</label>
												<p className="mb-0">
													<span style={{ color: "var(--bs-primary)" }}>
														<Target size={14} className="me-1" />
														{assessment.total_marks || "0.00"} {t('assessments.points')}
													</span>
												</p>
											</div>
											<div className="mb-3">
												<label className="form-label text-main fw-semibold">
													{t('assessments.passingScore')}
												</label>
												<p className="mb-0">
													<span style={{ color: "var(--bs-success)" }}>
														<CheckCircle size={14} className="me-1" />
														{assessment.passing_score || "70.00"}%
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Questions Tab */}
				{activeTab === "questions" && (
					<div className="card border-0 shadow-sm">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h4 className="section-title mb-0">{t('assessments.assessmentQuestions')}</h4>
								<button
									className="btn-edit-profile"
									onClick={() => setShowCreateQuestion(true)}
								>
									<Plus size={16} className="me-2" />
									{t('assessments.addQuestion')}
								</button>
							</div>

							{/* Questions Summary */}
							{questions && questions.length > 0 && (
								<div className="row g-3 mb-4">
									<div className="col-md-3">
										<div className="card">
											<div className="card-body text-center">
												<h5 className="profile-role mt-2 fs-3">
													{questions.length}
												</h5>
												<small className="profile-role">{t('assessments.totalQuestions')}</small>
											</div>
										</div>
									</div>
									<div className="col-md-3">
										<div className="card">
											<div className="card-body text-center">
												<h5 className="profile-role mt-2 fs-3">
													{questions.reduce(
														(sum, q) => sum + (parseFloat(q.mark) || 1),
														0
													)}
												</h5>
												<small className="profile-role">{t('assessments.totalPoints')}</small>
											</div>
										</div>
									</div>
									<div className="col-md-3">
										<div className="card">
											<div className="card-body text-center">
												<h5 className="profile-role mt-2 fs-3">
													{
														questions.filter(
															(q) =>
																q.question_type === "multiple_choice" ||
																q.question_type === "true_false"
														).length
													}
												</h5>
												<small className="profile-role">{t('assessments.autoGraded')}</small>
											</div>
										</div>
									</div>
									<div className="col-md-3">
										<div className="card">
											<div className="card-body text-center">
												<h5 className="profile-role mt-2 fs-3">
													{
														questions.filter(
															(q) =>
																q.question_type === "short_answer" ||
																q.question_type === "essay"
														).length
													}
												</h5>
												<small className="profile-role">{t('assessments.manualGrading')}</small>
											</div>
										</div>
									</div>
								</div>
							)}

							{questions && questions.length > 0 ? (
								<div className="row">
									{questions.map((question, index) => (
										<div key={question.id} className="col-12 mb-4">
											<div className="card card-hoverable">
												<div className="card-body">
													<div className="d-flex justify-content-between align-items-start mb-3">
														<div className="d-flex align-items-center flex-wrap">
															<span className="badge bg-secondary me-2 mb-1">
																Q{question.order || index + 1}
															</span>
															<span className="badge   text-dark me-2 mb-1">
																{question.question_type === "multiple_choice" ? t('assessments.multipleChoice') :
																	question.question_type === "true_false" ? t('assessments.trueFalse') :
																		question.question_type === "short_answer" ? t('assessments.shortAnswer') :
																			question.question_type === "essay" ? t('assessments.essay') :
																				question.question_type?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || t('assessments.multipleChoice')}
															</span>
															<span className="badge bg-dark me-2 mb-1">
																{question.mark || question.points || 1} {t('assessments.points')}
															</span>
															{question.explanation && (
																<span className="badge bg-success text-white me-2 mb-1">
																	<Eye size={12} className="me-1" />
																	{t('assessments.hasExplanation')}
																</span>
															)}
															{question.image && (
																<span className="badge bg-info text-white me-2 mb-1">
																	<FileText size={12} className="me-1" />
																	{t('assessments.hasImage')}
																</span>
															)}
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
																	<span
																		className="spinner-border spinner-border-sm"
																		role="status"
																		aria-hidden="true"
																	></span>
																) : (
																	<Settings size={16} />
																)}
															</button>
															<ul
																className={`dropdown-menu ${openDropdownId === question.id ? "show" : ""
																	}`}
																style={{
																	position: "absolute",
																	top: "100%",
																	right: "0",
																	zIndex: 1000,
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
																		disabled={
																			deletingQuestionId === question.id
																		}
																	>
																		<Edit size={16} className="me-2" />
																		{t('assessments.edit')}
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
																		disabled={
																			deletingQuestionId === question.id
																		}
																	>
																		{deletingQuestionId === question.id ? (
																			<>
																				<span
																					className="spinner-border spinner-border-sm me-2"
																					role="status"
																					aria-hidden="true"
																				></span>
																				{t('assessments.deleting')}
																			</>
																		) : (
																			<>
																				<Trash2 size={16} className="me-2" />
																				{t('assessments.delete')}
																			</>
																		)}
																	</button>
																</li>
															</ul>
														</div>
													</div>

													<div className="question-content mb-3">
														<h6 className="card-title mb-3">
															{question.question_text}
														</h6>

														{/* Question Image */}
														{question.image && (
															<div className="mb-3">
																<img
																	src={question.image}
																	alt="Question illustration"
																	className="img-fluid rounded border"
																	style={{
																		maxHeight: "200px",
																		objectFit: "contain",
																	}}
																/>
															</div>
														)}

														{/* Question Options */}
														{question.options &&
															question.options.length > 0 && (
																<div className="mb-3">
																	<label className="form-label fw-semibold">
																		<FileText size={16} className="me-2" />
																		{t('assessments.answerOptions')} ({question.options.length}):
																	</label>
																	<div className="row">
																		{question.options.map(
																			(option, optIndex) => (
																				<div
																					key={option.id || optIndex}
																					className="col-md-6 mb-2"
																				>
																					<div
																						className={`d-flex align-items-center p-3 rounded border ${option.is_correct
																							? " border-success border-2"
																							: "border-light"
																							}`}
																					>
																						<span className="me-2">
																							{option.is_correct ? (
																								<CheckCircle
																									size={16}
																									className="text-success"
																								/>
																							) : (
																								<span className="badge bg-secondary">
																									{String.fromCharCode(
																										65 + optIndex
																									)}
																								</span>
																							)}
																						</span>
																						<span className="flex-grow-1">
																							{option.option_text}
																						</span>
																						{option.is_correct && (
																							<span className="badge bg-success text-white">
																								{t('assessments.correct')}
																							</span>
																						)}
																					</div>
																				</div>
																			)
																		)}
																	</div>
																</div>
															)}

														{/* Question Explanation */}
														{question.explanation && (
															<div className="mb-3">
																<label className="form-label fw-semibold text-dark">
																	<Eye size={16} className="me-2" />
																	{t('assessments.explanation')}:
																</label>
																<div className="p-3 rounded border-start border-3   border-primary">
																	<p className="mb-0 text-muted">
																		{question.explanation}
																	</p>
																</div>
															</div>
														)}

														{/* Question Type Specific Info */}
														{question.question_type === "short_answer" && (
															<div className="alert alert-info mb-3">
																<small>
																	<strong>{t('assessments.note')}:</strong> {t('assessments.shortAnswerNote')}
																</small>
															</div>
														)}

														{question.question_type === "essay" && (
															<div className="alert alert-info mb-3">
																<small>
																	<strong>{t('assessments.note')}:</strong> {t('assessments.essayNote')}
																</small>
															</div>
														)}
													</div>

													<div className="question-footer">
														<div className="row align-items-center">
															<div className="col-md-6">
																<div className="d-flex justify-content-md-end gap-3">
																	<div className="text-center">
																		<div className="fw-semibold text-dark">
																			{parseFloat(question.mark) || 1}
																		</div>
																		<small className="text-muted">{t('assessments.points')}</small>
																	</div>
																	<div className="text-center">
																		<div className="fw-semibold text-muted">
																			#{question.order || 1}
																		</div>
																		<small className="text-muted">{t('assessments.order')}</small>
																	</div>
																</div>
															</div>
														</div>

														{/* Additional Question Metadata */}
														<div className="mt-2 pt-2 border-top">
															<div className="d-flex flex-wrap gap-2">
																{question.question_type === "multiple_choice" &&
																	question.options &&
																	question.options.length > 0 && (
																		<span className="badge   text-dark">
																			{question.options.length} {t('assessments.options')}
																		</span>
																	)}
																{question.question_type === "true_false" && (
																	<span className="badge   text-dark">
																		{t('assessments.trueFalse')}
																	</span>
																)}
																{(question.question_type === "short_answer" ||
																	question.question_type === "essay") && (
																		<span className="badge bg-warning text-dark">
																			{t('assessments.manualGradingRequired')}
																		</span>
																	)}
																{question.image && (
																	<span className="badge   text-dark">
																		{t('assessments.visualQuestion')}
																	</span>
																)}
															</div>
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
									<h5 className="text-muted">{t('assessments.noQuestionsYet')}</h5>
									<p className="text-muted">
										{t('assessments.addFirstQuestion')}
									</p>
									<button
										className="btn-edit-profile"
										onClick={() => setShowCreateQuestion(true)}
									>
										<Plus size={16} className="me-2" />
										{t('assessments.addFirstQuestion')}
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
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h4 className="section-title mb-0">{t('assessments.studentAttempts')}</h4>
								<div className="d-flex align-items-center">
									<span className="badge bg-primary me-2">
										{attempts?.length || 0} {t('assessments.totalAttempts')}
									</span>
									{attemptsLoading && (
										<div className="spinner-border spinner-border-sm text-primary" role="status">
											<span className="visually-hidden">{t('common.loading')}</span>
										</div>
									)}
								</div>
							</div>

							{attemptsError && (
								<div className="alert alert-danger" role="alert">
									<AlertCircle size={16} className="me-2" />
									{t('assessments.errorLoadingAttempts')} {attemptsError.message}
								</div>
							)}

							{attemptsLoading ? (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">{t('assessments.loadingStudentAttempts')}</span>
									</div>
									<p className="text-muted mt-3">{t('assessments.loadingStudentAttempts')}</p>
								</div>
							) : attempts && attempts.length > 0 ? (
								<div className="table-responsive">
									<table className="table table-hover">
										<thead className="table-light">
											<tr>
												<th scope="col">{t('assessments.student')}</th>
												<th scope="col">{t('assessments.attemptNumber')}</th>
												<th scope="col">{t('assessments.status')}</th>
												<th scope="col">{t('assessments.score')}</th>
												<th scope="col">{t('assessments.percentage')}</th>
												<th scope="col">{t('assessments.startedAt')}</th>
												<th scope="col">{t('assessments.submittedAt')}</th>
												<th scope="col">{t('assessments.timeTaken')}</th>
												<th scope="col">{t('assessments.actions')}</th>
											</tr>
										</thead>
										<tbody>
											{attempts.map((attempt) => (
												<tr key={attempt.id}>
													<td>
														<div className="d-flex align-items-center">
															<div className="avatar-sm me-2">
																<img
																	src={attempt.student?.avatar || 'https://placehold.co/32x32?text=S'}
																	alt={attempt.student?.username || 'Student'}
																	className="rounded-circle"
																	style={{ width: '32px', height: '32px', objectFit: 'cover' }}
																/>
															</div>
															<div>
																<div className="fw-medium">
																	{attempt.student?.first_name} {attempt.student?.last_name}
																</div>
																<small className="text-muted">
																	@{attempt.student?.username}
																</small>
															</div>
														</div>
													</td>
													<td>
														<span className="badge bg-secondary">
															#{attempt.attempt_number || 1}
														</span>
													</td>
													<td>
														<span className={`badge ${attempt.status === 'completed' ? 'bg-success' :
															attempt.status === 'in_progress' ? 'bg-warning' :
																attempt.status === 'graded' ? 'bg-info' :
																	'bg-secondary'
															}`}>
															{attempt.status === 'completed' && <CheckCircle size={12} className="me-1" />}
															{attempt.status === 'in_progress' && <Clock size={12} className="me-1" />}
															{attempt.status === 'graded' && <Target size={12} className="me-1" />}
															{attempt.status?.charAt(0).toUpperCase() + attempt.status?.slice(1) || 'Unknown'}
														</span>
													</td>
													<td>
														<span className="fw-medium">
															{attempt.score !== null && attempt.score !== undefined ?
																`${attempt.score}/${attempt.total_points || assessment?.total_points || 'N/A'}` :
																'Not graded'
															}
														</span>
													</td>
													<td>
														{attempt.percentage !== null && attempt.percentage !== undefined ? (
															<div className="d-flex align-items-center">
																<div className="progress me-2" style={{ width: '60px', height: '6px' }}>
																	<div
																		className={`progress-bar ${attempt.percentage >= 70 ? 'bg-success' :
																			attempt.percentage >= 50 ? 'bg-warning' : 'bg-danger'
																			}`}
																		style={{ width: `${Math.min(attempt.percentage, 100)}%` }}
																	></div>
																</div>
																<span className={`small fw-medium ${attempt.percentage >= 70 ? 'text-success' :
																	attempt.percentage >= 50 ? 'text-warning' : 'text-danger'
																	}`}>
																	{attempt.percentage}%
																</span>
															</div>
														) : (
															<span className="text-muted">-</span>
														)}
													</td>
													<td>
														<small className="text-muted">
															{attempt.started_at ?
																new Date(attempt.started_at).toLocaleString() :
																'N/A'
															}
														</small>
													</td>
													<td>
														<small className="text-muted">
															{attempt.submitted_at ?
																new Date(attempt.submitted_at).toLocaleString() :
																attempt.status === 'in_progress' ? 'In Progress' : 'N/A'
															}
														</small>
													</td>
													<td>
														<small className="text-muted">
															{attempt.time_taken ? (
																<span>
																	{Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s
																</span>
															) : (
																attempt.started_at && attempt.submitted_at ? (
																	<span>
																		{Math.floor((new Date(attempt.submitted_at) - new Date(attempt.started_at)) / 60000)}m
																	</span>
																) : 'N/A'
															)}
														</small>
													</td>
													<td>
														<div className="d-flex gap-1">
															<button
																className="btn btn-sm btn-outline-primary"
																title="View Details"
																onClick={() => {
																	// Navigate to attempt details or show modal
																	console.log('View attempt details:', attempt.id);
																}}
															>
																<Eye size={14} />
															</button>
															{attempt.status === 'completed' && (
																<button
																	className="btn btn-sm btn-outline-success"
																	title="Grade Attempt"
																	onClick={() => {
																		// Navigate to grading page or show grading modal
																		console.log('Grade attempt:', attempt.id);
																	}}
																>
																	<Target size={14} />
																</button>
															)}
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className="text-center py-5">
									<Users size={48} className="text-muted mb-3" />
									<h5 className="text-muted">{t('assessments.noStudentAttemptsYet')}</h5>
									<p className="text-muted">
										{t('assessments.studentsHaventStarted')}
										<br />
										{t('assessments.makeSurePublished')}
									</p>
								</div>
							)}
						</div>
					</div>
				)}


			</div>

			{/* Assessment Update Modal */}
			{showUpdateAssessment && (
				<div
					className="modal fade show d-block"
					tabIndex="-1"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">
									<Edit size={20} className="me-2" />
									{t('assessments.editAssessment')}
								</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowUpdateAssessment(false)}
									disabled={assessmentUpdateLoading}
								></button>
							</div>
							<form onSubmit={handleUpdateAssessment}>
								<div
									className="modal-body"
									style={{
										padding: "var(--spacing-xl)",
										backgroundColor: "var(--color-background)",
									}}
								>
									<div className="container-fluid">
										{/* Basic Information Section */}
										<div
											className="card mb-4"
											style={{
												border: "1px solid var(--color-border)",
												borderRadius: "var(--border-radius-md)",
											}}
										>
											<div
												className="card-header"
												style={{
													backgroundColor: "var(--color-card-background)",
													borderBottom: "1px solid var(--color-border)",
													padding: "var(--spacing-lg)",
												}}
											>
												<h6
													className="mb-0 d-flex align-items-center"
													style={{
														color: "var(--color-primary-dark)",
														fontWeight: "600",
													}}
												>
													<BookOpen size={18} className="me-2" />
													{t('assessments.basicInformation')}
												</h6>
											</div>
											<div
												className="card-body"
												style={{ padding: "var(--spacing-lg)" }}
											>
												<div className="row g-3">
													<div className="col-md-6">
														<label
															className="form-label fw-semibold"
															style={{ color: "var(--color-primary-dark)" }}
														>
															{t('assessments.titleRequired')}
														</label>
														<input
															type="text"
															className="form-control"
															value={assessmentForm.title}
															onChange={(e) =>
																setAssessmentForm({
																	...assessmentForm,
																	title: e.target.value,
																})
															}
															required
															disabled={assessmentUpdateLoading}
															style={{
																borderRadius: "var(--border-radius-sm)",
																border: "1px solid var(--color-border)",
																padding: "var(--spacing-sm) var(--spacing-md)",
															}}
														/>
													</div>

													<div className="col-md-6">
														<label
															className="form-label fw-semibold"
															style={{ color: "var(--color-primary-dark)" }}
														>
															{t('assessments.assessmentType')}
														</label>
														<select
															className="form-select"
															value={assessmentForm.assessment_type}
															onChange={(e) =>
																setAssessmentForm({
																	...assessmentForm,
																	assessment_type: e.target.value,
																})
															}
															disabled={assessmentUpdateLoading}
															style={{
																borderRadius: "var(--border-radius-sm)",
																border: "1px solid var(--color-border)",
																padding: "var(--spacing-sm) var(--spacing-md)",
															}}
														>
															<option value="quiz">{t('assessments.quiz')}</option>
															<option value="assignment">{t('assessments.assignment')}</option>
															<option value="course_exam">{t('assessments.courseExam')}</option>
														</select>
													</div>

													<div className="col-12">
														<label
															className="form-label fw-semibold"
															style={{ color: "var(--color-primary-dark)" }}
														>
															{t('assessments.description')}
														</label>
														<textarea
															className="form-control"
															rows="3"
															value={assessmentForm.description}
															onChange={(e) =>
																setAssessmentForm({
																	...assessmentForm,
																	description: e.target.value,
																})
															}
															disabled={assessmentUpdateLoading}
															placeholder={t('assessments.enterDescription')}
															style={{
																borderRadius: "var(--border-radius-sm)",
																border: "1px solid var(--color-border)",
																padding: "var(--spacing-md)",
															}}
														/>
													</div>
												</div>
											</div>
										</div>

										{/* Status & Publication Section */}
										<div
											className="card mb-4"
											style={{
												border: "1px solid var(--color-border)",
												borderRadius: "var(--border-radius-md)",
											}}
										>
											<div
												className="card-header"
												style={{
													backgroundColor: "var(--color-card-background)",
													borderBottom: "1px solid var(--color-border)",
													padding: "var(--spacing-lg)",
												}}
											>
												<h6
													className="mb-0 d-flex align-items-center"
													style={{
														color: "var(--color-primary-dark)",
														fontWeight: "600",
													}}
												>
													<CheckCircle size={18} className="me-2" />
													{t('assessments.statusAndPublication')}
												</h6>
											</div>
											<div
												className="card-body"
												style={{ padding: "var(--spacing-lg)" }}
											>
												<div className="row g-3">
													<div className="col-12">
														<div
															className="form-check"
															style={{
																padding: "var(--spacing-md)",
																backgroundColor: "var(--color-secondary)",
																borderRadius: "var(--border-radius-sm)",
																border: "1px solid var(--color-border-light)",
															}}
														>
															<input
																className="form-check-input"
																type="checkbox"
																id="is_published"
																checked={assessmentForm.is_published}
																onChange={(e) =>
																	setAssessmentForm({
																		...assessmentForm,
																		is_published: e.target.checked,
																	})
																}
																disabled={assessmentUpdateLoading}
																style={{ marginTop: "0.25rem" }}
															/>
															<label
																className="form-check-label fw-semibold"
																htmlFor="is_published"
																style={{ color: "var(--color-primary-dark)" }}
															>
																<span className="d-block">
																	{t('assessments.publishAssessment')}
																</span>
																<small className="text-muted">
																	{t('assessments.makeVisibleToStudents')}
																</small>
															</label>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Timing Settings Section */}
										<div
											className="card mb-4"
											style={{
												border: "1px solid var(--color-border)",
												borderRadius: "var(--border-radius-md)",
											}}
										>
											<div
												className="card-header"
												style={{
													backgroundColor: "var(--color-card-background)",
													borderBottom: "1px solid var(--color-border)",
													padding: "var(--spacing-lg)",
												}}
											>
												<h6
													className="mb-0 d-flex align-items-center"
													style={{
														color: "var(--color-primary-dark)",
														fontWeight: "600",
													}}
												>
													<Timer size={18} className="me-2" />
													{t('assessments.timingSettings')}
												</h6>
											</div>
											<div
												className="card-body"
												style={{ padding: "var(--spacing-lg)" }}
											>
												<div className="row g-3">
													<div className="col-12">
														<div
															className="form-check"
															style={{
																padding: "var(--spacing-md)",
																backgroundColor: "var(--color-secondary)",
																borderRadius: "var(--border-radius-sm)",
																border: "1px solid var(--color-border-light)",
															}}
														>
															<input
																className="form-check-input"
																type="checkbox"
																id="is_timed"
																checked={assessmentForm.is_timed}
																onChange={(e) =>
																	setAssessmentForm({
																		...assessmentForm,
																		is_timed: e.target.checked,
																	})
																}
																disabled={assessmentUpdateLoading}
																style={{ marginTop: "0.25rem" }}
															/>
															<label
																className="form-check-label fw-semibold"
																htmlFor="is_timed"
																style={{ color: "var(--color-primary-dark)" }}
															>
																<span className="d-block">
																	{t('assessments.timeLimitedAssessment')}
																</span>
																<small className="text-muted">
																	{t('assessments.setTimeLimit')}
																</small>
															</label>
														</div>
													</div>

													{assessmentForm.is_timed && (
														<div className="col-md-6">
															<label
																className="form-label fw-semibold"
																style={{ color: "var(--color-primary-dark)" }}
															>
																{t('assessments.timeLimitMinutes')}
															</label>
															<input
																type="number"
																className="form-control"
																min="1"
																value={assessmentForm.time_limit || ""}
																onChange={(e) =>
																	setAssessmentForm({
																		...assessmentForm,
																		time_limit: e.target.value,
																	})
																}
																disabled={assessmentUpdateLoading}
																placeholder={t('assessments.enterTimeLimit')}
																style={{
																	borderRadius: "var(--border-radius-sm)",
																	border: "1px solid var(--color-border)",
																	padding:
																		"var(--spacing-sm) var(--spacing-md)",
																}}
															/>
														</div>
													)}
												</div>
											</div>
										</div>

										{/* Attempts & Scoring Section */}
										<div
											className="card mb-4"
											style={{
												border: "1px solid var(--color-border)",
												borderRadius: "var(--border-radius-md)",
											}}
										>
											<div
												className="card-header"
												style={{
													backgroundColor: "var(--color-card-background)",
													borderBottom: "1px solid var(--color-border)",
													padding: "var(--spacing-lg)",
												}}
											>
												<h6
													className="mb-0 d-flex align-items-center"
													style={{
														color: "var(--color-primary-dark)",
														fontWeight: "600",
													}}
												>
													<Target size={18} className="me-2" />
													{t('assessments.attemptsAndScoring')}
												</h6>
											</div>
											<div
												className="card-body"
												style={{ padding: "var(--spacing-lg)" }}
											>
												<div className="row g-3">
													<div className="col-md-6">
														<label
															className="form-label fw-semibold"
															style={{ color: "var(--color-primary-dark)" }}
														>
															{t('assessments.maximumAttempts')}
														</label>
														<input
															type="number"
															className="form-control"
															min="1"
															value={assessmentForm.max_attempts}
															onChange={(e) =>
																setAssessmentForm({
																	...assessmentForm,
																	max_attempts: e.target.value,
																})
															}
															disabled={assessmentUpdateLoading}
															placeholder={t('assessments.numberOfAttemptsAllowed')}
															style={{
																borderRadius: "var(--border-radius-sm)",
																border: "1px solid var(--color-border)",
																padding: "var(--spacing-sm) var(--spacing-md)",
															}}
														/>
														<small className="text-muted">
															{t('assessments.howManyTimesStudents')}
														</small>
													</div>

													<div className="col-md-6">
														<label
															className="form-label fw-semibold"
															style={{ color: "var(--color-primary-dark)" }}
														>
															{t('assessments.passingScorePercent')}
														</label>
														<input
															type="number"
															className="form-control"
															min="0"
															max="100"
															step="0.01"
															value={assessmentForm.passing_score}
															onChange={(e) =>
																setAssessmentForm({
																	...assessmentForm,
																	passing_score: e.target.value,
																})
															}
															disabled={assessmentUpdateLoading}
															placeholder={t('assessments.minimumScoreToPass')}
															style={{
																borderRadius: "var(--border-radius-sm)",
																border: "var(--border-radius-sm)",
																border: "1px solid var(--color-border)",
																padding: "var(--spacing-sm) var(--spacing-md)",
															}}
														/>
														<small className="text-muted">
															{t('assessments.minimumPercentageRequired')}
														</small>
													</div>
												</div>
											</div>
										</div>

										{/* Availability Section */}
										<div
											className="card mb-4"
											style={{
												border: "1px solid var(--color-border)",
												borderRadius: "var(--border-radius-md)",
											}}
										>
											<div
												className="card-header"
												style={{
													backgroundColor: "var(--color-card-background)",
													borderBottom: "1px solid var(--color-border)",
													padding: "var(--spacing-lg)",
												}}
											>
												<h6
													className="mb-0 d-flex align-items-center"
													style={{
														color: "var(--color-primary-dark)",
														fontWeight: "600",
													}}
												>
													<Calendar size={18} className="me-2" />
													{t('assessments.availabilitySchedule')}
												</h6>
											</div>
											<div
												className="card-body"
												style={{ padding: "var(--spacing-lg)" }}
											>
												<div className="row g-3">
													<div className="col-md-6">
														<label
															className="form-label fw-semibold"
															style={{ color: "var(--color-primary-dark)" }}
														>
															{t('assessments.availableFrom')}
														</label>
														<div className="input-group">
															<input
																type="datetime-local"
																className="form-control"
																value={assessmentForm.available_from}
																onChange={handleAvailableFromChange}
																disabled={assessmentUpdateLoading}
																title={t('assessments.whenStudentsCanStart')}
																style={{
																	borderRadius:
																		"var(--border-radius-sm) 0 0 var(--border-radius-sm)",
																	border: "1px solid var(--color-border)",
																	padding:
																		"var(--spacing-sm) var(--spacing-md)",
																}}
															/>
															<button
																type="button"
																className="btn btn-outline-secondary btn-sm"
																onClick={() =>
																	setCurrentDateTime("available_from")
																}
																disabled={assessmentUpdateLoading}
																title={t('assessments.setToCurrentDateTime')}
																style={{ borderColor: "var(--color-border)" }}
															>
																{t('assessments.now')}
															</button>
															<button
																type="button"
																className="btn btn-outline-secondary btn-sm"
																onClick={() => clearDateTime("available_from")}
																disabled={assessmentUpdateLoading}
																title={t('assessments.clearDate')}
																style={{
																	borderColor: "var(--color-border)",
																	borderRadius:
																		"0 var(--border-radius-sm) var(--border-radius-sm) 0",
																}}
															>
																{t('assessments.clear')}
															</button>
														</div>
														<div className="form-text">
															<small className="text-muted">
																<Calendar size={12} className="me-1" />
																{t('assessments.whenStudentsCanStart')}
															</small>
														</div>
													</div>

													<div className="col-md-6">
														<label
															className="form-label fw-semibold"
															style={{ color: "var(--color-primary-dark)" }}
														>
															{t('assessments.availableUntil')}
														</label>
														<div className="input-group">
															<input
																type="datetime-local"
																className="form-control"
																value={assessmentForm.available_until}
																onChange={handleAvailableUntilChange}
																disabled={assessmentUpdateLoading}
																title={t('assessments.whenStudentsCannotTake')}
																style={{
																	borderRadius:
																		"var(--border-radius-sm) 0 0 var(--border-radius-sm)",
																	border: "1px solid var(--color-border)",
																	padding:
																		"var(--spacing-sm) var(--spacing-md)",
																}}
															/>
															<button
																type="button"
																className="btn btn-outline-secondary btn-sm"
																onClick={() =>
																	setCurrentDateTime("available_until")
																}
																disabled={assessmentUpdateLoading}
																title={t('assessments.setTo1WeekFromNow')}
																style={{ borderColor: "var(--color-border)" }}
															>
																+1 Week
															</button>
															<button
																type="button"
																className="btn btn-outline-secondary btn-sm"
																onClick={() => clearDateTime("available_until")}
																disabled={assessmentUpdateLoading}
																title={t('assessments.clearDate')}
																style={{
																	borderColor: "var(--color-border)",
																	borderRadius:
																		"0 var(--border-radius-sm) var(--border-radius-sm) 0",
																}}
															>
																{t('assessments.clear')}
															</button>
														</div>
														<div className="form-text">
															<small className="text-muted">
																<Calendar size={12} className="me-1" />
																{t('assessments.whenStudentsCannotTake')}
															</small>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									className="modal-footer"
									style={{
										backgroundColor: "var(--color-card-background)",
										borderTop: "1px solid var(--color-border)",
										padding: "var(--spacing-lg) var(--spacing-xl)",
										borderRadius:
											"0 0 var(--border-radius-lg) var(--border-radius-lg)",
									}}
								>
									<div className="d-flex justify-content-between align-items-center w-100">
										<div className="text-muted">
											<small>
												<Info size={14} className="me-1" />
												{t('assessments.changesAppliedImmediately')}
											</small>
										</div>
										<div className="d-flex gap-2">
											<button
												type="button"
												className="btn btn-outline-secondary"
												onClick={() => setShowUpdateAssessment(false)}
												disabled={assessmentUpdateLoading}
												style={{
													borderColor: "var(--color-border)",
													color: "var(--color-text-muted)",
													borderRadius: "var(--border-radius-sm)",
													padding: "var(--spacing-sm) var(--spacing-lg)",
												}}
											>
												{t('assessments.cancel')}
											</button>
											<button
												type="submit"
												className="btn-secondary-action"
												disabled={assessmentUpdateLoading}
												style={{
													borderRadius: "var(--border-radius-sm)",
													padding: "var(--spacing-sm) var(--spacing-lg)",
												}}
											>
												{assessmentUpdateLoading ? (
													<>
														<span
															className="spinner-border spinner-border-sm me-2"
															role="status"
															aria-hidden="true"
														></span>
														{t('assessments.updatingAssessment')}
													</>
												) : (
													<>
														<Edit size={16} className="me-2" />
														{t('assessments.updateAssessment')}
													</>
												)}
											</button>
										</div>
									</div>
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
				}}
				onSubmit={
					selectedQuestion ? handleUpdateQuestion : handleCreateQuestion
				}
				questionForm={questionForm}
				setQuestionForm={setQuestionForm}
				selectedQuestion={selectedQuestion}
				isLoading={questionLoading}
			/>
		</div>
	);
}

