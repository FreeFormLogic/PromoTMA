# Overview

This project is a full-stack web application designed as a Telegram Mini Apps directory and showcase platform. Its core purpose is to serve as a business catalog and marketing tool, highlighting modular Mini App solutions. The platform enables users to explore various app modules, industry-specific solutions, pricing models, and development processes, primarily targeting businesses seeking rapid Telegram Mini App deployment using pre-built components. The platform aims to provide a universal AI analysis system for module selection, capable of intelligently analyzing any business niche by semantically matching business processes with module capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript, using a component-based architecture. It leverages Tailwind CSS with shadcn/ui for consistent UI, Wouter for routing, and TanStack React Query for server state management. Vite is used for development and optimized builds.

## Backend Architecture
The server follows a RESTful API design pattern using Express.js with TypeScript. It features modular route structures and integrates with the Vite development environment.

## Authentication System
The application uses a simplified, one-click authentication system with local storage for client-side session persistence (24-hour expiry) and automatic unique user generation. An admin panel manages a server-side whitelist for specific Telegram IDs, ensuring only authorized users can access the platform.

## Database and ORM
Drizzle ORM is used for type-safe database operations and migrations. Schema definitions are centralized with Zod integration for runtime type validation.

## Component Architecture
A comprehensive design system is implemented using Radix UI primitives, featuring CSS custom properties for theming and dark mode support. It supports a mobile-first responsive design using Tailwind CSS and includes built-in accessibility through Radix UI components.

## Data Management
The application manages data entities including Modules (Mini App components, over 260 entries), Industries, USPs, Objections, Users (authorization status), and AI Chat Analytics. AI chat tracking includes comprehensive statistics such as token usage, costs, session duration, message history, and user activity patterns with real-time cost calculation.

## UI/UX Decisions
The platform utilizes a strict blue/white color scheme. It features enhanced mobile navigation with a bottom-right floating button and bottom-screen menu. The AI chat provides gradual, personalized module recommendations, prevents duplicates, and offers real-time business insights. Module modals include gradient backgrounds and markdown formatting support. The pricing display is standardized. A unified modal system is used across AI chat and the module catalog for consistent content display. **Recent Update (Aug 18, 2025)**: Fixed AI chat module display to show descriptions sequentially before module cards instead of separating descriptions from modules, providing better user experience with clearer module-description pairing.

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
- **Google Analytics**: For user tracking.
- **Yandex.Metrika**: With webvisor, clickmap, and ecommerce tracking.