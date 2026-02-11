# 🎓 VU Portal - University Management System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.8-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

A comprehensive, role-based university management portal designed to streamline academic operations. Built with modern web technologies, it provides a seamless experience for administrators, faculty, and students.

## 🌟 Key Features

### 🛠️ Admin Dashboard
*   **Centralized Overview:** Real-time analytics on student enrollment, faculty count, and course distribution.
*   **User Management:** Efficient tools to add, update, and manage student and teacher profiles.
*   **Academic Infrastructure:** Organize departments and define course catalogs.
*   **Settings Control:** Manage portal-wide configurations and system preferences.

### 👨‍🏫 Teacher Portal
*   **Academic Tracking:** Manage assigned courses and view student rosters.
*   **Attendance Management:** Digital attendance tracking with session-wise marking.
*   **Resource Sharing:** (In development) Ability to share course materials and assignments.

### 🎓 Student Interface
*   **One-Click Registration:** Browse available courses and register instantly based on department and semester.
*   **Attendance Tracking:** Monitor personal attendance records and percentages for each course.
*   **Academic Dashboard:** Quick view of enrolled courses, upcoming sessions, and notifications.
*   **Mobile-Friendly Design:** Access the portal from any device with a fully responsive UI.

## 🚀 Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
*   **Backend & DB:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
*   **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth)
*   **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

## ⚙️ Getting Started

### Prerequisites

*   Node.js 18.x or later
*   Firebase Project (for DB and Auth)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Abdullah-warraich-ch/University-Portal.git
    cd University-Portal
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root and add your Firebase credentials:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔑 Demo Credentials

Access the different portals using the credentials below:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@university.com` | `admin123` |
| **Teacher** | `teacher@university.com` | `teacher123` |
| **Student** | `student@university.com` | `student123` |

> **Note:** Ensure these users are created in your Firebase Auth and have a corresponding document in the `users` collection with the matching `role` field (`admin`, `teacher`, or `student`).

## 📂 Folder Structure

```text
src/
├── app/
│   ├── (Dashboard)/   # Role-specific layouts and pages (Admin/Teacher/Student)
│   ├── login/         # Unified authentication page
│   ├── Context.tsx    # Firebase Global State Provider
│   └── Firebase.ts    # Firebase Initialization
├── components/        # Reusable UI components (Shadcn/UI)
├── proxy.ts           # Middleware for route protection
└── globals.css        # Global styles and Tailwind tokens
```

## 🤝 Contributing

Contributions make the open-source community an amazing place!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Developed by [Abdullah Warraich](https://github.com/Abdullah-warraich-ch)

