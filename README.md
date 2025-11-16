# Learning Management System (LMS)

## Project Overview

* **Name:** Edura
* **One-liner:** A full-featured LMS platform enabling users to enroll in courses, track progress, leave reviews, and manage content efficiently.
* **Repo:** [GitHub Repository](https://github.com/CodesBy-Asif/LMS)
* **Demo:** [Live Demo](https://edura-lms.vercel.app/)

**Goals:**

* Allow users to browse, enroll, and complete courses.
* Enable admins to manage courses, users, and analytics.
* Provide real-time progress tracking and course content delivery.


## Tech Stack
| Layer            | Technology                     | Reason / Benefit                                                    |
| ---------------- | ------------------------------ | ------------------------------------------------------------------- |
| Frontend         | Next.js + React + TypeScript   | SSR/SSG for SEO, modular UI, type safety                            |
| State Management | Redux                          | Centralized state for courses, users, and progress                  |
| Styling          | CSS / Tailwind                 | Rapid styling, consistency, responsive design                       |
| Backend          | Node.js + Express + TypeScript | Fast, non-blocking, modular REST API, type safety                   |
| Database         | MongoDB + Mongoose             | Flexible schema for courses, users, enrollments                     |
| Authentication   | JWT / NextAuth                 | Secure token-based auth, OAuth support                              |
| Storage          | Cloudinary                     | Optimized media storage and CDN delivery                            |
| Email            | NodeMailer / EJS Templates     | Dynamic email notifications and confirmations                       |
| Caching          | Redis                          | Fast access to session data, analytics, and frequently queried info |



## System Architecture

```mermaid
flowchart TB
    subgraph Client
        Browser[Browser / Mobile]
    end
    
    subgraph Frontend["Next.js + React"]
        Router[Next.js Routing]
        Redux[Redux Store]
        UI[UI Components]
    end
    
    subgraph Backend["Node.js + Express"]
        API[API Routes]
        Auth[Auth Middleware]
        Controllers[Controllers]
        Services[Services]
        Utils[Utilities]
    end
    
    subgraph Database["MongoDB + Mongoose"]
        Users[(Users)]
        Courses[(Courses)]
        Enrollments[(Enrollments)]
        Reviews[(Reviews)]
        Analytics[(Analytics)]
    end
    
    subgraph External["External Services"]
        Cloudinary[Cloudinary CDN]
        Redis[Redis Cache]
        NodeMailer[Email / EJS Templates]
    end
    
    Browser --> Router
    Router --> Redux
    Redux --> UI
    UI --> API
    API --> Auth
    Auth --> Controllers
    Controllers --> Services
    Services --> Users
    Services --> Courses
    Services --> Enrollments
    Services --> Reviews
    Services --> Analytics
    Services --> Cloudinary
    Services --> NodeMailer
    Services --> Redis
```



## Database ER Diagram

```mermaid
erDiagram
    User ||--o{ Enrollment : enrolls
    User ||--o{ Review : writes
    User ||--o{ Message : sends
    Course ||--o{ Enrollment : has
    Course ||--o{ Review : receives
    Course ||--o{ Module : contains
    Module ||--o{ Lesson : contains
    Lesson ||--o{ Resource : includes
    Admin ||--o{ Course : manages
    Category ||--o{ Course : categorizes

    User {
        string name
        string email
        string password
        string role
        string avatar
        date createdAt
        boolean isActive
    }

    Course {
        string title
        string description
        string categoryId
        array modules
        number price
        number discount
        array resources
        objectId createdBy
        date createdAt
    }

    Module {
        string title
        string description
        number order
        objectId courseId
    }

    Lesson {
        string title
        string contentType
        string contentUrl
        number order
        objectId moduleId
    }

    Resource {
        string type
        string title
        string url
        objectId courseId
        objectId lessonId
    }

    Enrollment {
        objectId userId
        objectId courseId
        number progress
        date enrolledAt
        string status
    }

    Review {
        objectId userId
        objectId courseId
        number rating
        string comment
        date createdAt
    }
```



## User Flows

### Enrollment Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Browse courses
    Frontend->>Backend: GET /api/courses
    Backend->>Database: Fetch courses
    Database-->>Backend: Course data
    Backend-->>Frontend: Return course list
    User->>Frontend: Enroll in course
    Frontend->>Backend: POST /api/enrollments
    Backend->>Database: Save enrollment
    Database-->>Backend: Success
    Backend-->>Frontend: Enrollment confirmation
```

### Progress Tracking Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Access lesson
    Frontend->>Backend: GET /api/courses/:id/modules
    Backend->>Database: Retrieve lessons
    Database-->>Backend: Lesson data
    Backend-->>Frontend: Send lessons
    User->>Frontend: Complete lesson
    Frontend->>Backend: PUT /api/progress
    Backend->>Database: Update progress
    Database-->>Backend: Progress updated
    Backend-->>Frontend: Show updated progress
```


## Key Features

### User

* Course browsing, search, and filtering
* Enrollment and progress tracking
* Reviews and ratings
* Messaging with admins

### Admin

* Manage courses, modules, and lessons
* Track enrollments and progress analytics
* Manage categories, FAQ, and hero sections
* Generate reports and monitor system usage

### Core Features

* Responsive design
* JWT / NextAuth authentication
* Cloud-based media storage (Cloudinary)
* Email notifications (NodeMailer + EJS templates)
* Caching with Redis for faster response


