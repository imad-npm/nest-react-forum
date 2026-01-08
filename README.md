# nest-react-forum
# Community Forum

A full-stack social platform built with NestJS (backend) and React (frontend). Supports communities, posts, nested comments, reactions, moderation, notifications, and user management.

## Features

- **Authentication**
  - Login/register with email/password
  - Google OAuth
  - Email verification
  - Password reset
  - JWT + refresh token flow

- **Users & Profiles**
  - User profiles with display name, bio, avatar
  - Profile page viewing

- **Communities**
  - Create/join communities
  - Public/private types
 
- **Posts**
  - Create posts in communities
  - Feed (home) with posts from joined communities
  - Post detail view
  - Like/dislike reactions
  - Comment count and view count

- **Comments**
  - Nested/reply comments (multi-level)
  - Infinite scroll loading
  - Like/dislike reactions
  - Reply input with cancel

- **Reactions**
  - Like/dislike on posts and comments
  - Counter updates via subqueries

- **Notifications**
  - Real-time via SSE (new posts, comments, reactions)
 

- **Moderation Tools** (per community)
  - Moderation queues
  - Member management
  - Moderator management
  - Restricted users (ban/mute with reason and expiry)

- **Settings**
  - User settings page
  - Email change verification

- **UI Components**
  - Reusable components: Button, Input, Textarea, Modal, Toast, Dropdown, Select, SearchableSelect, Label, InputError
  - Tailwind CSS styling
  - Toast notifications
  - Infinite scroll hook

## Tech Stack

### Backend (NestJS)
- TypeORM with SQLite (migrations and seeds provided)
- Entities: User, Profile, Post, Comment, Community, CommunityMembership, CommunityRestriction, Reaction, Notification
- Factories and comprehensive seed scripts for development data
- RTK Query-compatible API endpoints

### Frontend (React)
- React Router v6 with protected routes
- Redux Toolkit + RTK Query for state and data fetching
- Infinite queries for posts/comments
- Toast provider
- Custom hooks (infinite scroll, auth, notifications SSE)
- Layouts: MainLayout (sidebar), ModLayout (moderation sidebar)


## Getting Started

### Backend Setup

1. Install dependencies: `npm install`
2. Run migrations: `npm run migration:run`
3. Seed the database: `npm run seed` 


4. Start server: `npm run start:dev`

### Frontend Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

