# EduPro Backend API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Course Management](#course-management)
4. [Assessment System](#assessment-system)
5. [Rating System](#rating-system)
6. [Enrollment System](#enrollment-system)

## Base URL
```
http://localhost:8000/api/
```

## Authentication

### JWT Token Authentication
Most endpoints require JWT authentication. Include the token in the http only cookie

---

## 1. User Management

### 1.1 Teacher Registration
**POST** `/teacher/teacher-register/`

**Request Body:**
```json
{
    "first_name": "string",
    "last_name": "string",
    "username": "string (min 5 chars)",
    "email": "string (unique)",
    "phone": "string (digits only, unique)",
    "password1": "string (valid password)",
    "password2": "string (must match password1)",
    "avatar": "file (optional)",
    "logo": "file (optional)"
}
```

**Response (201):**
```json
{
    "message": "User created successfully",
    "user": {
        "id": "uuid",
        "email": "string",
        "phone": "string",
        "username": "string",
        "user_type": "teacher",
        "slug": "string",
        "avatar": "url or null",
        "logo": "url or null"
    }
}
```

### 1.2 Student Registration
**POST** `/student/student-register/<teacher_username>/`

**Request Body:**
```json
{
    "first_name": "string",
    "last_name": "string",
    "email": "string (unique)",
    "username": "string (min 5 chars)",
    "phone": "string (digits only, unique)",
    "parent_phone": "string (required)",
    "password1": "string (valid password)",
    "password2": "string (must match password1)",
    "avatar": "file (optional)"
}
```

**Response (201):**
```json
{
    "message": "Student created successfully",
    "user": {
        "id": "uuid",
        "email": "string",
        "phone": "string",
        "parent_phone": "string",
        "username": "string",
        "user_type": "student",
        "slug": "string",
        "avatar": "url or null"
    }
}
```

### 1.3 Teacher Login
**POST** `/teacher/login/`

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response (200):**
```json
{
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token",
    "user": {
        "id": "uuid",
        "username": "string",
        "email": "string",
        "user_type": "teacher"
    }
}
```

### 1.4 Student Login
**POST** `/student/login/<teacher_username>/`

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response (200):**
```json
{
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token",
    "user": {
        "id": "uuid",
        "username": "string",
        "email": "string",
        "user_type": "student"
    }
}
```

### 1.5 Token Refresh
**POST** `/token/refresh/`

**Request Body:**
```json
{
    "refresh": "jwt_refresh_token"
}
```

**Response (200):**
```json
{
    "access": "new_jwt_access_token"
}
```

### 1.6 Student Token Refresh
**POST** `/student/refresh/<teacher_username>/`

**Request Body:**
```json
{
    "refresh": "jwt_refresh_token"
}
```

**Response (200):**
```json
{
    "access": "new_jwt_access_token"
}
```

### 1.7 Logout
**POST** `/logout/`

**Authentication:** Required

**Response (200):**
```json
{
    "message": "Successfully logged out"
}
```

### 1.8 Change Password
**POST** `/change-password/`

**Authentication:** Required

**Request Body:**
```json
{
    "old_password": "string",
    "new_password1": "string (valid password)",
    "new_password2": "string (must match new_password1)"
}
```

**Response (200):**
```json
{
    "message": "Password changed successfully"
}
```

### 1.9 Password Reset Request
**POST** `/password-reset/request/`

**Request Body:**
```json
{
    "email": "string"
}
```

**Response (200):**
```json
{
    "message": "OTP sent to your email"
}
```

### 1.10 Password Reset Verify OTP
**POST** `/password-reset/verify/`

**Request Body:**
```json
{
    "email": "string",
    "otp": "string"
}
```

**Response (200):**
```json
{
    "message": "OTP verified successfully"
}
```

### 1.11 Password Reset Confirm
**POST** `/password-reset/confirm/`

**Request Body:**
```json
{
    "email": "string",
    "otp": "string",
    "new_password1": "string (valid password)",
    "new_password2": "string (must match new_password1)"
}
```

**Response (200):**
```json
{
    "message": "Password reset successfully"
}
```

### 1.12 Get Teacher Profile
**GET** `/teacher/teacher-profile/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
{
    "id": "uuid",
    "username": "string",
    "email": "string",
    "phone": "string",
    "first_name": "string",
    "last_name": "string",
    "avatar": "url or null",
    "logo": "url or null",
    "bio": "string or null",
    "specialization": "string or null",
    "experience_years": "integer or null"
}
```

### 1.13 Get Public Teacher Profile
**GET** `/teacher/teacher-profile/<teacher_username>/`

**Response (200):**
```json
{
    "id": "uuid",
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "avatar": "url or null",
    "logo": "url or null",
    "bio": "string or null",
    "specialization": "string or null",
    "experience_years": "integer or null"
}
```

### 1.14 Update Teacher Profile
**PUT/PATCH** `/teacher/update-profile/`

**Authentication:** Required (Teacher)

**Request Body:**
```json
{
    "first_name": "string (optional)",
    "last_name": "string (optional)",
    "bio": "string (optional)",
    "specialization": "string (optional)",
    "experience_years": "integer (optional)",
    "avatar": "file (optional)",
    "logo": "file (optional)"
}
```

**Response (200):**
```json
{
    "message": "Profile updated successfully"
}
```

### 1.15 Get Student Profile
**GET** `/student/student-profile/<teacher_username>/`

**Authentication:** Required (Student)

**Response (200):**
```json
{
    "id": "uuid",
    "username": "string",
    "email": "string",
    "phone": "string",
    "parent_phone": "string",
    "first_name": "string",
    "last_name": "string",
    "avatar": "url or null",
    "grade_level": "string or null",
    "school_name": "string or null"
}
```

### 1.16 Update Student Profile
**PUT/PATCH** `/student/update-profile/`

**Authentication:** Required (Student)

**Request Body:**
```json
{
    "first_name": "string (optional)",
    "last_name": "string (optional)",
    "grade_level": "string (optional)",
    "school_name": "string (optional)",
    "avatar": "file (optional)"
}
```

**Response (200):**
```json
{
    "message": "Profile updated successfully"
}
```

### 1.17 Join Teacher (Authenticated Student)
**POST** `/join-teacher/<teacher_username>/`

**Authentication:** Required (Student)

**Response (201):**
```json
{
    "message": "Successfully joined teacher"
}
```

### 1.18 Get Students Related to Teacher
**GET** `/teacher/get_students/`

**Authentication:** Required (Teacher)

**Description:** This endpoint allows authenticated teachers to retrieve a paginated list of all students associated with their account. The endpoint provides comprehensive student information including profile details, enrollment status, and academic progress.

**Request Headers:**
```
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `is_active` (optional): Filter students by active status (true/false)
- `search` (optional): Search students by username, email, or full name
- `ordering` (optional): Sort results by specific fields

**Available Ordering Options:**
- `enrollment_date` - Sort by enrollment date (ascending)
- `-enrollment_date` - Sort by enrollment date (descending)
- `student__full_name` - Sort by student full name (ascending)
- `-student__full_name` - Sort by student full name (descending)

**Response (200):**
```json
{
    "count": 15,
    "next": "http://localhost:8000/api/teacher/get_students/?page=2",
    "previous": null,
    "results": [
        {
            "id": "uuid",
            "student": {
                "id": "uuid",
                "user": {
                    "id": "uuid",
                    "first_name": "string",
                    "last_name": "string",
                    "email": "string",
                    "username": "string",
                    "phone": "string",
                    "avatar": "url or null",
                    "user_type": "student",
                    "is_active": true,
                    "created_at": "datetime",
                    "last_login": "datetime"
                },
                "full_name": "string",
                "bio": "string or null",
                "profile_picture": "url or null",
                "date_of_birth": "date or null",
                "address": "string or null",
                "country": "string or null",
                "city": "string or null",
                "gender": "string or null"
            },
            "enrollment_date": "date",
            "notes": "string or null",
            "is_active": true,
            "completed_lessons": 0,
            "last_activity": "datetime",
            "number_of_completed_courses": 0
        }
    ]
}
```

**Response Fields Explanation:**
- `count`: Total number of students associated with the teacher
- `next`: URL for the next page (null if no next page)
- `previous`: URL for the previous page (null if no previous page)
- `results`: Array of student objects

**Student Object Fields:**
- `id`: Unique identifier for the teacher-student relationship
- `student`: Complete student profile information
  - `user`: Basic user account details
  - `full_name`: Student's full name
  - `bio`: Student's biography (optional)
  - `profile_picture`: Student's profile picture URL (optional)
  - `date_of_birth`: Student's date of birth (optional)
  - `address`, `country`, `city`: Location information (optional)
  - `gender`: Student's gender (optional)
- `enrollment_date`: Date when student joined the teacher
- `notes`: Teacher's notes about the student (optional)
- `is_active`: Whether the student is currently active/blocked
- `completed_lessons`: Number of lessons completed by the student
- `last_activity`: Timestamp of student's last activity
- `number_of_completed_courses`: Number of courses completed by the student

**Usage Examples:**

1. **Get all students (first page):**
   ```
   GET /api/teacher/get_students/
   ```

2. **Get page 2 of students:**
   ```
   GET /api/teacher/get_students/?page=2
   ```

3. **Get only active students:**
   ```
   GET /api/teacher/get_students/?is_active=true
   ```

4. **Search for students with "john" in their name, email, or username:**
   ```
   GET /api/teacher/get_students/?search=john
   ```

5. **Order students by enrollment date (ascending):**
   ```
   GET /api/teacher/get_students/?ordering=enrollment_date
   ```

6. **Order students by full name (descending):**
   ```
   GET /api/teacher/get_students/?ordering=-student__full_name
   ```

7. **Combined example (active students, page 1, ordered by name):**
   ```
   GET /api/teacher/get_students/?is_active=true&page=1&ordering=student__full_name
   ```

**Error Responses:**

**401 Unauthorized:**
```json
{
    "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden:**
```json
{
    "detail": "You do not have permission to perform this action."
}
```

**500 Internal Server Error:**
```json
{
    "error": "Internal server error",
    "detail": "An unexpected error occurred while retrieving students."
}
```

**Notes:**
- The endpoint uses pagination with a default page size of 5 students per page
- Students are ordered by full name by default
- The `is_active` field indicates whether a student is blocked or active
- Search functionality works across username, email, and full name fields
- All datetime fields are returned in ISO 8601 format
- File fields (avatar, profile_picture) return full URLs when available

### 1.19 Get Student Profile by ID
**GET** `/teacher/get-student-profile/<student_id>/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
{
    "id": "uuid",
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "parent_phone": "string",
    "avatar": "url or null",
    "grade_level": "string or null",
    "school_name": "string or null",
    "is_blocked": "boolean"
}
```

### 1.20 Remove Student
**DELETE** `/teacher/students/remove/<student_id>/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
{
    "message": "Student removed successfully"
}
```

### 1.21 Toggle Block Student
**POST** `/teacher/students/toggle-block/<student_id>/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
{
    "message": "Student blocked/unblocked successfully"
}
```

---

## 2. Course Management

### 2.1 Create Course Category
**POST** `/course/category/create/`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
    "name": "string",
    "description": "string (optional)"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "name": "string",
    "description": "string or null"
}
```

### 2.2 List Course Categories
**GET** `/course/category/list/`

**Response (200):**
```json
[
    {
        "id": "uuid",
        "name": "string",
        "description": "string or null"
    }
]
```

### 2.3 Update Course Category
**PUT/PATCH** `/course/category/update/<category_id>/`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
    "name": "string (optional)",
    "description": "string (optional)"
}
```

**Response (200):**
```json
{
    "id": "uuid",
    "name": "string",
    "description": "string or null"
}
```

### 2.4 Create Course
**POST** `/course/create/`

**Authentication:** Required (Teacher)

**Request Body:**
```json
{
    "title": "string",
    "description": "string",
    "category": "uuid",
    "price": "decimal",
    "thumbnail": "file (optional)",
    "is_published": "boolean (default: false)"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "category": "uuid",
    "price": "decimal",
    "thumbnail": "url or null",
    "is_published": "boolean",
    "teacher": "uuid",
    "created_at": "datetime"
}
```

### 2.5 List All Courses
**GET** `/course/list/`

**Query Parameters:**
- `page`: integer (pagination)

**Response (200):**
```json
{
    "count": "integer",
    "next": "url or null",
    "previous": "url or null",
    "results": [
        {
            "id": "uuid",
            "title": "string",
            "description": "string",
            "category": {
                "id": "uuid",
                "name": "string"
            },
            "price": "decimal",
            "thumbnail": "url or null",
            "teacher": {
                "id": "uuid",
                "username": "string",
                "first_name": "string",
                "last_name": "string"
            },
            "created_at": "datetime",
            "total_revenue": "decimal"
        }
    ]
}
```

### 2.6 List Courses by Teacher
**GET** `/course/teacher-list/<teacher_username>/`

**Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "category": {
            "id": "uuid",
            "name": "string"
        },
        "price": "decimal",
        "thumbnail": "url or null",
        "teacher": {
            "id": "uuid",
            "username": "string",
            "first_name": "string",
            "last_name": "string"
        },
        "created_at": "datetime"
    }
]
```

### 2.7 Get Course Detail
**GET** `/course/course-detail/<course_id>/`

**Response (200):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "category": {
        "id": "uuid",
        "name": "string"
    },
    "price": "decimal",
    "thumbnail": "url or null",
    "teacher": {
        "id": "uuid",
        "username": "string",
        "first_name": "string",
        "last_name": "string"
    },
    "created_at": "datetime",
    "total_revenue": "decimal"
}
```

### 2.8 Update Course
**PUT/PATCH** `/course/update/<course_id>/`

**Authentication:** Required (Course Owner)

**Request Body:**
```json
{
    "title": "string (optional)",
    "description": "string (optional)",
    "category": "uuid (optional)",
    "price": "decimal (optional)",
    "thumbnail": "file (optional)",
    "is_published": "boolean (optional)"
}
```

**Response (200):**
```json
{
    "message": "Course updated successfully"
}
```

### 2.9 Delete Course
**DELETE** `/course/course-delete/<course_id>/`

**Authentication:** Required (Course Owner)

**Response (200):**
```json
{
    "message": "Course deleted successfully"
}
```

### 2.10 Course Search and Filter
**GET** `/course/course-search-filter/`

**Query Parameters:**
- `search`: string (search in title/description)
- `category`: uuid
- `min_price`: decimal
- `max_price`: decimal
- `teacher`: string (username)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "category": {
            "id": "uuid",
            "name": "string"
        },
        "price": "decimal",
        "thumbnail": "url or null",
        "teacher": {
            "id": "uuid",
            "username": "string",
            "first_name": "string",
            "last_name": "string"
        },
        "created_at": "datetime"
    }
]
```

### 2.11 List Courses by Teacher (Specific)
**GET** `/course/list-by-teacher/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "category": {
            "id": "uuid",
            "name": "string"
        },
        "price": "decimal",
        "thumbnail": "url or null",
        "is_published": "boolean",
        "created_at": "datetime",
        "total_revenue": "decimal"
    }
]
```

### 2.12 Get Course Private Details
**GET** `/course/private-deatils/<course_id>/`

**Authentication:** Required (Course Owner)

**Response (200):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "category": {
        "id": "uuid",
        "name": "string"
    },
    "price": "decimal",
    "thumbnail": "url or null",
    "is_published": "boolean",
    "created_at": "datetime",
    "total_revenue": "decimal",
    "modules_count": "integer",
    "lessons_count": "integer",
    "enrollments_count": "integer"
}
```

---

## 3. Course Modules

### 3.1 List Course Modules
**GET** `/courses/<course_id>/modules/`

**Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "order": "integer",
        "lessons_count": "integer"
    }
]
```

### 3.2 Create Course Module
**POST** `/courses/<course_id>/modules/create/`

**Authentication:** Required (Course Owner)

**Request Body:**
```json
{
    "title": "string",
    "description": "string",
    "order": "integer"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "order": "integer",
    "course": "uuid"
}
```

### 3.3 Get Module Detail
**GET** `/modules/<module_id>/`

**Response (200):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "order": "integer",
    "course": {
        "id": "uuid",
        "title": "string"
    },
    "lessons": [
        {
            "id": "uuid",
            "title": "string",
            "order": "integer"
        }
    ]
}
```

### 3.4 Update Module
**PUT/PATCH** `/modules/<module_id>/update/`

**Authentication:** Required (Module Owner)

**Request Body:**
```json
{
    "title": "string (optional)",
    "description": "string (optional)",
    "order": "integer (optional)"
}
```

**Response (200):**
```json
{
    "message": "Module updated successfully"
}
```

### 3.5 Delete Module
**DELETE** `/modules/<module_id>/delete/`

**Authentication:** Required (Module Owner)

**Response (200):**
```json
{
    "message": "Module deleted successfully"
}
```

---

## 4. Course Lessons

### 4.1 List Module Lessons
**GET** `/modules/<module_id>/lessons/`

**Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "order": "integer",
        "video_id": "string or null",
        "video_processing_status": "string",
        "thumbnail": "url or null"
    }
]
```

### 4.2 Create Lesson
**POST** `/modules/<module_id>/lessons/create/`

**Authentication:** Required (Module Owner)

**Request Body:**
```json
{
    "title": "string",
    "description": "string",
    "order": "integer",
    "video_id": "string (optional)",
    "thumbnail": "file (optional)"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "order": "integer",
    "video_id": "string or null",
    "video_processing_status": "string",
    "thumbnail": "url or null",
    "module": "uuid"
}
```

### 4.3 Get Lesson Detail
**GET** `/lessons/<lesson_id>/`

**Response (200):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "order": "integer",
    "video_id": "string or null",
    "video_processing_status": "string",
    "thumbnail": "url or null",
    "module": {
        "id": "uuid",
        "title": "string",
        "course": {
            "id": "uuid",
            "title": "string"
        }
    }
}
```

### 4.4 Update Lesson
**PUT/PATCH** `/lessons/<lesson_id>/update/`

**Authentication:** Required (Lesson Owner)

**Request Body:**
```json
{
    "title": "string (optional)",
    "description": "string (optional)",
    "order": "integer (optional)",
    "video_id": "string (optional)",
    "thumbnail": "file (optional)"
}
```

**Response (200):**
```json
{
    "message": "Lesson updated successfully"
}
```

### 4.5 Delete Lesson
**DELETE** `/lessons/<lesson_id>/delete/`

**Authentication:** Required (Lesson Owner)

**Response (200):**
```json
{
    "message": "Lesson deleted successfully"
}
```

### 4.6 Update Lesson Progress
**POST** `/lessons/<lesson_id>/status/`

**Authentication:** Required (Enrolled Student)

**Request Body:**
```json
{
    "status": "string (completed, in_progress, not_started)"
}
```

**Response (200):**
```json
{
    "message": "Progress updated successfully"
}
```

### 4.7 Check Video Status
**GET** `/video/check-status/<lesson_id>/`

**Response (200):**
```json
{
    "video_id": "string or null",
    "processing_status": "string",
    "is_ready": "boolean"
}
```

---

## 5. Course Enrollment

### 5.1 Enroll in Course
**POST** `/course/course-enrollment/`

**Authentication:** Required (Student)

**Request Body:**
```json
{
    "course": "uuid"
}
```

**Response (201):**
```json
{
    "message": "Successfully enrolled in course"
}
```

### 5.2 List Course Enrollments
**GET** `/course/course-enrollment-list/<teacher_username>/`

**Response (200):**
```json
[
    {
        "id": "uuid",
        "student": {
            "id": "uuid",
            "username": "string",
            "first_name": "string",
            "last_name": "string"
        },
        "course": {
            "id": "uuid",
            "title": "string"
        },
        "enrolled_at": "datetime"
    }
]
```

### 5.3 Delete Course Enrollment
**DELETE** `/course/course-enrollment-delete/<course_id>/<enrollment_id>/`

**Authentication:** Required (Student or Course Owner)

**Response (200):**
```json
{
    "message": "Enrollment deleted successfully"
}
```

### 5.4 Get Teacher Course Enrollments
**GET** `/teacher/courses/<course_id>/enrollments/`

**Authentication:** Required (Course Owner)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "student": {
            "id": "uuid",
            "username": "string",
            "first_name": "string",
            "last_name": "string",
            "email": "string"
        },
        "enrolled_at": "datetime",
        "progress": "decimal"
    }
]
```

### 5.5 Module Enrollment
**POST** `/course/module-enrollment/`

**Authentication:** Required (Enrolled Student)

**Request Body:**
```json
{
    "module": "uuid"
}
```

**Response (201):**
```json
{
    "message": "Successfully enrolled in module"
}
```

---

## 6. Coupon System

### 6.1 Create Coupon
**POST** `/coupon/create/`

**Authentication:** Required (Teacher)

**Request Body:**
```json
{
    "code": "string",
    "discount_percentage": "integer (1-100)",
    "valid_from": "datetime",
    "valid_until": "datetime",
    "max_uses": "integer (optional)",
    "courses": ["uuid"] (optional)
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "code": "string",
    "discount_percentage": "integer",
    "valid_from": "datetime",
    "valid_until": "datetime",
    "max_uses": "integer or null",
    "courses": ["uuid"] or null
}
```

### 6.2 List Coupons
**GET** `/coupon/list/`

**Response (200):**
```json
[
    {
        "id": "uuid",
        "code": "string",
        "discount_percentage": "integer",
        "valid_from": "datetime",
        "valid_until": "datetime",
        "max_uses": "integer or null",
        "courses": ["uuid"] or null,
        "is_active": "boolean"
    }
]
```

### 6.3 Get Coupon Detail
**GET** `/coupon/detail/<coupon_id>/`

**Response (200):**
```json
{
    "id": "uuid",
    "code": "string",
    "discount_percentage": "integer",
    "valid_from": "datetime",
    "valid_until": "datetime",
    "max_uses": "integer or null",
    "courses": ["uuid"] or null,
    "is_active": "boolean",
    "usage_count": "integer"
}
```

### 6.4 Update Coupon
**PUT/PATCH** `/coupon/update/<coupon_id>/`

**Authentication:** Required (Coupon Owner)

**Request Body:**
```json
{
    "code": "string (optional)",
    "discount_percentage": "integer (optional)",
    "valid_from": "datetime (optional)",
    "valid_until": "datetime (optional)",
    "max_uses": "integer (optional)",
    "courses": ["uuid"] (optional)
}
```

**Response (200):**
```json
{
    "message": "Coupon updated successfully"
}
```

### 6.5 Delete Coupon
**DELETE** `/coupon/delete/<coupon_id>/`

**Authentication:** Required (Coupon Owner)

**Response (200):**
```json
{
    "message": "Coupon deleted successfully"
}
```

### 6.6 List Used Coupons
**GET** `/coupon/used-coupons/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "coupon": {
            "id": "uuid",
            "code": "string",
            "discount_percentage": "integer"
        },
        "student": {
            "id": "uuid",
            "username": "string"
        },
        "used_at": "datetime"
    }
]
```

---

## 7. Rating System

### 7.1 List Course Ratings
**GET** `/courses/<course_id>/list-ratings/`

**Response (200):**
```json
[
    {
        "id": "uuid",
        "rating": "integer (1-5)",
        "comment": "string or null",
        "student": {
            "id": "uuid",
            "username": "string",
            "first_name": "string",
            "last_name": "string"
        },
        "created_at": "datetime"
    }
]
```

### 7.2 Create Course Rating
**POST** `/courses/<course_id>/ratings/create/`

**Authentication:** Required (Enrolled Student)

**Request Body:**
```json
{
    "rating": "integer (1-5)",
    "comment": "string (optional)"
}
```

**Response (201):**
```json
{
    "message": "Rating created successfully"
}
```

### 7.3 Get/Update/Delete Rating
**GET/PUT/PATCH/DELETE** `/course/retrive-upadate-delete-ratings/<id>/`

**Authentication:** Required (Rating Owner)

**Response (200):**
```json
{
    "id": "uuid",
    "rating": "integer (1-5)",
    "comment": "string or null",
    "course": "uuid",
    "student": "uuid",
    "created_at": "datetime"
}
```

---

## 8. Assessment System

### 8.1 Teacher Assessment Management

#### 8.1.1 List/Create Assessments
**GET/POST** `/teacher/assessments/`

**Authentication:** Required (Teacher)

**GET Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "assessment_type": "string",
        "duration_minutes": "integer",
        "passing_score": "integer",
        "is_active": "boolean",
        "course": "uuid or null",
        "module": "uuid or null",
        "lesson": "uuid or null",
        "created_at": "datetime"
    }
]
```

**POST Request Body:**
```json
{
    "title": "string",
    "description": "string",
    "assessment_type": "string (quiz, assignment, exam)",
    "duration_minutes": "integer",
    "passing_score": "integer",
    "is_active": "boolean",
    "course": "uuid (optional)",
    "module": "uuid (optional)",
    "lesson": "uuid (optional)"
}
```

#### 8.1.2 Course-Specific Assessments
**GET/POST** `/teacher/courses/<course_id>/assessments/`

**Authentication:** Required (Course Owner)

**Same structure as above but filtered by course**

#### 8.1.3 Assessment Detail/Update/Delete
**GET/PUT/PATCH/DELETE** `/teacher/assessments/<assessment_id>/`

**Authentication:** Required (Assessment Owner)

**GET Response (200):**
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "assessment_type": "string",
    "duration_minutes": "integer",
    "passing_score": "integer",
    "is_active": "boolean",
    "course": "uuid or null",
    "module": "uuid or null",
    "lesson": "uuid or null",
    "created_at": "datetime",
    "questions_count": "integer"
}
```

### 8.2 Question Management

#### 8.2.1 List/Create Questions
**GET/POST** `/teacher/assessments/<assessment_id>/questions/`

**Authentication:** Required (Question Owner)

**GET Response (200):**
```json
[
    {
        "id": "uuid",
        "text": "string",
        "question_type": "string",
        "points": "integer",
        "order": "integer",
        "is_required": "boolean"
    }
]
```

**POST Request Body:**
```json
{
    "text": "string",
    "question_type": "string (multiple_choice, true_false, short_answer, essay)",
    "points": "integer",
    "order": "integer",
    "is_required": "boolean"
}
```

#### 8.2.2 Question Detail/Update/Delete
**GET/PUT/PATCH/DELETE** `/teacher/assessments/questions/<question_id>/`

**Authentication:** Required (Question Owner)

### 8.3 Question Options Management

#### 8.3.1 List/Create Options
**GET/POST** `/teacher/questions/<question_id>/options/`

**Authentication:** Required (Question Owner)

**GET Response (200):**
```json
[
    {
        "id": "uuid",
        "text": "string",
        "is_correct": "boolean",
        "order": "integer"
    }
]
```

**POST Request Body:**
```json
{
    "text": "string",
    "is_correct": "boolean",
    "order": "integer"
}
```

#### 8.3.2 Option Detail/Update/Delete
**GET/PUT/PATCH/DELETE** `/teacher/questions/options/<option_id>/`

**Authentication:** Required (Option Owner)

### 8.4 Student Assessment Management

#### 8.4.1 List Available Assessments
**GET** `/student/assessments/<teacher_username>/`

**Authentication:** Required (Student)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "assessment_type": "string",
        "duration_minutes": "integer",
        "passing_score": "integer",
        "course": "uuid or null",
        "module": "uuid or null",
        "lesson": "uuid or null"
    }
]
```

#### 8.4.2 Start Assessment
**POST** `/student/assessments/<assessment_id>/<teacher_username>/start/`

**Authentication:** Required (Student)

**Response (201):**
```json
{
    "attempt_id": "uuid",
    "started_at": "datetime",
    "expires_at": "datetime",
    "questions": [
        {
            "id": "uuid",
            "text": "string",
            "question_type": "string",
            "points": "integer",
            "options": [
                {
                    "id": "uuid",
                    "text": "string"
                }
            ]
        }
    ]
}
```

#### 8.4.3 Submit Assessment
**POST** `/students/attempts/<attempt_id>/submit/`

**Authentication:** Required (Student)

**Request Body:**
```json
{
    "answers": [
        {
            "question": "uuid",
            "text_answer": "string (for short_answer/essay)",
            "selected_options": ["uuid"] (for multiple_choice),
            "true_false_answer": "boolean (for true_false)"
        }
    ]
}
```

**Response (200):**
```json
{
    "message": "Assessment submitted successfully",
    "score": "integer",
    "total_points": "integer",
    "passed": "boolean"
}
```

### 8.5 Assessment Results and Grading

#### 8.5.1 List Student Attempts
**GET** `/student/<teacher_username>/attempts/`

**Authentication:** Required (Student)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "assessment": {
            "id": "uuid",
            "title": "string",
            "assessment_type": "string"
        },
        "started_at": "datetime",
        "submitted_at": "datetime",
        "score": "integer",
        "total_points": "integer",
        "passed": "boolean"
    }
]
```

#### 8.5.2 Get Attempt Result
**GET** `/student/attempts/<attempt_id>/result/`

**Authentication:** Required (Student)

**Response (200):**
```json
{
    "id": "uuid",
    "assessment": {
        "id": "uuid",
        "title": "string",
        "assessment_type": "string"
    },
    "started_at": "datetime",
    "submitted_at": "datetime",
    "score": "integer",
    "total_points": "integer",
    "passed": "boolean",
    "answers": [
        {
            "question": {
                "id": "uuid",
                "text": "string",
                "question_type": "string",
                "points": "integer"
            },
            "student_answer": "string or array",
            "correct_answer": "string or array",
            "points_earned": "integer",
            "feedback": "string or null"
        }
    ]
}
```

### 8.6 Teacher Grading

#### 8.6.1 List Pending Grading
**GET** `/teacher/grading/pending/`

**Authentication:** Required (Teacher)

**Query Parameters:**
- `assessment_id`: uuid (optional)
- `assessment_type`: string (optional)
- `question_type`: string (optional)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "question": {
            "id": "uuid",
            "text": "string",
            "question_type": "string",
            "points": "integer"
        },
        "student_answer": "string or array",
        "assessment": {
            "id": "uuid",
            "title": "string"
        },
        "student": {
            "id": "uuid",
            "username": "string"
        },
        "attempt": "uuid"
    }
]
```

#### 8.6.2 Grade Answer
**POST** `/teacher/grading/answer/<answer_id>/`

**Authentication:** Required (Teacher)

**Request Body:**
```json
{
    "points_earned": "integer",
    "feedback": "string (optional)"
}
```

**Response (200):**
```json
{
    "message": "Answer graded successfully"
}
```

---

## 9. Revenue and Analytics

### 9.1 Get Teacher Revenue
**GET** `/teacher/revenue/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
{
    "total_revenue": "decimal",
    "monthly_revenue": "decimal",
    "courses": [
        {
            "id": "uuid",
            "title": "string",
            "enrollments_count": "integer",
            "revenue": "decimal"
        }
    ]
}
```

### 9.2 Get Student Enrollments for Course
**GET** `/get_student-enrollments/<course_id>/`

**Authentication:** Required (Course Owner)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "student": {
            "id": "uuid",
            "username": "string",
            "first_name": "string",
            "last_name": "string"
        },
        "enrolled_at": "datetime",
        "progress": "decimal"
    }
]
```

---

## 10. VdoCipher Integration

### 10.1 Create Upload Credentials
**POST** `/course/create-vdocipher-upload-credentials/`

**Authentication:** Required (Teacher)

**Response (200):**
```json
{
    "upload_url": "string",
    "upload_credentials": "object"
}
```

---

## Error Responses

### Common Error Format
```json
{
    "error": "string",
    "detail": "string (optional)",
    "field_errors": {
        "field_name": ["error message"]
    }
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

---

## Authentication Flow

1. **Register** as Teacher/Student
2. **Login** to get JWT tokens
3. **Use access token** in Authorization header for protected endpoints
4. **Refresh token** when access token expires
5. **Logout** to invalidate tokens

---

## Rate Limiting

- Most endpoints have standard rate limiting
- Authentication endpoints may have stricter limits
- File upload endpoints may have size limits

---

## File Upload Guidelines

- **Images**: JPG, PNG, GIF (max 5MB)
- **Documents**: PDF, DOC, DOCX (max 10MB)
- **Videos**: MP4, AVI, MOV (max 100MB)
- Use multipart/form-data for file uploads

---

## Pagination

List endpoints use Django REST Framework's PageNumberPagination:
- Default page size: 5 items
- Query parameter: `?page=<number>`
- Response includes `count`, `next`, `previous`, and `results`

---

## Notes

- All UUIDs are in standard format
- Datetimes are in ISO 8601 format
- Decimal fields use 2 decimal places for currency
- Boolean fields are true/false
- File fields return URLs when retrieved
- Optional fields may be null in responses

---

## Complete Error Response Documentation

### 1. User Management Error Responses

#### 1.1 Registration Validation Errors

**Teacher Registration Errors (400):**
```json
{
    "first_name": ["This field is required."],
    "last_name": ["This field is required."],
    "username": ["Username must be at least 5 characters long."],
    "email": ["Email already exists."],
    "phone": ["Phone already exists.", "Phone must be a number."],
    "password1": ["This password is too short. It must contain at least 8 characters."],
    "password2": ["Passwords don't match."]
}
```

**Student Registration Errors (400):**
```json
{
    "first_name": ["This field is required."],
    "last_name": ["This field is required."],
    "email": ["Email already exists."],
    "username": ["Username must be at least 5 characters long."],
    "phone": ["Phone already exists.", "Phone must be a number."],
    "parent_phone": ["This field is required."],
    "password1": ["This password is too short. It must contain at least 8 characters."],
    "password2": ["Passwords don't match."],
    "teacher": ["Teacher username is required.", "Teacher with this username does not exist."]
}
```

#### 1.2 Login Errors

**Invalid Credentials (400):**
```json
{
    "error": "Invalid credentials",
    "detail": "Email and password are required."
}
```

**User Not Found (404):**
```json
{
    "error": "User not found",
    "detail": "No user found with the provided credentials."
}
```

**Account Blocked (403):**
```json
{
    "error": "Account blocked",
    "detail": "Your account has been blocked by the teacher."
}
```

#### 1.3 Profile Update Errors

**Invalid File Type (400):**
```json
{
    "avatar": ["Upload a valid image. The file you uploaded was either not an image or a corrupted image."],
    "logo": ["Upload a valid image. The file you uploaded was either not an image or a corrupted image."]
}
```

**File Too Large (400):**
```json
{
    "avatar": ["Image file too large ( > 5MB )"],
    "logo": ["Image file too large ( > 5MB )"]
}
```

**Permission Denied (403):**
```json
{
    "error": "Permission denied",
    "detail": "You do not have permission to update this profile."
}
```

#### 1.4 Password Change Errors

**Invalid Old Password (400):**
```json
{
    "old_password": ["Your old password was entered incorrectly. Please enter it again."]
}
```

**Password Validation (400):**
```json
{
    "new_password1": [
        "This password is too short. It must contain at least 8 characters.",
        "This password is too common.",
        "This password is entirely numeric."
    ],
    "new_password2": ["The two password fields didn't match."]
}
```

#### 1.5 Password Reset Errors

**Invalid Email (400):**
```json
{
    "email": ["No user found with this email address."]
}
```

**Invalid OTP (400):**
```json
{
    "otp": ["Invalid OTP code."],
    "email": ["Email and OTP combination is invalid."]
}
```

**OTP Expired (400):**
```json
{
    "error": "OTP expired",
    "detail": "The OTP code has expired. Please request a new one."
}
```

### 2. Course Management Error Responses

#### 2.1 Course Creation Errors

**Validation Errors (400):**
```json
{
    "title": ["This field is required."],
    "description": ["This field is required."],
    "category": ["This field is required.", "Invalid category ID."],
    "price": ["A valid number is required.", "Price must be greater than or equal to 0."],
    "thumbnail": ["Upload a valid image. The file you uploaded was either not an image or a corrupted image."]
}
```

**Business Logic Errors (400):**
```json
{
    "price": ["Price must be 0 for free courses"],
    "is_free": ["Cannot set course as free with non-zero price"]
}
```

**Permission Errors (403):**
```json
{
    "error": "Permission denied",
    "detail": "Only teachers can create courses."
}
```

#### 2.2 Course Update Errors

**Course Not Found (404):**
```json
{
    "error": "Course not found",
    "detail": "No course found with the provided ID."
}
```

**Not Course Owner (403):**
```json
{
    "error": "Permission denied",
    "detail": "You can only update your own courses."
}
```

**Invalid Category (400):**
```json
{
    "category": ["Invalid category ID."]
}
```

#### 2.3 Course Deletion Errors

**Course Has Enrollments (400):**
```json
{
    "error": "Cannot delete course",
    "detail": "Course has active enrollments and cannot be deleted."
}
```

**Not Course Owner (403):**
```json
{
    "error": "Permission denied",
    "detail": "You can only delete your own courses."
}
```

### 3. Course Module Error Responses

#### 3.1 Module Creation Errors

**Validation Errors (400):**
```json
{
    "title": ["This field is required."],
    "description": ["This field is required."],
    "order": ["A valid integer is required.", "Order must be greater than 0."]
}
```

**Course Not Found (404):**
```json
{
    "error": "Course not found",
    "detail": "The specified course does not exist."
}
```

**Not Course Owner (403):**
```json
{
    "error": "Permission denied",
    "detail": "You can only create modules for your own courses."
}
```

#### 3.2 Module Update/Delete Errors

**Module Not Found (404):**
```json
{
    "error": "Module not found",
    "detail": "The specified module does not exist."
}
```

**Module Has Lessons (400):**
```json
{
    "error": "Cannot delete module",
    "detail": "Module contains lessons and cannot be deleted."
}
```

### 4. Course Lesson Error Responses

#### 4.1 Lesson Creation Errors

**Validation Errors (400):**
```json
{
    "title": ["This field is required."],
    "description": ["This field is required."],
    "order": ["A valid integer is required.", "Order must be greater than 0."],
    "video_id": ["Invalid video ID format."],
    "thumbnail": ["Upload a valid image. The file you uploaded was either not an image or a corrupted image."]
}
```

**Module Not Found (404):**
```json
{
    "error": "Module not found",
    "detail": "The specified module does not exist."
}
```

**Video Processing Errors (400):**
```json
{
    "video_id": ["Video is still being processed. Please wait."],
    "video_processing_status": ["Video processing failed. Please try again."]
}
```

#### 4.2 Lesson Progress Errors

**Not Enrolled (403):**
```json
{
    "error": "Not enrolled",
    "detail": "You must be enrolled in this course to update lesson progress."
}
```

**Invalid Status (400):**
```json
{
    "status": ["Invalid status. Must be one of: completed, in_progress, not_started"]
}
```

### 5. Enrollment Error Responses

#### 5.1 Course Enrollment Errors

**Already Enrolled (400):**
```json
{
    "error": "Already enrolled",
    "detail": "You are already enrolled in this course."
}
```

**Course Not Available (400):**
```json
{
    "error": "Course not available",
    "detail": "This course is not published or available for enrollment."
}
```

**Insufficient Permissions (403):**
```json
{
    "error": "Permission denied",
    "detail": "You must be a student to enroll in courses."
}
```

#### 5.2 Module Enrollment Errors

**Course Not Enrolled (400):**
```json
{
    "error": "Course not enrolled",
    "detail": "You must be enrolled in the course before enrolling in modules."
}
```

**Module Not Found (404):**
```json
{
    "error": "Module not found",
    "detail": "The specified module does not exist."
}
```

### 6. Coupon System Error Responses

#### 6.1 Coupon Creation Errors

**Validation Errors (400):**
```json
{
    "code": ["This field is required.", "Coupon code already exists."],
    "discount_percentage": [
        "A valid integer is required.",
        "Discount percentage must be between 1 and 100."
    ],
    "valid_from": ["This field is required.", "Invalid date format."],
    "valid_until": ["This field is required.", "Valid until date must be after valid from date."],
    "max_uses": ["A valid integer is required.", "Max uses must be greater than 0."],
    "number_of_coupons": ["A valid integer is required.", "Number of coupons must be at least 1."]
}
```

**Business Logic Errors (400):**
```json
{
    "valid_until": ["Coupon expiration date cannot be in the past."],
    "discount_percentage": ["Discount percentage cannot exceed 100%."]
}
```

#### 6.2 Coupon Usage Errors

**Coupon Not Found (404):**
```json
{
    "error": "Coupon not found",
    "detail": "The specified coupon does not exist."
}
```

**Coupon Expired (400):**
```json
{
    "error": "Coupon expired",
    "detail": "This coupon has expired and cannot be used."
}
```

**Coupon Usage Limit (400):**
```json
{
    "error": "Usage limit reached",
    "detail": "This coupon has reached its maximum usage limit."
}
```

**Already Used (400):**
```json
{
    "error": "Already used",
    "detail": "You have already used this coupon."
}
```

### 7. Rating System Error Responses

#### 7.1 Rating Creation Errors

**Not Enrolled (403):**
```json
{
    "error": "Not enrolled",
    "detail": "You must be enrolled in this course to rate it."
}
```

**Already Rated (400):**
```json
{
    "error": "Already rated",
    "detail": "You have already rated this course."
}
```

**Validation Errors (400):**
```json
{
    "rating": ["A valid integer is required.", "Rating must be between 1 and 5."],
    "comment": ["Comment cannot exceed 500 characters."]
}
```

#### 7.2 Rating Update/Delete Errors

**Rating Not Found (404):**
```json
{
    "error": "Rating not found",
    "detail": "The specified rating does not exist."
}
```

**Not Rating Owner (403):**
```json
{
    "error": "Permission denied",
    "detail": "You can only modify your own ratings."
}
```

### 8. Assessment System Error Responses

#### 8.1 Assessment Creation Errors

**Validation Errors (400):**
```json
{
    "title": ["This field is required."],
    "description": ["This field is required."],
    "assessment_type": [
        "This field is required.",
        "Invalid assessment type. Must be one of: quiz, assignment, exam"
    ],
    "duration_minutes": ["A valid integer is required.", "Duration must be greater than 0."],
    "passing_score": ["A valid integer is required.", "Passing score must be greater than 0."]
}
```

**Permission Errors (403):**
```json
{
    "error": "Permission denied",
    "detail": "You can only create assessments for your own courses/modules/lessons."
}
```

#### 8.2 Question Creation Errors

**Validation Errors (400):**
```json
{
    "question_text": ["Question text cannot be empty."],
    "question_type": [
        "Invalid question type.",
        "valid_types": ["multiple_choice", "true_false", "short_answer", "essay"]
    ],
    "mark": ["Marks must be greater than 0."],
    "order": ["A valid integer is required.", "Order must be greater than 0."]
}
```

**Assessment Not Found (404):**
```json
{
    "error": "Assessment not found",
    "detail": "The specified assessment does not exist."
}
```

#### 8.3 Question Option Errors

**Validation Errors (400):**
```json
{
    "option_text": ["Option text cannot be empty."],
    "is_correct": ["You must specify if this option is correct."],
    "order": ["A valid integer is required.", "Order must be greater than 0."]
}
```

**Question Not Found (404):**
```json
{
    "error": "Question not found",
    "detail": "The specified question does not exist."
}
```

#### 8.4 Student Assessment Errors

**Assessment Not Available (400):**
```json
{
    "error": "Assessment not available",
    "detail": "This assessment is not active or available for students."
}
```

**Not Enrolled (403):**
```json
{
    "error": "Not enrolled",
    "detail": "You must be enrolled in the course to take this assessment."
}
```

**Already Attempted (400):**
```json
{
    "error": "Already attempted",
    "detail": "You have already attempted this assessment."
}
```

**Assessment Expired (400):**
```json
{
    "error": "Assessment expired",
    "detail": "The time limit for this assessment has expired."
}
```

#### 8.5 Assessment Submission Errors

**Validation Errors (400):**
```json
{
    "answers": ["This field is required."],
    "answers.0.question": ["Invalid question ID."],
    "answers.0.text_answer": ["Text answer is required for short_answer/essay questions."],
    "answers.0.selected_options": ["Selected options are required for multiple_choice questions."],
    "answers.0.true_false_answer": ["True/false answer is required for true_false questions."]
}
```

**Attempt Not Found (404):**
```json
{
    "error": "Attempt not found",
    "detail": "The specified assessment attempt does not exist."
}
```

**Attempt Already Submitted (400):**
```json
{
    "error": "Already submitted",
    "detail": "This assessment attempt has already been submitted."
}
```

#### 8.6 Grading Errors

**Answer Not Found (404):**
```json
{
    "error": "Answer not found",
    "detail": "The specified student answer does not exist."
}
```

**Invalid Points (400):**
```json
{
    "points_earned": [
        "A valid integer is required.",
        "Points earned cannot exceed question points.",
        "Points earned cannot be negative."
    ]
}
```

**Not Question Owner (403):**
```json
{
    "error": "Permission denied",
    "detail": "You can only grade answers for your own questions."
}
```

### 9. File Upload Error Responses

#### 9.1 Image Upload Errors

**Invalid File Type (400):**
```json
{
    "thumbnail": ["Upload a valid image. The file you uploaded was either not an image or a corrupted image."],
    "avatar": ["Upload a valid image. The file you uploaded was either not an image or a corrupted image."],
    "logo": ["Upload a valid image. The file you uploaded was either not an image or a corrupted image."]
}
```

**File Too Large (400):**
```json
{
    "thumbnail": ["Image file too large ( > 5MB )"],
    "avatar": ["Image file too large ( > 5MB )"],
    "logo": ["Image file too large ( > 5MB )"]
}
```

**Corrupted File (400):**
```json
{
    "error": "File corrupted",
    "detail": "The uploaded file appears to be corrupted and cannot be processed."
}
```

#### 9.2 Document Upload Errors

**Invalid File Type (400):**
```json
{
    "document": ["Upload a valid document. Supported formats: PDF, DOC, DOCX."]
}
```

**File Too Large (400):**
```json
{
    "document": ["Document file too large ( > 10MB )"]
}
```

#### 9.3 Video Upload Errors

**Invalid File Type (400):**
```json
{
    "video": ["Upload a valid video. Supported formats: MP4, AVI, MOV."]
}
```

**File Too Large (400):**
```json
{
    "video": ["Video file too large ( > 100MB )"]
}
```

**Video Processing Failed (500):**
```json
{
    "error": "Video processing failed",
    "detail": "An error occurred while processing the video. Please try again."
}
```

### 10. Authentication and Permission Error Responses

#### 10.1 JWT Token Errors

**Invalid Token (401):**
```json
{
    "error": "Invalid token",
    "detail": "The provided token is invalid or expired."
}
```

**Token Expired (401):**
```json
{
    "error": "Token expired",
    "detail": "The provided token has expired. Please refresh your token."
}
```

**Invalid Refresh Token (400):**
```json
{
    "error": "Invalid refresh token",
    "detail": "The provided refresh token is invalid."
}
```

#### 10.2 Permission Errors

**Insufficient Permissions (403):**
```json
{
    "error": "Permission denied",
    "detail": "You do not have sufficient permissions to perform this action."
}
```

**Not Authenticated (401):**
```json
{
    "error": "Authentication required",
    "detail": "You must be authenticated to perform this action."
}
```

**Wrong User Type (403):**
```json
{
    "error": "Wrong user type",
    "detail": "This action is only available for teachers/students."
}
```

### 11. Database and System Error Responses

#### 11.1 Database Errors

**Integrity Error (400):**
```json
{
    "error": "Database integrity error",
    "detail": "The operation would violate database constraints."
}
```

**Object Does Not Exist (404):**
```json
{
    "error": "Object not found",
    "detail": "The requested object does not exist."
}
```

**Multiple Objects Returned (400):**
```json
{
    "error": "Multiple objects found",
    "detail": "Multiple objects match the specified criteria."
}
```

#### 11.2 System Errors

**Internal Server Error (500):**
```json
{
    "error": "Internal server error",
    "detail": "An unexpected error occurred. Please try again later."
}
```

**Service Unavailable (503):**
```json
{
    "error": "Service unavailable",
    "detail": "The service is temporarily unavailable. Please try again later."
}
```

**Rate Limit Exceeded (429):**
```json
{
    "error": "Rate limit exceeded",
    "detail": "Too many requests. Please try again later."
}
```

### 12. Business Logic Error Responses

#### 12.1 Enrollment Errors

**Course Full (400):**
```json
{
    "error": "Course full",
    "detail": "This course has reached its maximum enrollment capacity."
}
```

**Prerequisites Not Met (400):**
```json
{
    "error": "Prerequisites not met",
    "detail": "You must complete the required prerequisites before enrolling in this course."
}
```

#### 12.2 Payment Errors

**Payment Failed (400):**
```json
{
    "error": "Payment failed",
    "detail": "The payment could not be processed. Please try again."
}
```

**Insufficient Funds (400):**
```json
{
    "error": "Insufficient funds",
    "detail": "You do not have sufficient funds to complete this transaction."
}
```

#### 12.3 Content Access Errors

**Content Not Available (400):**
```json
{
    "error": "Content not available",
    "detail": "This content is not available in your current subscription plan."
}
```

**Geographic Restriction (400):**
```json
{
    "error": "Geographic restriction",
    "detail": "This content is not available in your geographic region."
}
```

### 13. Error Response Headers

**Rate Limiting Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

**Pagination Headers:**
```
X-Pagination-Count: 150
X-Pagination-Page: 1
X-Pagination-PageSize: 10
```

**Cache Headers:**
```
Cache-Control: max-age=3600
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
```

### 14. Error Handling Best Practices

#### 14.1 Client-Side Error Handling

1. **Always check HTTP status codes**
2. **Parse error response body for detailed messages**
3. **Handle validation errors field by field**
4. **Implement exponential backoff for retries**
5. **Show user-friendly error messages**

#### 14.2 Server-Side Error Handling

1. **Return appropriate HTTP status codes**
2. **Provide detailed error messages**
3. **Include field-specific validation errors**
4. **Log errors for debugging**
5. **Maintain consistent error response format**

#### 14.3 Common Error Scenarios

1. **Network errors**: Implement retry logic
2. **Authentication errors**: Redirect to login
3. **Validation errors**: Show field-specific messages
4. **Permission errors**: Show appropriate UI feedback
5. **System errors**: Show generic error message
