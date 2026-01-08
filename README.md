# nest-react-forum


# ForumStack

A full-stack, community-driven forum platform built with a high-performance **NestJS** backend and a reactive **React** frontend. This project demonstrates advanced architectural patterns for handling complex data relationships and scalable database operations.

## 🚀 Technical Highlights

* 
**Recursive Threaded Discussions:** Implemented an infinite-depth nested commenting system using a hierarchical data model.


* 
**SQL Performance Optimization:** Utilized **raw SQL subqueries** within TypeORM to eliminate N+1 performance issues for real-time counters (likes, dislikes, and comments).


* 
**Granular Moderation & RBAC:** Developed a sophisticated Role-Based Access Control (RBAC) system for communities, including moderator ranks and automated restriction logic for timed **Bans** and **Mutes**.


* 
**Dynamic Notification Engine:** Built an event-driven system to deliver context-aware notifications across various resource types (Posts, Comments, Reactions).


* **Advanced Frontend UX:** Integrated the **Intersection Observer API** to handle performant infinite scrolling for large discussion threads.

## 🛠️ Tech Stack

* **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL/SQLite.
* **Frontend:** React, TypeScript, Redux Toolkit, Tailwind CSS.
* 
**Workflow:** Automated database migrations and factory-based data seeding with Faker.js.