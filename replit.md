# Overview

AccountingPro is a comprehensive offline accounting application built as a modern web application to replicate the functionality of a legacy Visual Basic 6 (VB6) accounting system. The application provides complete accounting capabilities including billing/sales, purchases, ledger management, inventory tracking, customer/vendor management, and financial reporting. It's designed as a Progressive Web App (PWA) with offline-first functionality, targeting business users who need professional accounting tools without internet dependency.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing with page-based navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Offline Storage**: Dexie.js (IndexedDB wrapper) for client-side data persistence
- **PWA Features**: Service worker implementation for offline functionality and app-like experience

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database ORM**: Drizzle ORM with PostgreSQL as the primary database
- **Development Setup**: Vite middleware integration for hot module replacement in development
- **API Design**: RESTful API structure with typed route handlers
- **Build System**: ESBuild for production server bundling

## Data Storage Strategy
- **Primary Database**: PostgreSQL with Drizzle ORM for schema management and type safety
- **Client-side Cache**: Dexie.js for offline data synchronization and local storage
- **Schema Management**: Shared TypeScript schema definitions between client and server using drizzle-zod

## Authentication & Session Management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **User Management**: Basic username/password authentication system
- **Financial Year Isolation**: Multi-tenant data architecture based on financial year selection

## Core Business Logic Architecture
- **Modular Design**: Separate modules for each accounting function (sales, purchase, ledger, reports)
- **Financial Year Management**: Support for creating and managing multiple financial years with data isolation
- **Transaction Processing**: Double-entry accounting principles with automatic ledger entry generation
- **Stock Management**: Real-time inventory tracking with automatic updates from sales and purchase transactions
- **GST Compliance**: Built-in GST calculation and reporting capabilities

## UI/UX Design Patterns
- **Professional Business Interface**: Clean, non-flashy design suitable for accounting professionals
- **Responsive Layout**: Sidebar navigation with mobile-friendly responsive design
- **Form-heavy Workflows**: Optimized for data entry with validation and error handling
- **Report Generation**: PDF export capabilities for invoices and financial reports
- **Progressive Enhancement**: Works offline with service worker caching

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Alternative**: Any PostgreSQL-compatible database service

## UI Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives for React
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire application stack
- **ESLint/Prettier**: Code quality and formatting tools

## PDF Generation
- **jsPDF**: Client-side PDF generation for invoices and reports
- **jsPDF-AutoTable**: Table generation extension for structured reports

## Fonts and Icons
- **Inter Font**: Professional typography from Google Fonts
- **Font Awesome**: Icon library for UI elements

## Additional Libraries
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Type-safe CSS class composition
- **Wouter**: Lightweight routing library
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: TypeScript-first schema validation

## PWA Infrastructure
- **Service Worker**: Custom implementation for offline functionality
- **Web App Manifest**: PWA configuration for app-like installation experience