# Overview

This is a full-stack web application for a Telegram Mini Apps directory and showcase platform. The application serves as a business catalog and marketing tool for showcasing modular Mini App solutions, allowing users to explore different app modules, industry-specific solutions, pricing models, and development processes. The platform appears to target businesses looking to deploy Telegram Mini Apps quickly using pre-built components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript, utilizing a modern component-based architecture:
- **UI Framework**: React with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The server follows a RESTful API design pattern:
- **Framework**: Express.js with TypeScript for type-safe server-side development
- **API Design**: RESTful endpoints for authentication, modules, industries, and other business data
- **Route Organization**: Modular route structure with dedicated route handlers
- **Development Integration**: Custom Vite middleware for seamless full-stack development experience

## Authentication System
The application implements a simplified Telegram-based authentication:
- **Method**: Username-based authentication mimicking Telegram user verification
- **Storage**: Local storage for client-side session persistence
- **Authorization**: Role-based access with authorized user checking
- **Protection**: Route guards to ensure authenticated access to protected pages

## Database and ORM
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Definition**: Centralized schema definitions in shared directory for consistency
- **Validation**: Zod integration with Drizzle for runtime type validation
- **Migration Management**: Automated migration system through Drizzle Kit

## Component Architecture
- **Design System**: Comprehensive component library using Radix UI primitives
- **Theming**: CSS custom properties for consistent theming and dark mode support
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS utilities
- **Accessibility**: Built-in accessibility features through Radix UI components

## Data Management
The application manages several key data entities:
- **Modules**: Catalog of available Mini App components and features
- **Industries**: Industry-specific solutions and use cases
- **USPs**: Unique selling propositions and benefits
- **Objections**: FAQ and objection handling content
- **Users**: User accounts and authorization status

# External Dependencies

## Database Services
- **PostgreSQL**: Primary database using Drizzle dialect configuration
- **Neon Database**: Cloud PostgreSQL provider via @neondatabase/serverless

## UI and Styling
- **Radix UI**: Complete suite of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Consistent icon library for user interface elements

## Development Tools
- **TypeScript**: Static type checking across the entire stack
- **Vite**: Modern build tool with hot module replacement and fast builds
- **ESBuild**: Fast JavaScript bundler for production server builds
- **Replit Integration**: Development environment integration with runtime error handling

## Runtime Libraries
- **React Hook Form**: Form handling with validation through @hookform/resolvers
- **TanStack React Query**: Powerful data fetching and state management
- **Wouter**: Lightweight routing solution for single-page applications
- **Date-fns**: Date manipulation and formatting utilities
- **clsx/class-variance-authority**: Dynamic className generation and variants

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Local Storage**: Client-side session persistence for authentication state