# EduPro API Documentation

This document provides a comprehensive overview of the EduPro backend API endpoints, their functionalities, required parameters, and expected responses.

## Base URL
The base URL for all API endpoints is `/api/v1`.

## API Endpoints List
- **URL**: `/api/v1`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Returns a list of all available API endpoints with their full URLs.
- **Response (Success - 200 OK)**:
    ```json
    [
        "http://example.com/api/v1/teacher/login/",
        "http://example.com/api/v1/student/login/username/",
        "http://example.com/api/v1/logout/",
        // ... more endpoints
    ]
    ```

## Authentication

EduPro API uses token-based authentication via cookies.
- Upon successful login, `access_token` and `refresh_token` are set as HTTP-only cookies.
- The `access_token` is used for authenticating subsequent requests.
- The `refresh_token` is used to obtain a new `access_token` when the current one expires.

## Endpoints

---

### 1. User Authentication & Management

#### 1.1. Teacher/Admin Login
- **URL**: `/api/v1/teacher/login/`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Authenticates a teacher or admin user and sets access and refresh tokens as HTTP-only cookies.
- **Request Body**:
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "id": "integer",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "string",
        "user_type": "string",
        "username": "string",
        "slug": "string"
    }
    ```
- **Response (Error - 401 Unauthorized)**:
    ```json
    {
        "error": "Invalid credentials"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "email": ["This field is required."],
        "password": ["This field is required."]
    }
    ```

#### 1.2. Student Login
- **URL**: `/api/v1/student/login/<teacher_username>/`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Authenticates a student user under a specific teacher and sets access and refresh tokens as HTTP-only cookies.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher the student is associated with.
- **Request Body**:
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "id": "integer",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "string",
        "user_type": "string",
        "username": "string",
        "slug": "string"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "email": ["This field is required."],
        "password": ["This field is required."]
    }
    ```
- **Response (Error - 401 Unauthorized)**:
    ```json
    {
        "error": "Invalid credentials. Please check your email and password."
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "error": "You are not registered as a student for this teacher."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "error": "Teacher not found."
    }
    ```

#### 1.3. Logout
- **URL**: `/api/v1/logout/`
- **Method**: `POST`
- **Permissions**: `IsAuthenticated`
- **Description**: Logs out the authenticated user by blacklisting the refresh token and deleting cookies.
- **Request Body**: None
- **Response (Success - 205 Reset Content)**:
    ```json
    {
        "message": "Logged out successfully"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "message": "No refresh token found"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "error": "Invalid token"
    }
    ```
- **Response (Error - 500 Internal Server Error)**:
    ```json
    {
        "error": "An unexpected error occurred during logout."
    }
    ```

#### 1.4. Refresh Token (Teacher/Admin)
- **URL**: `/api/v1/token/refresh/`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Refreshes the access token using the refresh token stored in cookies.
- **Request Body**: None (refresh token is read from cookies)
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "Token refreshed successfully"
    }
    ```
- **Response (Error - 401 Unauthorized)**:
    ```json
    {
        "error": "Refresh token not found"
    }
    ```
- **Response (Error - 401 Unauthorized)**:
    ```json
    {
        "error": "Invalid or expired refresh token"
    }
    ```

#### 1.5. Refresh Token (Student)
- **URL**: `/api/v1/student/refresh/<teacher_username>/`
- **Method**: `POST`
- **Permissions**: `IsAuthenticated`
- **Description**: Refreshes the student's access token using the refresh token stored in cookies, specific to a teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher.
- **Request Body**: None (refresh token is read from cookies)
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "Token refreshed successfully"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "error": "User is not a student or does not have a student profile."
    }
    ```
- **Response (Error - 401 Unauthorized)**:
    ```json
    {
        "error": "Refresh token not found"
    }
    ```
- **Response (Error - 401 Unauthorized)**:
    ```json
    {
        "error": "Invalid or expired refresh token"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "error": "You are not registered as a student for this teacher."
    }
    ```

#### 1.6. Request Password Reset
- **URL**: `/api/v1/password-reset/request/`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Sends an OTP code to the user's email for password reset.
- **Request Body**:
    ```json
    {
        "email": "string"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "OTP sent to your email."
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "email": ["User with this email does not exist."]
    }
    ```

#### 1.7. Verify OTP
- **URL**: `/api/v1/password-reset/verify/`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Verifies the OTP code sent to the user's email.
- **Request Body**:
    ```json
    {
        "email": "string",
        "otp": "string (6 characters)"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "OTP verified successfully"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "email": ["Invalid email"],
        "otp": ["Invalid OTP", "OTP expired"]
    }
    ```

#### 1.8. Reset Password
- **URL**: `/api/v1/password-reset/confirm/`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Resets the user's password after OTP verification.
- **Request Body**:
    ```json
    {
        "email": "string",
        "otp": "string (6 characters)",
        "new_password": "string (min: 8 characters)"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "Password reset successfully"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "email": ["Invalid email"],
        "otp": ["Invalid OTP", "OTP expired"],
        "new_password": ["This field is required.", "Ensure this field has at least 8 characters."]
    }
    ```

#### 1.9. Teacher Registration
- **URL**: `/api/v1/teacher/teacher-register/`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Registers a new teacher account.
- **Request Body**:
    ```json
    {
        "first_name": "string",
        "last_name": "string",
        "username": "string",
        "email": "string",
        "phone": "string",
        "password1": "string",
        "password2": "string",
        "avatar": "file (optional)",
        "logo": "file (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "message": "User created successfully",
        "user": {
            "id": "integer",
            "email": "string",
            "phone": "string",
            "username": "string",
            "user_type": "string",
            "slug": "string",
            "avatar": "url or null",
            "logo": "url or null"
        }
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "password": ["Passwords don't match"],
        "email": ["Email already exists"],
        "phone": ["phone already exists"]
    }
    ```

#### 1.10. Student Registration
- **URL**: `/api/v1/student/student-register/<teacher_username>`
- **Method**: `POST`
- **Permissions**: `AllowAny`
- **Description**: Registers a new student account and associates it with a specific teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher to associate the student with.
- **Request Body**:
    ```json
    {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "username": "string",
        "phone": "string",
        "parent_phone": "string",
        "password1": "string",
        "password2": "string",
        "avatar": "file (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "message": "Student created successfully",
        "user": {
            "id": "integer",
            "email": "string",
            "phone": "string",
            "parent_phone": "string",
            "username": "string",
            "user_type": "string",
            "slug": "string",
            "avatar": "url or null"
        }
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "password": ["Passwords don't match"],
        "email": ["Email already exists"],
        "phone": ["Phone already exists"],
        "teacher": ["Teacher username is required."]
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "teacher": ["Teacher with this username does not exist."]
    }
    ```

#### 1.11. Authenticated Student Join Teacher
- **URL**: `/api/v1/join-teacher/<teacher_username>/`
- **Method**: `POST`
- **Permissions**: `IsStudent`
- **Description**: Allows an already authenticated student to join a teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher to join.
- **Request Body**: None
- **Response (Success - 201 Created)**:
    ```json
    {
        "success": "Student joined successfully."
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "info": "Student is already associated with this teacher."
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "error": "Teacher username is required in the URL."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "error": "Teacher not found."
    }
    ```

#### 1.12. Get Student Profile
- **URL**: `/api/v1/student/student-profile/<teacher_username>`
- **Method**: `GET`
- **Permissions**: `IsStudent`
- **Description**: Retrieves the profile details of the authenticated student in relation to a specific teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher.
- **Response (Success - 200 OK)**:
    ```json
    {
        "id": "integer",
        "student": {
            "user": {
                "id": "integer",
                "first_name": "string",
                "last_name": "string",
                "email": "string",
                "slug": "string",
                "phone": "string",
                "parent_phone": "string",
                "user_type": "string",
                "avatar": "url or null",
                "logo": "url or null",
                "is_active": "boolean",
                "created_at": "datetime",
                "last_login": "datetime"
            },
            "id": "integer",
            "full_name": "string",
            "bio": "string",
            "profile_picture": "url or null",
            "date_of_birth": "date or null",
            "address": "string",
            "country": "string",
            "city": "string",
            "gender": "string"
        },
        "enrollment_date": "datetime",
        "notes": "string",
        "is_active": "boolean",
        "completed_lessons": "integer",
        "last_activity": "datetime",
        "number_of_completed_courses": "integer",
        "number_of_enrollment_courses": "integer"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "teacher_id": "teacher username is required"
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 1.13. Update Student Profile
- **URL**: `/api/v1/student/update-profile/`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsStudent`
- **Description**: Updates the profile details of the authenticated student.
- **Request Body**: (Partial or full `StudentProfileSerializer` fields)
    ```json
    {
        "full_name": "string (optional)",
        "bio": "string (optional)",
        "profile_picture": "file (optional)",
        "date_of_birth": "date (optional)",
        "address": "string (optional)",
        "country": "string (optional)",
        "city": "string (optional)",
        "gender": "string (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Updated `StudentProfileSerializer` fields)
    ```json
    {
        "user": {
            "id": "integer",
            "first_name": "string",
            "last_name": "string",
            "email": "string",
            "slug": "string",
            "phone": "string",
            "parent_phone": "string",
            "user_type": "string",
            "avatar": "url or null",
            "logo": "url or null",
            "is_active": "boolean",
            "created_at": "datetime",
            "last_login": "datetime"
        },
        "id": "integer",
        "full_name": "string",
        "bio": "string",
        "profile_picture": "url or null",
        "date_of_birth": "date or null",
        "address": "string",
        "country": "string",
        "city": "string",
        "gender": "string"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You are not a Student."
    }
    ```

#### 1.14. Get Teacher Profile
- **URL**: `/api/v1/teacher/teacher-profile/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves the profile details of the authenticated teacher.
- **Response (Success - 200 OK)**:
    ```json
    {
        "user": {
            "id": "integer",
            "first_name": "string",
            "last_name": "string",
            "email": "string",
            "phone": "string",
            "user_type": "string",
            "username": "string",
            "slug": "string"
        },
        "id": "integer",
        "full_name": "string",
        "bio": "string",
        "profile_picture": "url or null",
        "date_of_birth": "date or null",
        "address": "string",
        "country": "string",
        "city": "string",
        "number_of_courses": "integer",
        "specialization": "string",
        "institution": "string",
        "experiance": "string",
        "number_of_students": "integer",
        "rating": "float",
        "gender": "string",
        "created_at": "datetime",
        "logo": "url or null",
        "primary_color": "string",
        "primary_color_light": "string",
        "primary_color_dark": "string",
        "secondary_color": "string",
        "accent_color": "string",
        "background_color": "string"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You are not a Teacher."
    }
    ```

#### 1.15. Get Public Teacher Info
- **URL**: `/api/v1/teacher/teacher-profile/<teacher_username>`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Retrieves public profile information for a specific teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher.
- **Response (Success - 200 OK)**: (Same as Get Teacher Profile, but public fields)
    ```json
    {
        "user": {
            "id": "integer",
            "first_name": "string",
            "last_name": "string",
            "email": "string",
            "username": "string",
            "slug": "string"
        },
        "id": "integer",
        "full_name": "string",
        "bio": "string",
        "profile_picture": "url or null",
        "date_of_birth": "date or null",
        "address": "string",
        "country": "string",
        "city": "string",
        "number_of_courses": "integer",
        "specialization": "string",
        "institution": "string",
        "experiance": "string",
        "number_of_students": "integer",
        "rating": "float",
        "gender": "string",
        "created_at": "datetime",
        "logo": "url or null",
        "primary_color": "string",
        "primary_color_light": "string",
        "primary_color_dark": "string",
        "secondary_color": "string",
        "accent_color": "string",
        "background_color": "string"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "teacher_id": "teacher username is required"
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 1.16. Update Teacher Profile
- **URL**: `/api/v1/teacher/update-profile/`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsTeacher`
- **Description**: Updates the profile details of the authenticated teacher.
- **Request Body**: (Partial or full `TeacherProfileSerializer` fields)
    ```json
    {
        "full_name": "string (optional)",
        "bio": "string (optional)",
        "profile_picture": "file (optional)",
        "date_of_birth": "date (optional)",
        "address": "string (optional)",
        "country": "string (optional)",
        "city": "string (optional)",
        "specialization": "string (optional)",
        "institution": "string (optional)",
        "experiance": "string (optional)",
        "gender": "string (optional)",
        "logo": "file (optional)",
        "primary_color": "string (optional)",
        "primary_color_light": "string (optional)",
        "primary_color_dark": "string (optional)",
        "secondary_color": "string (optional)",
        "accent_color": "string (optional)",
        "background_color": "string (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Updated `TeacherProfileSerializer` fields)
    ```json
    {
        "user": {
            "id": "integer",
            "first_name": "string",
            "last_name": "string",
            "email": "string",
            "phone": "string",
            "user_type": "string",
            "username": "string",
            "slug": "string"
        },
        "id": "integer",
        "full_name": "string",
        "bio": "string",
        "profile_picture": "url or null",
        "date_of_birth": "date or null",
        "address": "string",
        "country": "string",
        "city": "string",
        "number_of_courses": "integer",
        "specialization": "string",
        "institution": "string",
        "experiance": "string",
        "number_of_students": "integer",
        "rating": "float",
        "gender": "string",
        "created_at": "datetime",
        "logo": "url or null",
        "primary_color": "string",
        "primary_color_light": "string",
        "primary_color_dark": "string",
        "secondary_color": "string",
        "accent_color": "string",
        "background_color": "string"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You are not a Teacher."
    }
    ```

#### 1.17. Remove Student (by Teacher)
- **URL**: `/api/v1/teacher/students/remove/<student_id>/`
- **Method**: `DELETE`
- **Permissions**: `IsTeacher`
- **Description**: Allows a teacher to remove a student from their associated students.
- **URL Parameters**:
    - `student_id`: The ID of the student to remove.
- **Request Body**: None
- **Response (Success - 204 No Content)**: (No content, successful deletion)
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "student_id": "student id is required"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 1.18. Toggle Block Student (by Teacher)
- **URL**: `/api/v1/teacher/students/toggle-block/<student_id>/`
- **Method**: `PATCH`
- **Permissions**: `IsTeacher`
- **Description**: Allows a teacher to block or unblock a student by toggling their active status.
- **URL Parameters**:
    - `student_id`: The ID of the student to block/unblock.
- **Request Body**: None
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "Student has been blocked."
    }
    ```
    or
    ```json
    {
        "message": "Student has been unblocked."
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "student_id": "Student ID is required in the URL."
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 1.19. Get Students Related to Teacher
- **URL**: `/api/v1/teacher/get_students/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves a paginated list of students associated with the authenticated teacher.
- **Response (Success - 200 OK)**:
    ```json
    {
        "students": [
            {
                "user": {
                    "id": "integer",
                    "first_name": "string",
                    "last_name": "string",
                    "email": "string",
                    "slug": "string",
                    "phone": "string",
                    "parent_phone": "string",
                    "user_type": "string",
                    "avatar": "url or null",
                    "logo": "url or null",
                    "is_active": "boolean",
                    "created_at": "datetime",
                    "last_login": "datetime"
                },
                "id": "integer",
                "full_name": "string",
                "bio": "string",
                "profile_picture": "url or null",
                "date_of_birth": "date or null",
                "address": "string",
                "country": "string",
                "city": "string",
                "gender": "string"
            }
            // ... more student objects
        ]
    }
    ```

#### 1.20. Get Students Related to Teacher (with filtering, searching, and ordering)
- **URL**: `/api/v1/teacher/get_students/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves a paginated list of students associated with the authenticated teacher. This endpoint supports filtering by `is_active` status, searching by student's username, email, or full name, and ordering by `enrollment_date` or `student__full_name`.
- **Query Parameters**:
    - `page`: Page number (e.g., `?page=1`)
    - `page_size`: Number of items per page (default: 5)
    - `is_active`: Filter by student's active status (`true` or `false`).
    - `search`: Search term for student's username, email, or full name.
    - `ordering`: Field to order by. Options are `enrollment_date`, `-enrollment_date`, `student__full_name`, `-student__full_name`.
- **Frontend URL Examples**:
    - **Get page 2 of students**: `/api/v1/teacher/get_students/?page=2`
    - **Get active students**: `/api/v1/teacher/get_students/?is_active=true`
    - **Search for students with "john" in their name, email, or username**: `/api/v1/teacher/get_students/?search=john`
    - **Order students by enrollment date (ascending)**: `/api/v1/teacher/get_students/?ordering=enrollment_date`
    - **Order students by full name (descending)**: `/api/v1/teacher/get_students/?ordering=-student__full_name`
    - **Combined example (active students, page 1, ordered by name)**: `/api/v1/teacher/get_students/?is_active=true&page=1&ordering=student__full_name`
- **Response (Success - 200 OK)**:
    ```json
    {
        "count": "integer",
        "next": "url or null",
        "previous": "url or null",
        "results": [
            {
                "id": "integer",
                "student": {
                    "user": {
                        "id": "integer",
                        "first_name": "string",
                        "last_name": "string",
                        "email": "string",
                        "username": "string",
                        "slug": "string",
                        "phone": "string",
                        "parent_phone": "string",
                        "user_type": "string",
                        "avatar": "url or null",
                        "logo": "url or null",
                        "is_active": "boolean",
                        "created_at": "datetime",
                        "last_login": "datetime"
                    },
                    "id": "integer",
                    "full_name": "string",
                    "bio": "string or null",
                    "profile_picture": "url or null",
                    "date_of_birth": "date or null",
                    "address": "string or null",
                    "country": "string or null",
                    "city": "string or null",
                    "gender": "string or null"
                },
                "enrollment_date": "datetime",
                "notes": "string or null",
                "is_active": "boolean",
                "completed_lessons": "integer",
                "last_activity": "datetime or null",
                "number_of_completed_courses": "integer",
                "teacher": "integer (teacher profile id)"
            }
        ]
    }
    ```

#### 1.21. Get Student Profile Associated with Teacher
- **URL**: `/api/v1/teacher/get-student-profile/<student_id>`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves the profile details of a specific student associated with the authenticated teacher.
- **URL Parameters**:
    - `student_id`: The ID of the student.
- **Response (Success - 200 OK)**: (Same as Get Student Profile)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 1.22. Get Teacher Revenue
- **URL**: `/api/v1/teacher/revenue/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves the total revenue earned by the authenticated teacher from coupon usage.
- **Response (Success - 200 OK)**:
    ```json
    {
        "revenue": "decimal"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "error": "You are not a teacher."
    }
    ```

#### 1.23. Change Password
- **URL**: `/api/v1/change-password/`
- **Method**: `PUT`
- **Permissions**: `IsAuthenticated`
- **Description**: Allows an authenticated user to change their password.
- **Request Body**:
    ```json
    {
        "old_password": "string",
        "new_password": "string"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "Password changed successfully"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "error": "Old password is incorrect"
    }
    ```
    or
    ```json
    {
        "new_password": ["This field is required."]
    }
    ```

---

### 2. Course Category Management

#### 2.1. Create Course Category
- **URL**: `/api/v1/course/category/create/`
- **Method**: `POST`
- **Permissions**: `IsAdminUser`
- **Description**: Creates a new course category.
- **Request Body**:
    ```json
    {
        "name": "string",
        "icon": "file (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "id": "integer",
        "name": "string",
        "icon": "url or null"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "name": ["This field is required."]
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "user": "User is not a teacher" // Although permission is IsAdminUser, the serializer validation might return this.
    }
    ```

#### 2.2. List Course Categories
- **URL**: `/api/v1/course/category/list/`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Retrieves a list of all course categories.
- **Response (Success - 200 OK)**:
    ```json
    [
        {
            "id": "integer",
            "name": "string",
            "icon": "url or null"
        }
        // ... more category objects
    ]
    ```

#### 2.3. Update Course Category
- **URL**: `/api/v1/course/category/update/<category_id>`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsAdminUser`
- **Description**: Updates an existing course category.
- **URL Parameters**:
    - `category_id`: The ID of the course category to update.
- **Request Body**: (Partial or full `CourseCategorySerializer` fields)
    ```json
    {
        "name": "string (optional)",
        "icon": "file (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Updated `CourseCategorySerializer` fields)
    ```json
    {
        "id": "integer",
        "name": "string",
        "icon": "url or null"
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

---

### 3. Course Management

#### 3.1. Create Course
- **URL**: `/api/v1/course/create/`
- **Method**: `POST`
- **Permissions**: `IsTeacher`
- **Description**: Creates a new course.
- **Request Body**:
    ```json
    {
        "title": "string",
        "description": "string",
        "trailer_video": "file (optional)",
        "price": "decimal",
        "is_free": "boolean",
        "category": "integer (category ID)",
        "thumbnail": "file (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "trailer_video": "url or null",
        "price": "decimal",
        "is_published": "boolean",
        "is_free": "boolean",
        "category": {
            "id": "integer",
            "name": "string",
            "icon": "url or null"
        },
        "thumbnail": "url or null",
        "created_at": "datetime",
        "total_enrollments": "integer",
        "total_lessons": "integer",
        "total_reviews": "integer",
        "average_rating": "float",
        "total_durations": "integer"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "price": ["Price must be 0 for free courses"],
        "title": ["This field is required."]
    }
    ```

#### 3.2. List Courses (Public)
- **URL**: `/api/v1/course/list/`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Retrieves a paginated list of published courses.
- **Query Parameters**:
    - `page`: Page number (e.g., `?page=1`)
    - `page_size`: Number of items per page (default: 5)
- **Response (Success - 200 OK)**:
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
                "trailer_video": "url or null",
                "price": "decimal",
                "is_published": "boolean",
                "is_free": "boolean",
                "category": {
                    "id": "integer",
                    "name": "string",
                    "icon": "url or null"
                },
                "thumbnail": "url or null",
                "created_at": "datetime",
                "total_enrollments": "integer",
                "total_lessons": "integer",
                "total_reviews": "integer",
                "average_rating": "float",
                "total_durations": "integer"
            }
            // ... more course objects
        ]
    }
    ```

#### 3.3. Course Detail
- **URL**: `/api/v1/course/course-detail/<course_id>`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Retrieves details for a specific course.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Response (Success - 200 OK)**: (Same as Course List item)
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 3.4. Update Course
- **URL**: `/api/v1/course/update/<course_id>`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsTeacher` (must be the owner of the course)
- **Description**: Updates an existing course.
- **URL Parameters**:
    - `course_id`: The UUID of the course to update.
- **Request Body**: (Partial or full `CourseSerializer` fields)
    ```json
    {
        "title": "string (optional)",
        "description": "string (optional)",
        "trailer_video": "file (optional)",
        "price": "decimal (optional)",
        "is_published": "boolean (optional)",
        "is_free": "boolean (optional)",
        "category": "integer (category ID) (optional)",
        "thumbnail": "file (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Updated `CourseSerializer` fields)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 3.5. Delete Course
- **URL**: `/api/v1/course/course-delete/<course_id>`
- **Method**: `DELETE`
- **Permissions**: `IsTeacher` (must be the owner of the course)
- **Description**: Deletes a course.
- **URL Parameters**:
    - `course_id`: The UUID of the course to delete.
- **Response (Success - 204 No Content)**: (No content, successful deletion)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 3.6. Course Search and Filter
- **URL**: `/api/v1/course/course-search-filter/`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Searches and filters published courses based on various criteria.
- **Query Parameters**:
    - `category__name`: Filter by category name (e.g., `?category__name=Programming`)
    - `teacher__full_name`: Filter by teacher's full name (e.g., `?teacher__full_name=John Doe`)
    - `is_published`: Filter by published status (e.g., `?is_published=true`)
    - `search`: Search by title or description (e.g., `?search=Python`)
    - `ordering`: Order results by fields like `created_at`, `price`, `total_enrollments` (e.g., `?ordering=-created_at`)
    - `page`: Page number
    - `page_size`: Number of items per page (default: 5)
- **Response (Success - 200 OK)**: (Same as List Courses)

#### 3.7. List Courses Specific to Teacher
- **URL**: `/api/v1/course/list-by-teacher/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves a list of courses created by the authenticated teacher, ordered by creation date (newest first).
- **Response (Success - 200 OK)**:
    ```json
    [
        {
            "id": "uuid",
            "title": "string",
            "description": "string",
            "trailer_video": "url or null",
            "price": "decimal",
            "is_published": "boolean",
            "is_free": "boolean",
            "category": {
                "id": "integer",
                "name": "string",
                "icon": "url or null"
            },
            "thumbnail": "url or null",
            "created_at": "datetime",
            "total_enrollments": "integer",
            "total_lessons": "integer",
            "total_reviews": "integer",
            "average_rating": "float",
            "total_durations": "integer"
        }
    ]
    ```

#### 3.8. List Courses by Teacher (Public)
- **URL**: `/api/v1/course/teacher-list/<teacher_username>`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Retrieves a list of published courses created by a specific teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher.
- **Response (Success - 200 OK)**: (Same as List Courses Specific to Teacher)

#### 3.9. Get Course Private Details (Teacher)
- **URL**: `/api/v1/course/private-deatils/<course_id>`
- **Method**: `GET`
- **Permissions**: `IsCourseOwner`
- **Description**: Retrieves private course details including unpublished content, accessible only to the course owner.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Response (Success - 200 OK)**: (Extended course details with private information)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```

#### 3.10. Get Student Enrollments for Course
- **URL**: `/api/v1/get_student-enrollments/<course_id>`
- **Method**: `GET`
- **Permissions**: `IsCourseOwner`
- **Description**: Retrieves a list of students enrolled in a specific course.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Response (Success - 200 OK)**:
    ```json
    [
        {
            "id": "integer",
            "student": {
                "user": {
                    "id": "integer",
                    "first_name": "string",
                    "last_name": "string",
                    "email": "string",
                    "username": "string"
                },
                "full_name": "string"
            },
            "enrollment_date": "datetime",
            "status": "string",
            "access_type": "string",
            "is_active": "boolean",
            "progress": "decimal"
        }
    ]
    ```

#### 3.11. Get Teacher Course Enrollments
- **URL**: `/api/v1/teacher/courses/<uuid:course_id>/enrollments/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`, `IsCourseOwner`
- **Description**: Retrieves a paginated list of enrollments for a specific course owned by the authenticated teacher.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Query Parameters**:
    - `page`: Page number
    - `page_size`: Number of items per page (default: 5)
- **Response (Success - 200 OK)**:
    ```json
    {
        "count": "integer",
        "next": "url or null",
        "previous": "url or null",
        "results": [
            {
                "id": "integer",
                "student": {
                    "user": {
                        "id": "integer",
                        "first_name": "string",
                        "last_name": "string",
                        "email": "string",
                        "username": "string",
                        "slug": "string",
                        "phone": "string",
                        "parent_phone": "string",
                        "user_type": "string",
                        "avatar": "url or null",
                        "logo": "url or null",
                        "is_active": "boolean",
                        "created_at": "datetime",
                        "last_login": "datetime"
                    },
                    "id": "integer",
                    "full_name": "string",
                    "bio": "string or null",
                    "profile_picture": "url or null",
                    "date_of_birth": "date or null",
                    "address": "string or null",
                    "country": "string or null",
                    "city": "string or null",
                    "gender": "string or null"
                },
                "enrollment_date": "datetime",
                "ended_date": "datetime or null",
                "status": "string",
                "access_type": "string",
                "is_completed": "boolean",
                "is_active": "boolean",
                "progress": "decimal",
                "last_activity": "datetime or null"
            }
        ]
    }
    ```

---

### 4. Course Enrollment Management

#### 4.1. Course Enrollment
- **URL**: `/api/v1/course/course-enrollment/`
- **Method**: `POST`
- **Permissions**: `IsStudent`
- **Description**: Enrolls a student in a course, optionally using a coupon code.
- **Request Body**:
    ```json
    {
        "course_id": "uuid",
        "coupon_code": "string (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "id": "integer",
        "teacher": "integer (teacher ID)",
        "student": "integer (student ID)",
        "course": "uuid (course ID)",
        "status": "string",
        "is_active": "boolean",
        "date": "datetime"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "student": ["Student already has full access to this course"],
        "coupon": ["Invalid coupon code", "Coupon has expired", "Coupon has reached its maximum uses", "Coupon is not active", "Coupon is not valid for this course", "Coupon status does not allow enrollment"],
        "course": ["Course is not published"],
        "user": ["You are not a student of this teacher."],
        "coupon_code": ["Coupon code is required for paid courses."]
    }
    ```

#### 4.2. List Course Enrollments (by Student)
- **URL**: `/api/v1/course/course-enrollment-list/<teacher_username>`
- **Method**: `GET`
- **Permissions**: `IsStudent`
- **Description**: Retrieves a paginated list of courses the authenticated student is enrolled in, optionally filtered by teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher (optional).
- **Query Parameters**:
    - `page`: Page number
    - `page_size`: Number of items per page (default: 5)
- **Response (Success - 200 OK)**: (Same as List Courses, but only enrolled courses)

#### 4.3. Delete Course Enrollment
- **URL**: `/api/v1/course/course-enrollment-delete/<course_id>/<enrollment_id>` (for Teacher)
- **URL**: `/api/v1/course/course-enrollment-delete/<course_id>/` (for Student)
- **Method**: `DELETE`
- **Permissions**: `IsAuthenticated` (Teacher or Student)
- **Description**: Deletes a course enrollment. Teachers can delete any enrollment for their courses by providing `enrollment_id`. Students can delete their own enrollment by providing `course_id`.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
    - `enrollment_id`: The ID of the enrollment (required for teachers).
- **Response (Success - 204 No Content)**: (No content, successful deletion)
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "student_id": "student id is required"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

---

### 5. Coupon Management

#### 5.1. Create Coupon
- **URL**: `/api/v1/coupon/create/`
- **Method**: `POST`
- **Permissions**: `IsTeacher`
- **Description**: Creates one or more coupon codes for the authenticated teacher.
- **Request Body**:
    ```json
    {
        "number_of_coupons": "integer (min: 1)",
        "price": "decimal"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    [
        {
            "id": "integer",
            "teacher": "integer (teacher ID)",
            "code": "string",
            "status": "string",
            "max_uses": "integer",
            "used_count": "integer",
            "expiration_date": "datetime",
            "price": "decimal",
            "is_active": "boolean",
            "date": "datetime"
        }
        // ... more coupon objects
    ]
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "number_of_coupons": ["This field is required.", "Ensure this value is greater than or equal to 1."],
        "price": ["This field is required."]
    }
    ```

#### 5.2. List Coupons
- **URL**: `/api/v1/coupon/list/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves a paginated list of coupons created by the authenticated teacher.
- **Query Parameters**:
    - `page`: Page number
    - `page_size`: Number of items per page (default: 10)
- **Response (Success - 200 OK)**:
    ```json
    {
        "count": "integer",
        "next": "url or null",
        "previous": "url or null",
        "results": [
            {
                "id": "integer",
                "teacher": "integer (teacher ID)",
                "code": "string",
                "status": "string",
                "max_uses": "integer",
                "used_count": "integer",
                "expiration_date": "datetime",
                "price": "decimal",
                "is_active": "boolean",
                "date": "datetime"
            }
            // ... more coupon objects
        ]
    }
    ```

#### 5.3. Coupon Detail
- **URL**: `/api/v1/coupon/detail/<coupon_id>`
- **Method**: `GET`
- **Permissions**: `IsTeacher` (must be the owner of the coupon)
- **Description**: Retrieves details for a specific coupon.
- **URL Parameters**:
    - `coupon_id`: The ID of the coupon.
- **Response (Success - 200 OK)**: (Same as Coupon List item)
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 5.4. Update Coupon
- **URL**: `/api/v1/coupon/update/<coupon_id>`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsTeacher` (must be the owner of the coupon)
- **Description**: Updates an existing coupon.
- **URL Parameters**:
    - `coupon_id`: The ID of the coupon to update.
- **Request Body**: (Partial or full `CouponSerializer` fields)
    ```json
    {
        "status": "string (optional)",
        "max_uses": "integer (optional)",
        "expiration_date": "datetime (optional)",
        "price": "decimal (optional)",
        "is_active": "boolean (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Updated `CouponSerializer` fields)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 5.5. Delete Coupon
- **URL**: `/api/v1/coupon/delete/<coupon_id>`
- **Method**: `DELETE`
- **Permissions**: `IsTeacher` (must be the owner of the coupon)
- **Description**: Deletes a coupon.
- **URL Parameters**:
    - `coupon_id`: The ID of the coupon to delete.
- **Response (Success - 204 No Content)**: (No content, successful deletion)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 5.6. List Used Coupons
- **URL**: `/api/v1/coupon/used-coupons/`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves a list of coupons that have been used by students.
- **Response (Success - 200 OK)**:
    ```json
    [
        {
            "id": "integer",
            "coupon": {
                "id": "integer",
                "code": "string",
                "price": "decimal",
                "status": "string"
            },
            "student": {
                "user": {
                    "id": "integer",
                    "first_name": "string",
                    "last_name": "string",
                    "email": "string"
                },
                "full_name": "string"
            },
            "used_at": "datetime",
            "course": "string (course title) or null",
            "module": "string (module title) or null"
        }
    ]
    ```

---

### 6. Course Rating Management

#### 6.1. List Course Ratings
- **URL**: `/api/v1/courses/<uuid:course_id>/list-ratings/`
- **Method**: `GET`
- **Permissions**: `AllowAny`
- **Description**: Retrieves a list of ratings for a specific course.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Response (Success - 200 OK)**:
    ```json
    [
        {
            "id": "integer",
            "student": {
                "user": {
                    "id": "integer",
                    "first_name": "string",
                    "last_name": "string"
                },
                "full_name": "string"
            },
            "rating": "integer (1-5)",
            "comment": "string",
            "created_at": "datetime"
        }
    ]
    ```

#### 6.2. Create Course Rating
- **URL**: `/api/v1/courses/<uuid:course_id>/ratings/create/`
- **Method**: `POST`
- **Permissions**: `IsStudent`, `CanRateCourse`
- **Description**: Creates a new rating for a course. Students can only rate courses they are enrolled in.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Request Body**:
    ```json
    {
        "rating": "integer (1-5)",
        "comment": "string (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "id": "integer",
        "course": "string (course title)",
        "student": "string (student full name)",
        "rating": "integer",
        "comment": "string",
        "created_at": "datetime"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "rating": ["A valid integer is required.", "Ensure this value is greater than or equal to 1.", "Ensure this value is less than or equal to 5."],
        "non_field_errors": ["You have already rated this course."]
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You are not enrolled in this course."
    }
    ```

#### 6.3. Retrieve/Update/Delete Rating
- **URL**: `/api/v1/course/retrive-upadate-delete-ratings/<uuid:id>/`
- **Method**: `GET` / `PUT` / `PATCH` / `DELETE`
- **Permissions**: `IsAuthenticated` (Owner of the rating)
- **Description**: Retrieves, updates, or deletes a specific rating.
- **URL Parameters**:
    - `id`: The UUID of the rating.
- **Request Body (PUT/PATCH)**:
    ```json
    {
        "rating": "integer (1-5) (optional)",
        "comment": "string (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Rating details)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

---

### 7. Course Module Management

#### 7.1. List Course Modules
- **URL**: `/api/v1/courses/<uuid:course_id>/modules/`
- **Method**: `GET`
- **Permissions**: `IsAuthenticated`
- **Description**: Retrieves a list of modules for a specific course. If the user is a teacher, all modules are shown. If a student, only published modules are shown.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Response (Success - 200 OK)**:
    ```json
    [
        {
            "id": "uuid",
            "title": "string",
            "course": "string (course title)",
            "order": "integer",
            "price": "decimal",
            "is_free": "boolean",
            "total_lessons": "integer",
            "total_duration": "integer",
            "image_url": "url or null"
        }
        // ... more module objects
    ]
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 7.2. Create Course Module
- **URL**: `/api/v1/courses/<uuid:course_id>/modules/create/`
- **Method**: `POST`
- **Permissions**: `IsCourseOwner`
- **Description**: Creates a new module for a specific course.
- **URL Parameters**:
    - `course_id`: The UUID of the course.
- **Request Body**:
    ```json
    {
        "title": "string",
        "description": "string (optional)",
        "order": "integer",
        "image": "file (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "id": "uuid",
        "title": "string",
        "course": "string (course title)",
        "description": "string",
        "order": "integer",
        "total_lessons": "integer",
        "total_duration": "integer",
        "image_url": "url or null",
        "is_published": "boolean",
        "is_free": "boolean",
        "price": "decimal"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "title": ["Title must not be empty.", "Title must be at least 3 characters long."],
        "order": ["Module order must be greater than 0"],
        "image": ["The image must be JPG or PNG.", "Image size must be less than 2MB."],
        "non_field_errors": ["there is already course in this order"]
    }
    ```

#### 7.3. Course Module Detail
- **URL**: `/api/v1/modules/<uuid:module_id>/`
- **Method**: `GET`
- **Permissions**: `IsAuthenticated`
- **Description**: Retrieves details for a specific course module, including its lessons.
- **URL Parameters**:
    - `module_id`: The UUID of the module.
- **Response (Success - 200 OK)**:
    ```json
    {
        "id": "uuid",
        "title": "string",
        "course": "string (course title)",
        "order": "integer",
        "total_lessons": "integer",
        "total_duration": "integer",
        "image_url": "url or null",
        "lessons": [
            {
                "id": "uuid",
                "title": "string",
                "duration": "integer",
                "thumbnail": "url or null"
            }
            // ... more lesson objects (only published for students)
        ]
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 7.4. Update Course Module
- **URL**: `/api/v1/modules/<uuid:module_id>/update/`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsModuleOwner`
- **Description**: Updates an existing course module.
- **URL Parameters**:
    - `module_id`: The UUID of the module to update.
- **Request Body**: (Partial or full `CourseModuleUpdateSerializer` fields)
    ```json
    {
        "title": "string (optional)",
        "description": "string (optional)",
        "order": "integer (optional)",
        "is_published": "boolean (optional)",
        "image": "file (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Updated `CourseModuleDetailSerializer` fields)
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "title": ["Title must not be empty.", "Title must be at least 3 characters long."],
        "order": ["Module order must be greater than 0"],
        "image": ["The image must be JPG or PNG.", "Image size must be less than 2MB."],
        "non_field_errors": ["There is already a module with this order in the course."]
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 7.5. Delete Course Module
- **URL**: `/api/v1/modules/<uuid:module_id>/delete/`
- **Method**: `DELETE`
- **Permissions**: `IsModuleOwner`
- **Description**: Deletes a course module.
- **URL Parameters**:
    - `module_id`: The UUID of the module to delete.
- **Response (Success - 200 OK)**:
    ```json
    {
        "detail": "Module deleted successfully."
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 7.6. Module Enrollment
- **URL**: `/api/v1/course/module-enrollment/`
- **Method**: `POST`
- **Permissions**: `IsStudent`
- **Description**: Enrolls a student in a module, optionally using a coupon code.
- **Request Body**:
    ```json
    {
        "module_id": "uuid",
        "coupon_code": "string (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "id": "integer",
        "student": "integer (student ID)",
        "module": "uuid (module ID)",
        "status": "string",
        "is_active": "boolean"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "student": ["Student already enrolled in this module"],
        "coupon": ["Invalid coupon code", "Coupon has expired", "Coupon has reached its maximum uses", "Coupon is not active", "Coupon is not valid for this module", "Coupon status does not allow enrollment"],
        "module": ["Module is not published"],
        "user": ["You are not a student of this teacher."],
        "coupon_code": ["Coupon code is required for paid modules."]
    }
    ```

---

### 8. Lesson Management

#### 8.1. List Lessons in Module
- **URL**: `/api/v1/modules/<uuid:module_id>/lessons/`
- **Method**: `GET`
- **Permissions**: `IsModuleAccessible`
- **Description**: Retrieves a list of lessons for a specific module. Teachers see all lessons; students see only published lessons.
- **URL Parameters**:
    - `module_id`: The UUID of the module.
- **Response (Success - 200 OK)**:
    ```json
    [
        {
            "id": "uuid",
            "title": "string",
            "module": "string (module title)",
            "description": "string",
            "order": "integer",
            "is_published": "boolean",
            "is_free": "boolean",
            "duration": "integer (seconds)",
            "created_at": "datetime",
            "video_url": "url or null",
            "document_url": "url or null",
            "thumbnail_url": "url or null"
        }
        // ... more lesson objects
    ]
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 8.2. Create Lesson
- **URL**: `/api/v1/modules/<uuid:module_id>/lessons/create/`
- **Method**: `POST`
- **Permissions**: `IsModuleOwner`
- **Description**: Creates a new lesson within a specific module.
- **URL Parameters**:
    - `module_id`: The UUID of the module.
- **Request Body**:
    ```json
    {
        "title": "string",
        "description": "string (optional)",
        "order": "integer",
        "is_published": "boolean (optional)",
        "is_free": "boolean (optional)",
        "video": "file (optional)",
        "document": "file (optional)",
        "thumbnail": "file (optional)"
    }
    ```
- **Response (Success - 201 Created)**:
    ```json
    {
        "id": "uuid",
        "title": "string",
        "module": "string (module title)",
        "description": "string",
        "order": "integer",
        "is_published": "boolean",
        "is_free": "boolean",
        "duration": "integer (seconds)",
        "created_at": "datetime",
        "video_url": "url or null",
        "document_url": "url or null",
        "thumbnail_url": "url or null"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "duration": ["lesson duration must be greater than 0"],
        "order": ["lesson order must be greater than 0", "there is already lesson in this order"],
        "video": ["Unsupported extensions"],
        "document": ["The file must be in PDF or Word or powerpoint format."],
        "thumbnail": ["The image must be JPG or PNG or jpeg.", "Image larger than 2 MB"]
    }
    ```

#### 8.3. Lesson Detail
- **URL**: `/api/v1/lessons/<uuid:id>/`
- **Method**: `GET`
- **Permissions**: `IsLessonAccessible`
- **Description**: Retrieves details for a specific lesson. Accessible by the course teacher or an enrolled student if the lesson is published.
- **URL Parameters**:
    - `id`: The UUID of the lesson.
- **Response (Success - 200 OK)**: (Same as List Lessons in Module item)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You don't have permission to access this lesson."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 8.4. Update Lesson
- **URL**: `/api/v1/lessons/<uuid:id>/update/`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsModuleOwner`
- **Description**: Updates an existing lesson.
- **URL Parameters**:
    - `id`: The UUID of the lesson to update.
- **Request Body**: (Partial or full `LessonCreateUpdateSerializer` fields)
    ```json
    {
        "title": "string (optional)",
        "description": "string (optional)",
        "order": "integer (optional)",
        "is_published": "boolean (optional)",
        "is_free": "boolean (optional)",
        "video": "file (optional)",
        "document": "file (optional)",
        "thumbnail": "file (optional)"
    }
    ```
- **Response (Success - 200 OK)**: (Updated `LessonDetailSerializer` fields)
- **Response (Error - 400 Bad Request)**: (Same as Create Lesson errors)
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 8.5. Delete Lesson
- **URL**: `/api/v1/lessons/<uuid:id>/delete/`
- **Method**: `DELETE`
- **Permissions**: `IsModuleOwner`
- **Description**: Deletes a lesson.
- **URL Parameters**:
    - `id`: The UUID of the lesson to delete.
- **Response (Success - 200 OK)**:
    ```json
    {
        "detail": "Lesson deleted successfully."
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You do not have permission to perform this action."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 8.6. Update Lesson Progress
- **URL**: `/api/v1/lessons/<uuid:id>/status/`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsAuthenticated`, `IsLessonAccessible`
- **Description**: Updates the progress of a specific lesson for the authenticated student. A `StudentLessonProgress` object must already exist for the student and lesson. This is typically created automatically when a student enrolls in a course.
- **URL Parameters**:
    - `id`: The UUID of the lesson.
- **Request Body**:
    ```json
    {
        "is_completed": "boolean"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "id": "integer",
        "is_completed": "boolean"
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You don't have permission to access this lesson."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

#### 8.7. Check Video Status
- **URL**: `/api/v1/video/check-status/<lesson_id>`
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Checks the processing status of a video associated with a lesson.
- **URL Parameters**:
    - `lesson_id`: The UUID of the lesson.
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "video is ready"
    }
    ```
    or
    ```json
    {
        "message": "video is uploading"
    }
    ```
    or
    ```json
    {
        "message": "Video status: [status]"
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "message": "Video processing failed. Please try uploading again."
    }
    ```
- **Response (Error - 404 Not Found)**:
    ```json
    {
        "detail": "Not found."
    }
    ```

---

### 9. Video Management

#### 9.1. Get VdoCipher Upload Credentials
- **URL**: `/api/v1/course/create-vdocipher-upload-credentials/`
- **Method**: `POST`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves VdoCipher upload credentials for a given video title. This is the first step in uploading a video.
- **Request Body**:
    ```json
    {
        "title": "string"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "status": "success",
        "data": {
            "upload_url": "string",
            "upload_id": "string",
            "vdo_cipher_video_id": "string"
        }
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "error": "string" // e.g., "Title is required." or an error from VdoCipher API
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You are not a Teacher."
    }
    ```

---

### 10. Assessment Management

#### 10.1. Teacher: List/Create Assessments
- **URL**: `/api/v1/teacher/assessments/`
- **Method**: `GET` / `POST`
- **Permissions**: `IsTeacher`
- **Description**: Lists assessments created by the teacher or creates a new assessment.
- **Request Body (POST)**:
    ```json
    {
        "title": "string",
        "description": "string (optional)",
        "course": "uuid (optional, if creating for a specific course)",
        "assessment_type": "string (e.g., 'quiz', 'exam')",
        "passing_grade": "float (optional)"
    }
    ```
- **Response (Success - 200 OK / 201 Created)**: (Details of the assessment(s))

#### 10.2. Teacher: Retrieve/Update/Delete Assessment
- **URL**: `/api/v1/teacher/assessments/<uuid:assessment_id>/`
- **Method**: `GET` / `PUT` / `PATCH` / `DELETE`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves, updates, or deletes a specific assessment.
- **URL Parameters**:
    - `assessment_id`: The UUID of the assessment.
- **Response (Success - 200 OK / 204 No Content)**: (Details of the assessment or success message)

#### 10.3. Teacher: List/Create Questions for Assessment
- **URL**: `/api/v1/teacher/assessments/<uuid:assessment_id>/questions/`
- **Method**: `GET` / `POST`
- **Permissions**: `IsTeacher`
- **Description**: Lists questions for a specific assessment or creates a new question for it.
- **Request Body (POST)**:
    ```json
    {
        "question_text": "string",
        "question_type": "string (e.g., 'multiple_choice', 'true_false', 'short_answer')",
        "points": "integer",
        "options": "array of option objects (for multiple choice/true false)"
    }
    ```
- **Response (Success - 200 OK / 201 Created)**: (Details of the question(s))

#### 10.4. Teacher: Retrieve/Update/Delete Question
- **URL**: `/api/v1/teacher/assessments/questions/<uuid:question_id>/`
- **Method**: `GET` / `PUT` / `PATCH` / `DELETE`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves, updates, or deletes a specific question.
- **URL Parameters**:
    - `question_id`: The UUID of the question.
- **Response (Success - 200 OK / 204 No Content)**: (Details of the question or success message)

#### 10.5. Teacher: List/Create Options for Question
- **URL**: `/api/v1/teacher/questions/<uuid:question_id>/options/`
- **Method**: `GET` / `POST`
- **Permissions**: `IsTeacher`
- **Description**: Lists options for a specific question or creates new options.
- **Request Body (POST)**:
    ```json
    {
        "option_text": "string",
        "is_correct": "boolean"
    }
    ```
- **Response (Success - 200 OK / 201 Created)**: (Details of the option(s))

#### 10.6. Teacher: Retrieve/Update/Delete Option
- **URL**: `/api/v1/teacher/questions/options/<uuid:option_id>/`
- **Method**: `GET` / `PUT` / `PATCH` / `DELETE`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves, updates, or deletes a specific option for a question.
- **URL Parameters**:
    - `option_id`: The UUID of the option.
- **Response (Success - 200 OK / 204 No Content)**: (Details of the option or success message)

#### 10.7. Student: List Assessments
- **URL**: `/api/v1/student/assessments/<str:teacher_username>/`
- **Method**: `GET`
- **Permissions**: `IsStudent`
- **Description**: Lists assessments available from a specific teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher.
- **Response (Success - 200 OK)**: (List of assessments)

#### 10.8. Student: Start Assessment
- **URL**: `/api/v1/student/assessments/<uuid:assessment_id>/<str:teacher_username>/start/`
- **Method**: `POST`
- **Permissions**: `IsStudent`
- **Description**: Starts an assessment attempt for the student.
- **URL Parameters**:
    - `assessment_id`: The UUID of the assessment.
    - `teacher_username`: The username of the teacher.
- **Request Body**: None
- **Response (Success - 201 Created)**:
    ```json
    {
        "attempt_id": "uuid",
        "assessment_title": "string",
        "questions": [
            {
                "question_id": "uuid",
                "question_text": "string",
                "question_type": "string",
                "points": "integer",
                "options": [
                    {
                        "option_id": "uuid",
                        "option_text": "string"
                    }
                    // ... more options
                ]
            }
            // ... more questions
        ]
    }
    ```

#### 10.9. Student: Submit Assessment Attempt
- **URL**: `/students/attempts/<uuid:attempt_id>/submit/`
- **Method**: `POST`
- **Permissions**: `IsStudent`
- **Description**: Submits an assessment attempt with student answers.
- **URL Parameters**:
    - `attempt_id`: The UUID of the assessment attempt.
- **Request Body**:
    ```json
    {
        "answers": [
            {
                "question_id": "uuid",
                "selected_option_id": "uuid (optional, for multiple choice)",
                "short_answer_text": "string (optional, for short answer)"
            }
            // ... more answers
        ]
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "message": "Assessment submitted successfully. Results will be available shortly."
    }
    ```

#### 10.10. Student: List All Attempts
- **URL**: `/student/<str:teacher_username>/attempts/`
- **Method**: `GET`
- **Permissions**: `IsStudent`
- **Description**: Lists all assessment attempts made by the student for a given teacher.
- **URL Parameters**:
    - `teacher_username`: The username of the teacher.
- **Response (Success - 200 OK)**: (List of attempt summaries)

#### 10.11. Student: Attempt Result
- **URL**: `/student/attempts/<uuid:attempt_id>/result/`
- **Method**: `GET`
- **Permissions**: `IsStudent`
- **Description**: Retrieves the result of a specific assessment attempt.
- **URL Parameters**:
    - `attempt_id`: The UUID of the assessment attempt.
- **Response (Success - 200 OK)**:
    ```json
    {
        "assessment_title": "string",
        "total_score": "float",
        "passing_grade": "float",
        "is_passed": "boolean",
        "answers": [
            {
                "question_text": "string",
                "question_type": "string",
                "points_awarded": "integer",
                "correct_answer": "string",
                "student_answer": "string",
                "is_correct": "boolean"
            }
            // ... more answers
        ]
    }
    ```

#### 10.12. Teacher: Pending Grading List
- **URL**: `/api/v1/teacher/grading/pending/` (and other variations with course/assessment/question filters)
- **Method**: `GET`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves a list of assessment answers that require manual grading by the teacher. Supports filtering by course, assessment, or question type.
- **Response (Success - 200 OK)**: (List of pending grading items)

#### 10.13. Teacher: Grade Specific Answer
- **URL**: `/api/v1/teacher/grading/answer/<uuid:answer_id>/`
- **Method**: `PUT` / `PATCH`
- **Permissions**: `IsTeacher`
- **Description**: Allows the teacher to grade a specific answer that requires manual grading.
- **URL Parameters**:
    - `answer_id`: The UUID of the answer to grade.
- **Request Body**:
    ```json
    {
        "points_awarded": "integer"
    }
    ```
- **Response (Success - 200 OK)**: (Confirmation message)

---

### 11. Video Management

#### 11.1. Get VdoCipher Upload Credentials
- **URL**: `/api/v1/course/create-vdocipher-upload-credentials/`
- **Method**: `POST`
- **Permissions**: `IsTeacher`
- **Description**: Retrieves VdoCipher upload credentials for a given video title. This is the first step in uploading a video.
- **Request Body**:
    ```json
    {
        "title": "string"
    }
    ```
- **Response (Success - 200 OK)**:
    ```json
    {
        "status": "success",
        "data": {
            "upload_url": "string",
            "upload_id": "string",
            "vdo_cipher_video_id": "string"
        }
    }
    ```
- **Response (Error - 400 Bad Request)**:
    ```json
    {
        "error": "string" // e.g., "Title is required." or an error from VdoCipher API
    }
    ```
- **Response (Error - 403 Forbidden)**:
    ```json
    {
        "detail": "You are not a Teacher."
    }
    ```
