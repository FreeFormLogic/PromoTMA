# Overview

This project is a full-stack web application serving as a Telegram Mini Apps directory and showcase platform. Its primary purpose is to function as a business catalog and marketing tool, highlighting modular Mini App solutions. The platform enables users to explore various app modules, industry-specific solutions, pricing models, and development processes, targeting businesses seeking rapid Telegram Mini App deployment using pre-built components.

## Recent Updates (August 2025)
- ✅ **Fixed Authorization System**: Dynamic whitelist checking from server-side, removing hardcoded dependencies
- ✅ **Added User Access**: User 666024781 manually added to server-side whitelist for immediate access
- ✅ **Implemented Comprehensive Analytics**: Full Yandex.Metrika integration with webvisor tracking all user text inputs and interactions
- ✅ **Enhanced AI Chat Analytics**: Complete tracking of all chat interactions, module selections, and user behaviors
- ✅ **Complete "Ваше преимущество" Redesign**: Full rebuild based on detailed specifications - dark theme (bg-gray-900), dual-tab structure ("Преимущества для Клиента" + "Аргументы для Продавца"), expandable cards with detailed ROI data, accordion objection handling, comparison table, target verticals, and persuasive sales content with specific financial figures
- ✅ **AI Chat Statistics System**: Complete AI usage tracking with token counting, cost calculation, and session management. New database tables (aiChatSessions, aiChatMessages, aiChatUserStats) for storing detailed chat history. Admin panel enhanced with AI statistics dashboard showing per-user token usage, costs, session data. Automatic cost calculation based on Claude Sonnet 4.0 pricing model ($3/$15 per 1M tokens)
- ✅ **Fixed Category Grouping**: Reorganized module categories into logical groups - E-commerce, Marketing, Finance, Education, Entertainment, Booking, Business, AI & Automation, Integrations, Communications, Analytics, Security, Local services, and Additional services
- ✅ **Updated AI Constructor Menu**: Enhanced floating menu in AI chat with complete navigation including all main sections: Home, Modules, Industries, My Telegram Mini App, Your Advantage, Partners
- ✅ **FIXED AI CRITICAL ERROR**: Resolved JSON parsing issue preventing AI chat functionality - restored full database processing of all 244 modules with complete descriptions, features, and benefits
- ✅ **AI Conversation Continuity**: Implemented intelligent tracking to prevent module repetition - AI now suggests new relevant modules based on conversation context
- ✅ **Indonesian Payment Integration**: AI now correctly identifies and suggests Indonesia-specific modules (120: GoPay/OVO, 123: DANA/LinkAja, 125: BCA/Mandiri banks) for Bali/Indonesia business contexts
- ✅ **FIXED Module Display Issues**: Eliminated duplicate module names ending with ** and removed extra symbols (** - ) appearing before module descriptions. Enhanced AI prompt to prevent formatting issues and added client-side text cleaning for legacy compatibility
- ✅ **Streamlined UI Design**: Removed "Компактный вид" toggle from modules page, now displays catalog view by default. Stacked AI-конструктор and Каталог модулей buttons vertically on main page. Removed duplicate "Быстрый запуск" content block for cleaner interface
- ✅ **Fixed Module Clickability**: Removed blue category navigation from modules header, added click functionality to all module cards in catalog view with proper modal display integration
- ✅ **Fixed Business Goal Filtering**: Changed from OR-logic to AND-logic for business goal filters - now properly narrows down results instead of expanding them
- ✅ **Fixed Module Modal Content**: Replaced old hardcoded module data with actual database content - modals now show current descriptions, features, and benefits instead of outdated content with images

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
The application manages data entities including Modules (Mini App components), Industries (industry-specific solutions), USPs, Objections (FAQ), Users (authorization status), and AI Chat Analytics. The module database has been expanded to 260+ entries across various categories like additional services, automation, industry solutions, analytics, security, communications, social commerce, and AI-driven solutions. AI chat tracking includes comprehensive statistics: token usage, costs, session duration, message history, and user activity patterns with real-time cost calculation based on Claude model pricing.

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