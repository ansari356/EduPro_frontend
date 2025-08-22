# EduPro Frontend

A modern, responsive React-based frontend application for an educational platform that connects educators and students. EduPro provides a comprehensive learning management system with course creation, student enrollment, progress tracking, and analytics.

## 🚀 Project Overview

EduPro is a full-featured educational platform that enables educators to create and manage courses while providing students with an intuitive learning experience. The platform supports course creation, student enrollment, lesson progress tracking, coupon management, and comprehensive analytics.

## 📋 Table of Contents

- [Features](#-features)
- [User Stories](#-user-stories)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Guide](#-setup-guide)
- [API Integration](#-api-integration)
- [Routing Structure](#-routing-structure)
- [Component Architecture](#-component-architecture)
- [State Management](#-state-management)
- [Development Scripts](#-development-scripts)
- [Contributing](#-contributing)

## ✨ Features

### For Educators
- **Course Management**: Create, edit, and manage courses with modules and lessons
- **Student Management**: View enrolled students, track progress, and manage student accounts
- **Analytics Dashboard**: Monitor course performance, revenue, and student engagement
- **Coupon System**: Create and manage discount coupons for course enrollment
- **Profile Management**: Update educator profile and course information

### For Students
- **Course Discovery**: Browse and enroll in courses from different educators
- **Learning Interface**: Access course content, track progress, and mark lessons complete
- **Profile Management**: Update personal information and view learning analytics
- **Course Ratings**: Submit ratings and feedback for completed courses

## 👥 User Stories

### Educator User Stories
1. **As an educator, I want to create courses** so that I can share my knowledge with students
2. **As an educator, I want to manage my courses** so that I can keep content updated and relevant
3. **As an educator, I want to view student progress** so that I can provide better support
4. **As an educator, I want to create coupons** so that I can offer discounts and increase enrollment
5. **As an educator, I want to view analytics** so that I can understand course performance and revenue

### Student User Stories
1. **As a student, I want to browse courses** so that I can find relevant learning opportunities
2. **As a student, I want to enroll in courses** so that I can access educational content
3. **As a student, I want to track my progress** so that I can monitor my learning journey
4. **As a student, I want to rate courses** so that I can provide feedback to educators
5. **As a student, I want to manage my profile** so that I can keep my information updated

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.0** - Modern React with latest features
- **Vite 7.0.0** - Fast build tool and development server
- **React Router DOM 7.6.3** - Client-side routing

### UI Libraries & Styling
- **Bootstrap 5.3.7** - CSS framework for responsive design
- **React Bootstrap 2.10.10** - Bootstrap components for React
- **Bootstrap Icons 1.13.1** - Icon library
- **Framer Motion 12.23.12** - Animation library
- **Lucide React 0.525.0** - Modern icon library

### Data Management & API
- **Axios 1.10.0** - HTTP client for API requests
- **React Query (TanStack) 5.81.5** - Server state management
- **SWR 2.3.4** - Data fetching and caching
- **React Hook Form 7.59.0** - Form handling and validation

### Charts & Visualization
- **Chart.js 4.5.0** - Charting library
- **React Chart.js 2 5.3.0** - React wrapper for Chart.js
- **Recharts 3.1.2** - Composable charting library

### Additional Libraries
- **React Dropzone 14.3.8** - File upload handling
- **React Calendar 6.0.0** - Calendar component
- **QR Code React 4.2.0** - QR code generation
- **React Intersection Observer 9.16.0** - Intersection observer hooks
- **React Scrollspy 3.4.3** - Scroll-based navigation

### Development Tools
- **ESLint 9.29.0** - Code linting and formatting
- **TypeScript types** - Type definitions for React

## 🏗️ Project Structure

```
EduPro_frontend/
├── public/                          # Static assets
├── src/
│   ├── apis/                       # API integration layer
│   │   ├── actions/                # API action functions
│   │   │   ├── educator/           # Educator-specific API actions
│   │   │   └── student/            # Student-specific API actions
│   │   ├── endpoints/              # API endpoint definitions
│   │   ├── hooks/                  # Custom hooks for data fetching
│   │   │   ├── educator/           # Educator data hooks
│   │   │   └── student/            # Student data hooks
│   │   └── base.js                 # Base API configuration
│   ├── assets/                     # Static assets (images, icons)
│   ├── components/                 # Reusable UI components
│   │   ├── auth/                   # Authentication components
│   │   ├── common/                 # Shared components
│   │   │   ├── Footers/            # Footer components
│   │   │   ├── Headers/            # Header components
│   │   │   └── Sidebar/            # Sidebar components
│   │   └── layout/                 # Layout wrapper components
│   ├── pages/                      # Page components
│   │   ├── Educator/               # Educator-specific pages
│   │   ├── Student/                # Student-specific pages
│   │   └── home.jsx                # Home page
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   ├── index.css                   # Global styles
│   └── pagePaths.js                # Route path constants
├── package.json                     # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── eslint.config.js                # ESLint configuration
```

## 🚀 Setup Guide

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EduPro_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - The application is configured to connect to a backend API at `http://localhost:8000`
   - Ensure your backend server is running on the specified port
   - Update the base URL in `src/apis/base.js` if needed

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## 🔌 API Integration

### Base Configuration
- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: Cookie-based authentication with credentials
- **Headers**: JSON content type with credentials support

### API Structure
- **Educator APIs**: Course management, student management, analytics
- **Student APIs**: Course enrollment, progress tracking, profile management
- **Authentication APIs**: Login, registration, token refresh

### Data Fetching Strategy
- **React Query**: For server state management and caching
- **SWR**: For data fetching and real-time updates
- **Axios**: For HTTP requests with interceptors

## 🛣️ Routing Structure

### Public Routes
- `/` - Home page with course discovery
- `/:educatorUsername` - Public educator profile and courses
- `/login` - Educator login
- `/signup` - Educator registration
- `/:educatorUsername/login` - Student login for specific educator
- `/:educatorUsername/signup` - Student registration for specific educator

### Protected Educator Routes
- `/educator` - Educator profile dashboard
- `/courses` - Course management
- `/courses/create` - Create new course
- `/courses/:id` - Course details and management
- `/courses/edit/:courseId` - Edit existing course
- `/students` - Student management
- `/students/:studentId` - Individual student details
- `/coupons` - Coupon management

### Protected Student Routes
- `/:educatorUsername/student/profile` - Student profile
- `/:educatorUsername/student/courses` - Enrolled courses
- `/:educatorUsername/student/courses/:id` - Course learning interface

## 🧩 Component Architecture

### Layout Components
- **MainNavbarLayout**: Public pages with main header/footer
- **EducatorNavbarLayout**: Educator dashboard with sidebar navigation
- **StudentNavbarLayout**: Student interface with course navigation
- **StudentMainNavbarLayout**: Student public pages

### Authentication Components
- **EducatorProtectedRoutes**: Route protection for educators
- **StudentProtectedRoutes**: Route protection for students
- **EducatorRedirectIfLogedin**: Redirect logic for authenticated educators
- **StudentRedirectIfLogedin**: Redirect logic for authenticated students

### Common Components
- **Headers**: Different header variants for different user types
- **Footers**: Consistent footer across the application
- **Sidebar**: Navigation sidebar for educator dashboard
- **MainLoader**: Loading states and spinners

## 📊 State Management

### Server State
- **React Query**: Manages server state, caching, and synchronization
- **SWR**: Handles data fetching with real-time updates
- **Custom Hooks**: Encapsulate data fetching logic for different entities

### Local State
- **React Hooks**: useState, useEffect for component-level state
- **Form State**: React Hook Form for form management and validation
- **Route State**: React Router for navigation and URL state

## 🔧 Development Workflow

### Code Quality
- **ESLint**: Code linting and formatting
- **React Hooks Rules**: Enforced through ESLint plugins
- **Consistent Code Style**: Maintained through linting rules

### Development Features
- **Hot Module Replacement**: Fast development with Vite
- **Type Checking**: TypeScript definitions for better development experience
- **Error Boundaries**: Graceful error handling in React components

## 🤝 Contributing

### Development Guidelines
1. Follow the existing code structure and naming conventions
2. Use functional components with hooks
3. Implement proper error handling and loading states
4. Write clean, readable code with appropriate comments
5. Test your changes thoroughly before submitting

### Code Organization
- Keep components focused and single-responsibility
- Use consistent file naming conventions
- Organize imports logically
- Maintain separation of concerns between UI and business logic

## 📱 Responsive Design

The application is built with a mobile-first approach using Bootstrap 5, ensuring optimal user experience across all device sizes:
- **Mobile**: Optimized for small screens with touch-friendly interfaces
- **Tablet**: Responsive layouts that adapt to medium screens
- **Desktop**: Full-featured interfaces with advanced navigation options

## 🔒 Security Features

- **Protected Routes**: Authentication-based access control
- **Secure API Calls**: Credential-based authentication
- **Input Validation**: Form validation and sanitization
- **Route Guards**: Prevent unauthorized access to protected areas

## 🚀 Performance Optimizations

- **Code Splitting**: Route-based code splitting for better performance
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized asset delivery
- **Caching Strategy**: Efficient data caching with React Query and SWR

## 📈 Future Enhancements

- **Real-time Features**: Live chat and notifications
- **Advanced Analytics**: Enhanced reporting and insights
- **Mobile App**: Native mobile application
- **Offline Support**: Progressive Web App capabilities
- **Multi-language Support**: Internationalization features

---

**EduPro Frontend** - Empowering education through technology

For more information, contact the development team or refer to the backend API documentation.
