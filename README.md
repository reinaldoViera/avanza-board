# AvanzaBoard

A modern, AI-powered task management application built with Next.js, Firebase, and OpenAI.

## Features

- User authentication with Firebase
- Role-based access control
- Kanban board with drag-and-drop functionality
- AI-powered task suggestions and insights
- Real-time collaboration
- Dark/Light mode support
- Responsive design

## Tech Stack

- Frontend: React 19, Next.js 15
- Styling: Tailwind CSS
- Backend: Firebase (Firestore, Functions, Auth)
- AI: OpenAI API integration
- Animation: Framer Motion

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
OPENAI_API_KEY=
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable components
├── lib/                 # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── features/           # Feature-specific components and logic
```

## License

MIT
