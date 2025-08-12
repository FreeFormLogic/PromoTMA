# Overview

This is a full-stack web application for a Telegram Mini Apps directory and showcase platform. The application serves as a business catalog and marketing tool for showcasing modular Mini App solutions, allowing users to explore different app modules, industry-specific solutions, pricing models, and development processes. The platform appears to target businesses looking to deploy Telegram Mini Apps quickly using pre-built components.

# User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)
- ✅ COMPLETED: Implemented real Telegram ID-based authorization with whitelist
- ✅ COMPLETED: Added strict access control for specific Telegram IDs: 7418405560, 5173994544, 216463929, 6209116360, 893850026, 1577419391, 5201551014
- ✅ COMPLETED: Removed fake @balilegend display from authorization system
- ✅ COMPLETED: Fixed mobile navigation - moved hamburger menu to bottom-right floating button
- ✅ COMPLETED: Mobile menu now opens from bottom of screen to avoid conflicts with battery/back button
- ✅ COMPLETED: System blocks all unauthorized users completely, even if bot/app is already added
- ✅ COMPLETED: Module modals in Industries section now 100% identical to Modules section functionality
- ✅ COMPLETED: Created separate admin panel at /admin for whitelist management (password protected)
- ✅ COMPLETED: Admin panel not accessible from main app navigation - only direct link
- ✅ COMPLETED: Expanded module database from 140 to 260+ modules with comprehensive categories:
  - ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ (модули 137-150): Push-уведомления, AI-чат поддержка, календарь, QR-коды, отзывы, мультиязычность, виртуальные события, CMS, IoT, блокчейн, AR, управление знаниями, лиды, корпоративная социальная сеть
  - АВТОМАТИЗАЦИЯ (модули 151-160): Конструктор бизнес-процессов, RPA, управление задачами, workflow, маршрутизация, документооборот, бизнес-правила, планировщик ресурсов, управление инцидентами, интеграционная шина
  - ОТРАСЛЕВЫЕ РЕШЕНИЯ (модули 161-170): Ресторан, медклиника, фитнес-клуб, салон красоты, отель, автосервис, стоматология, юридическая фирма, логистика, образовательный центр  
  - АНАЛИТИКА (модули 171-180): Предиктивная аналитика, CDP, BI дашборды, ML платформа, sentiment анализ, рекомендательная система, process mining, качество данных, attribution modeling, real-time аналитика
  - БЕЗОПАСНОСТЬ (модули 181-190): IAM, GDPR, обнаружение мошенничества, шифрование, аудит, DLP, управление уязвимостями, backup & DR, SOC, compliance management
  - КОММУНИКАЦИИ (модули 191-200): Омниканальная платформа, видеоконференции, массовые рассылки, AI чат-боты, голосовой ассистент, транскрибация
  - СОЦИАЛЬНАЯ КОММЕРЦИЯ (модули 201-205): Live Shopping, социальные покупки с друзьями, инфлюенсер маркетплейс, UGC, социальные рекомендации
  - AI И АВТОМАТИЗАЦИЯ (модули 206-210): AI Sales Assistant, Predictive Inventory, Dynamic Pricing AI, AI Content Generator, Autonomous Customer Service
  - ДОПОЛНИТЕЛЬНЫЕ МОДУЛИ (модули 236-255): Предзаказы товаров, сравнение характеристик, Google Analytics интеграция, экспорт отчетов, колесо фортуны, управление расписанием, Google Calendar синхронизация, напоминания о встречах, предоплата при бронировании, управление очередями, отзывы после услуг, виртуальные консультации, казуальные игры, виртуальные питомцы, карточные игры, AI-тренер, виртуальный HR-менеджер, AI Medical Assistant, Virtual Event Host, AI Content Creator

### Latest AI-Driven Experience Upgrade (January 2025)
- ✅ COMPLETED: Comprehensive UI/UX overhaul with strict blue/white/green color scheme enforcement
- ✅ COMPLETED: Updated Claude Sonnet 3 to Claude Sonnet 3.7 for enhanced AI capabilities
- ✅ COMPLETED: Changed pricing display from $25,000 to $10,000 throughout platform
- ✅ COMPLETED: Updated module statistics from 210+ to 260+ reflecting actual database size
- ✅ COMPLETED: Merged "ТРЕНДОВЫЕ ИГРЫ" and "ИГРЫ" categories completely - updated modules 231-234
- ✅ COMPLETED: Implemented advanced chat-first experience with intelligent duplicate prevention
- ✅ COMPLETED: AI system now receives already displayed modules to prevent repetitive recommendations
- ✅ COMPLETED: Enhanced filtering logic prevents recommending modules already shown in recommended block
- ✅ COMPLETED: Made category filters more compact with reduced button size and padding
- ✅ COMPLETED: Fixed green checkmarks visibility and removed AI chat header icons for cleaner design
- ✅ COMPLETED: Removed emoji inconsistencies across comparison sections
- ✅ COMPLETED: AI provides gradual, personalized module recommendations based on business analysis
- ✅ COMPLETED: Real-time business insights with Claude 3.7 intelligent conversation system
- ✅ COMPLETED: Smart module filtering prevents duplicate suggestions across chat sessions

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
The application implements a simplified, reliable authentication system:
- **Method**: One-click authentication without external dependencies or registration
- **Storage**: Local storage for client-side session persistence with 24-hour expiry
- **User Creation**: Automatic unique user generation with random usernames  
- **Interface**: Clean, professional login page with clear call-to-action
- **Protection**: Route guards ensure authenticated access to the module catalog
- **Stability**: No browser extension conflicts or external service dependencies

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