# Assessment API Usage Guide - For the Frontend Team

## Understanding the Overall System

### System Structure
The system is built on 3 educational levels:
- **Course** (Complete course)
- **Module** (Unit within a course)
- **Lesson** (Lesson within a unit)

### Assessment Types
```javascript
const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',           // Lesson exam (Lesson)
  ASSIGNMENT: 'assignment', // Module assignment (Module)
  COURSE_EXAM: 'course_exam' // Final course exam (Course)
}
```

### Question Types
```javascript
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',  // Multiple choice
  TRUE_FALSE: 'true_false',           // True/False
  SHORT_ANSWER: 'short_answer',       // Short answer
  ESSAY: 'essay',                     // Essay
  FILL_BLANK: 'fill_blank'           // Fill in the blanks
}
```

---

## Teacher APIs

### 1. Assessment Management

#### View List of Assessments
```http
GET /api/assessments/teacher/
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Quiz Lesson 1",
    "assessment_type": "quiz",
    "related_to": "Lesson: Introduction to Python",
    "is_published": true,
    "is_timed": true,
    "time_limit": 30,
    "max_attempts": 3,
    "total_questions": 10,
    "total_marks": "25.00",
    "available_from": "2024-08-01T10:00:00Z",
    "available_until": "2024-08-31T23:59:59Z",
    "is_available": true,
    "created_at": "2024-07-20T14:30:00Z"
  }
]
```

#### Create a New Assessment
```http
POST /api/assessments/teacher/
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Python Basics Quiz",
  "description": "Test your understanding of Python fundamentals",
  "assessment_type": "quiz",
  "lesson": "lesson-uuid",  // For Quiz
  // OR
  "module": "module-uuid",  // For Assignment
  // OR
  "course": "course-uuid",  // For Course Exam

  "is_published": false,
  "is_timed": true,
  "time_limit": 45,
  "max_attempts": 2,
  "passing_score": 70.00,
  "available_from": "2024-08-01T10:00:00Z",
  "available_until": "2024-08-31T23:59:59Z"
}
```

#### View a Specific Assessment
```http
GET /api/assessments/teacher/<assessment_id>/
Authorization: Bearer <token>
```

#### Update an Assessment
```http
PUT /api/assessments/teacher/<assessment_id>/
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Only fields to be updated need to be sent):**
```json
{
  "title": "Updated Quiz Title",
  "is_published": true,
  "time_limit": 60
}
```

#### Delete an Assessment
```http
DELETE /api/assessments/teacher/<assessment_id>/
Authorization: Bearer <token>
```

### 2. Question Management

#### View Questions for a Specific Assessment
```http
GET /api/assessments/teacher/<assessment_id>/questions/
Authorization: Bearer <token>
```

#### Add a New Question
```http
POST /api/assessments/teacher/<assessment_id>/questions/
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```javascript
const formData = new FormData();
formData.append('assessment', 'assessment-uuid');
formData.append('question_text', 'What is the capital of Egypt?');
formData.append('question_type', 'multiple_choice');
formData.append('mark', '2.00');
formData.append('order', '1');
formData.append('explanation', 'Cairo is the capital and largest city of Egypt');
formData.append('image', imageFile); // Optional
```

#### View/Update/Delete a Question
```http
GET /api/assessments/teacher/questions/<question_id>/
PUT /api/assessments/teacher/questions/<question_id>/
DELETE /api/assessments/teacher/questions/<question_id>/
Authorization: Bearer <token>
```

### 3. Managing Question Options (For Multiple Choice and True/False)

#### View Question Options
```http
GET /api/assessments/teacher/questions/<question_id>/options/
Authorization: Bearer <token>
```

#### Add a New Option
```http
POST /api/assessments/teacher/questions/<question_id>/options/
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "question-uuid",
  "option_text": "Cairo",
  "is_correct": true,
  "order": 1
}
```

#### Update/Delete an Option
```http
PUT /api/assessments/teacher/options/<option_id>/
DELETE /api/assessments/teacher/options/<option_id>/
Authorization: Bearer <token>
```

### 4. Manual Answer Grading

#### View Answers Pending Grading
```http
GET /api/assessments/teacher/pending-grading/
Authorization: Bearer <token>

# Filter by assessment
GET /api/assessments/teacher/pending-grading/?assessment_id=<uuid>

# Filter by assessment type
GET /api/assessments/teacher/pending-grading/?assessment_type=quiz

# Filter by question type
GET /api/assessments/teacher/pending-grading/?question_type=essay
```

**Response:**
```json
[
  {
    "id": "answer-uuid",
    "student_name": "Ahmed Mohamed",
    "question_text": "Explain the concept of OOP",
    "question_mark": "5.00",
    "question_type": "essay",
    "text_answer": "Object-oriented programming is...",
    "marks_awarded": "0.00",
    "teacher_feedback": null,
    "is_correct": false,
    "attempt_id": "attempt-uuid",
    "assessment_title": "Python Advanced Quiz"
  }
]
```

#### Grade an Answer
```http
PUT /api/assessments/teacher/grade/<answer_id>/
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "marks_awarded": 4.5,
  "teacher_feedback": "Good explanation but missing some details",
  "is_correct": false
}
```

---

## Student APIs

### 1. View Available Assessments

```http
GET /api/assessments/student/<teacher_username>/
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "assessment-uuid",
    "title": "Python Basics Quiz",
    "assessment_type": "quiz",
    "related_to": "Lesson: Variables and Data Types",
    "is_published": true,
    "is_timed": true,
    "time_limit": 30,
    "max_attempts": 3,
    "total_questions": 15,
    "total_marks": "30.00",
    "available_from": "2024-08-01T10:00:00Z",
    "available_until": "2024-08-31T23:59:59Z",
    "is_available": true,
    "created_at": "2024-07-20T14:30:00Z"
  }
]
```

### 2. Start an Assessment

```http
POST /api/assessments/student/<teacher_username>/start/<assessment_id>/
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "assessment_id": "assessment-uuid"
}
```

**Response:**
```json
{
  "attempt_id": "attempt-uuid",
  "message": "Assessment started successfully",
  "assessment": {
    "id": "assessment-uuid",
    "title": "Python Basics Quiz",
    "description": "Test your Python knowledge",
    "questions": [
      {
        "id": "question-uuid",
        "question_text": "What is a variable in Python?",
        "question_type": "multiple_choice",
        "mark": "2.00",
        "order": 1,
        "options": [
          {
            "id": "option-uuid-1",
            "option_text": "A container for data",
            "order": 1
          },
          {
            "id": "option-uuid-2",
            "option_text": "A function",
            "order": 2
          }
        ]
      }
    ]
  },
  "time_limit": 30,
  "total_questions": 15,
  "available_from": "2024-08-01T10:00:00Z",
  "available_until": "2024-08-31T23:59:59Z"
}
```

### 3. Submit an Assessment

```http
PUT /api/assessments/student/submit/<attempt_id>/
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": "question-uuid-1",
      "selected_option": "option-uuid-1"  // For multiple choice
    },
    {
      "question_id": "question-uuid-2",
      "text_answer": "Python is a programming language..." // For text questions
    },
    {
      "question_id": "question-uuid-3",
      "selected_option": "option-uuid-3"  // True/False
    }
  ]
}
```

**Response:**
```json
{
  "message": "Assessment submitted successfully",
  "attempt_id": "attempt-uuid"
}
```

### 4. View Attempt Results

#### List of All Attempts
```http
GET /api/assessments/student/<teacher_username>/attempts/
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "attempt-uuid",
    "assessment_title": "Python Basics Quiz",
    "assessment_type": "quiz",
    "related_to": "Lesson: Variables",
    "attempt_number": 1,
    "status": "graded",
    "started_at": "2024-08-15T10:00:00Z",
    "ended_at": "2024-08-15T10:25:00Z",
    "time_taken": 1500, // In seconds
    "score": "24.00",
    "percentage": "80.00",
    "is_passed": true
  }
]
```

#### Details of a Specific Attempt
```http
GET /api/assessments/student/attempts/<attempt_id>/
Authorization: Bearer <token>
```

**Response (If graded):**
```json
{
  "id": "attempt-uuid",
  "assessment_title": "Python Basics Quiz",
  "attempt_number": 1,
  "started_at": "2024-08-15T10:00:00Z",
  "status": "graded",
  "ended_at": "2024-08-15T10:25:00Z",
  "time_taken": 1500,
  "score": "24.00",
  "percentage": "80.00",
  "is_passed": true,
  "teacher_feedback": "Well done! Keep practicing",
  "answers": [
    {
      "id": "answer-uuid",
      "question": "What is a variable in Python?",
      "selected_option_text": "A container for data",
      "text_answer": null,
      "marks_awarded": "2.00",
      "is_correct": true,
      "teacher_feedback": null,
      "auto_graded": true
    }
  ]
}
```

**Response (Not graded yet):**
```json
{
  "message": "Please wait until all questions are graded."
}
```

---

## Error Handling

### Authentication Errors
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Permission Errors
```json
{
  "detail": "You don't have access to this assessment or it is not available."
}
```

### Data Validation Errors
```json
{
  "title": ["Title cannot be empty."],
  "passing_score": ["Passing score must be between 0 and 100."]
}
```

### Assessment Errors
```json
{
  "detail": "You have reached the maximum number of attempts (3)."
}
```

---

## Common Use Cases

### 1. Creating a Quick Quiz
```javascript
// 1. Create the assessment
const assessment = await createAssessment({
  title: "Quick Python Quiz",
  assessment_type: "quiz",
  lesson: "lesson-uuid",
  is_timed: true,
  time_limit: 15,
  max_attempts: 1
});

// 2. Add a multiple-choice question
const question = await createQuestion({
  assessment: assessment.id,
  question_text: "What is Python?",
  question_type: "multiple_choice",
  mark: 1
});

// 3. Add options
await createOption({
  question: question.id,
  option_text: "Programming Language",
  is_correct: true,
  order: 1
});

await createOption({
  question: question.id,
  option_text: "Database",
  is_correct: false,
  order: 2
});

// 4. Publish the assessment
await updateAssessment(assessment.id, {
  is_published: true
});
```

### 2. Taking an Assessment (Student)
```javascript
// 1. Get available assessments
const assessments = await getAvailableAssessments(teacherUsername);

// 2. Start the assessment
const attempt = await startAssessment(teacherUsername, assessmentId);

// 3. Show timer if time-limited
if (attempt.assessment.is_timed) {
  startTimer(attempt.assessment.time_limit * 60); // In seconds
}

// 4. Collect answers and submit
const answers = collectAnswersFromForm();
await submitAssessment(attempt.attempt_id, { answers });

// 5. Show result (if available)
const result = await getAttemptDetails(attempt.attempt_id);
```

### 3. Teacher Grading
```javascript
// 1. Get answers pending grading
const pendingAnswers = await getPendingGrading();

// 2. Grade an answer
await gradeAnswer(answerId, {
  marks_awarded: 4.5,
  teacher_feedback: "Good work!",
  is_correct: true
});
```

---

## Important Implementation Tips

### 1. Time Management
```javascript
// Track remaining time
function startAssessmentTimer(timeLimit, onExpire) {
  const startTime = Date.now();
  const endTime = startTime + (timeLimit * 60 * 1000);

  const timer = setInterval(() => {
    const remaining = endTime - Date.now();

    if (remaining <= 0) {
      clearInterval(timer);
      onExpire(); // Auto-submit
    } else {
      updateTimerDisplay(remaining);
    }
  }, 1000);
}
```

### 2. Local Answer Saving
```javascript
// Save to LocalStorage periodically
function saveAnswersLocally(attemptId, answers) {
  localStorage.setItem(`assessment_${attemptId}`, JSON.stringify({
    answers,
    lastSaved: Date.now()
  }));
}

// Restore when returning
function loadSavedAnswers(attemptId) {
  const saved = localStorage.getItem(`assessment_${attemptId}`);
  return saved ? JSON.parse(saved) : null;
}
```

### 3. Connection Checking
```javascript
// Send heartbeat to verify connection
function monitorConnection(attemptId) {
  setInterval(async () => {
    try {
      await fetch('/api/ping/');
    } catch (error) {
      showOfflineWarning();
      // Save answers locally
      saveAnswersLocally(attemptId, getCurrentAnswers());
    }
  }, 30000); // Every 30 seconds
}
```

### 4. Handling Different States
```javascript
// Check attempt status
function checkAttemptStatus(attempt) {
  switch (attempt.status) {
    case 'in_progress':
      return 'Can continue';
    case 'submitted':
      return 'Submitted - Awaiting grading';
    case 'graded':
      return 'Graded - Results available';
    case 'expired':
      return 'Time limit expired';
  }
}
```

---

## Summary

This system provides full flexibility for creating different types of assessments with both auto-grading and manual grading capabilities. Make sure to:

1. **Check permissions** before each operation
2. **Manage time** carefully in time-limited tests
3. **Save data** locally as a backup
4. **Handle errors** appropriately
5. **Clearly display progress and status** to the user