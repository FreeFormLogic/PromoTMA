# Overview
This project is a full-stack web application designed as a Telegram Mini Apps directory and showcase platform. Its core purpose is to serve as a business catalog and marketing tool, highlighting modular Mini App solutions. The platform enables businesses to explore various app modules, industry-specific solutions, pricing models, and development processes, facilitating rapid Telegram Mini App deployment using pre-built components. The project envisions becoming a crucial resource for businesses seeking to leverage Telegram Mini Apps for market expansion.

# User Preferences
Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript, utilizing a component-based architecture. It employs Tailwind CSS with shadcn/ui for consistent UI, Wouter for lightweight routing, and TanStack React Query for server state management. Vite is used for development and optimized builds. The UI features a strict blue/white color scheme, enhanced mobile navigation with a floating button and bottom-screen menu, and a mobile-first responsive design.

## Backend Architecture
The server follows a RESTful API design pattern using Express.js with TypeScript. It features modular route structures for authentication, modules, and industry data, integrating seamlessly with the Vite development environment.

## Authentication System
The application uses a simplified, one-click authentication system. It employs local storage for client-side session persistence with a 24-hour expiry, automatically generating unique users. A dedicated admin panel at `/admin` (password protected) manages whitelist access for specific Telegram IDs, strictly blocking unauthorized users.

## Database and ORM
Drizzle ORM is used for type-safe database operations and migrations, with schema definitions centralized and Zod integration for runtime type validation.

## Component Architecture
A comprehensive design system is implemented using Radix UI primitives, with CSS custom properties for theming and dark mode support. It features built-in accessibility through Radix UI components.

## Data Management
The application manages data entities including Modules (Mini App components), Industries (industry-specific solutions), USPs, Objections (FAQ), Users (authorization status), and AI Chat Analytics. The module database includes over 260 entries across various categories. AI chat tracking includes comprehensive statistics: token usage, costs, session duration, message history, and user activity patterns with real-time cost calculation.

## AI System Architecture
The AI chat system provides intelligent, database-driven module recommendations with comprehensive business analysis. **Major breakthrough achieved**: The system now analyzes ALL 260 modules from the database using advanced scoring algorithms instead of hardcoded responses. It features universal semantic analysis for any business niche, intelligent business type detection (food, beauty, tourism, fitness, medical), specialized scoring for industry-specific modules (e.g., medical clinics get booking systems with 110+ score), duplicate filtering for diverse recommendations, and 3-second response times. Business-specific explanations are generated for each recommended module. Module modals include gradient backgrounds and markdown formatting support. The pricing display is standardized at $10,000.

**Latest Update (January 2025)**: 
- Successfully implemented Module 261 (Tourism Agency Management) as a specialized industry solution for travel agencies. The module receives maximum priority scoring (500 points) for tourism-related queries and provides comprehensive travel agency management features including tour operator integration, tourist CRM, and hot deals notifications.
- **Universal Algorithm Implementation**: Replaced niche-specific hardcoded logic with a universal recommendation system that analyzes ALL modules semantically. The system now:
  - Uses keyword matching from user input against module names, descriptions, and benefits
  - Applies dynamic scoring based on business context without predetermined categories
  - Generates personalized explanations adapted to user's specific business context
  - Works for any type of business (tested with restaurants, tourism, clothing stores, etc.)
  - Prioritizes industry-specific modules when relevant, but maintains flexibility for all business types
- **Service Business Intelligence**: Enhanced AI to properly handle service-based businesses (psychologists, lawyers, consultants, coaches) by:
  - Classifying service professionals correctly as "services" or "professional" industries
  - Prioritizing modules with booking/appointment features (medical clinic #239, beauty salon #240)
  - Reducing scores for irrelevant e-commerce modules while maintaining payment processing
  - Adding personalized emojis for different service types (🧠 for psychologists, ⚖️ for lawyers)
- **Clean Response Format**: Streamlined AI responses to show only module references without duplicate descriptions, letting module cards display full details
- **Access Control Updates**: Disabled Partners section for all users by default. Updated database (10 users affected) and schema to set `accessPartners = false` by default for new users.
- **AI Intelligence Upgrade**: Replaced hardcoded business classification with Gemini-powered intelligent analysis:
  - Now uses Gemini 2.0 Flash for dynamic business type detection instead of keyword matching
  - Provides accurate classification for complex cases like "Вязание игрушек" (correctly identified as handmade)
  - Generates appropriate emojis based on AI analysis (🧶 for handmade, 🧠 for services, etc.)
  - Maintains fallback system for reliability while leveraging AI for superior accuracy
- **Bug Fixes**: 
  - Fixed AI module duplication issue where each module appeared multiple times in responses due to redundant module tags in API responses
  - Enhanced business type detection to properly recognize food delivery keywords ("суши", "доставка") as restaurant business
  - Fixed semantic analysis to use original user text instead of processed persona for better keyword matching
  - Corrected service business module recommendations to use existing modules (239, 240) instead of non-existent ones

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