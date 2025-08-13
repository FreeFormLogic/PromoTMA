# Overview

This project is a full-stack web application serving as a Telegram Mini Apps directory and showcase platform. Its primary purpose is to function as a business catalog and marketing tool, highlighting modular Mini App solutions. The platform enables users to explore various app modules, industry-specific solutions, pricing models, and development processes, targeting businesses seeking rapid Telegram Mini App deployment using pre-built components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript, leveraging a modern component-based architecture. It uses Tailwind CSS with shadcn/ui for consistent UI, Wouter for lightweight routing, and TanStack React Query for server state management. Vite is used for fast development and optimized builds.

## Backend Architecture
The server follows a RESTful API design pattern using Express.js with TypeScript. It features modular route structures for authentication, modules, and industry data, integrating seamlessly with the Vite development environment.

## Authentication System
The application employs a simplified, one-click authentication system. It uses local storage for client-side session persistence with a 24-hour expiry, automatically generating unique users. A dedicated admin panel at `/admin` (password protected) manages whitelist access for specific Telegram IDs. The system strictly blocks unauthorized users.

## Database and ORM
Drizzle ORM is used for type-safe database operations and migrations, with schema definitions centralized and Zod integration for runtime type validation.

## Component Architecture
A comprehensive design system is implemented using Radix UI primitives, with CSS custom properties for theming and dark mode support. It features a mobile-first responsive design using Tailwind CSS and built-in accessibility through Radix UI components.

## Data Management
The application manages data entities including Modules (Mini App components), Industries (industry-specific solutions), USPs, Objections (FAQ), and Users (authorization status). The module database has been expanded to 260+ entries across various categories like additional services, automation, industry solutions, analytics, security, communications, social commerce, and AI-driven solutions.

## UI/UX Decisions
The platform enforces a strict blue/white color scheme. It features enhanced mobile navigation with a bottom-right floating button and bottom-screen menu opening. The AI chat provides gradual, personalized module recommendations, preventing duplicates and offering real-time business insights. Module modals include gradient backgrounds and markdown formatting support. The pricing display is standardized at $10,000.

# External Dependencies

## Database Services
- **PostgreSQL**: Primary database.
- **Neon Database**: Cloud PostgreSQL provider.

## UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.

## Development Tools
- **TypeScript**: Static type checking.
- **Vite**: Modern build tool.
- **ESBuild**: Fast JavaScript bundler.

## Runtime Libraries
- **React Hook Form**: Form handling with validation.
- **TanStack React Query**: Data fetching and state management.
- **Wouter**: Lightweight routing.
- **Date-fns**: Date manipulation.
- **clsx/class-variance-authority**: Dynamic className generation.

## Session Management
- **connect-pg-simple**: PostgreSQL session store.

## Analytics
- **Google Analytics**: For user tracking (G-FMM4BECLK5).
- **Yandex.Metrika**: With webvisor, clickmap, and ecommerce tracking (103742841).