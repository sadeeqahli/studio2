# PitchLink - Premium Football Booking Platform

## Overview

PitchLink is a comprehensive football pitch booking platform designed for Nigeria, specifically targeting Lagos and surrounding areas. The application serves as a marketplace connecting football enthusiasts with premium sports facilities, while also providing features for team formation, split payments, and community engagement. The platform supports two primary user types: players who book pitches and owners who manage sports facilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Vanilla JavaScript with ES6 modules
- **Build Tool**: Vite for development and bundling
- **Architecture Pattern**: Component-based architecture with centralized state management
- **Routing**: Custom client-side router with dynamic route matching
- **State Management**: Centralized AppState class using observer pattern
- **Styling**: CSS custom properties with theme switching support (light/dark modes)

### Application Structure
- **Components**: Reusable UI components (Header, BookingForm, PitchCard, SearchFilters)
- **Pages**: Route-specific page components handling different application views
- **State**: Global application state with reactive updates
- **Router**: SPA routing with support for nested routes and parameters
- **Utils**: Utility classes for theme management and other cross-cutting concerns

### Data Management
- **Mock Data Generation**: Faker.js for generating realistic test data
- **Local State**: In-memory data storage with plans for database integration
- **User Authentication**: Simple authentication flow with user type differentiation
- **Booking System**: Complete booking workflow with form validation and confirmation

### User Experience Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme Support**: Light/dark mode toggle with persistent preferences
- **Search & Filtering**: Advanced filtering system for pitches and products
- **Team Formation**: Split payment system for group bookings
- **Community Features**: Player finder and facility reviews
- **Owner Dashboard**: Separate interface for facility owners

### Business Logic
- **Booking Flow**: Date/time selection, pricing calculation, and confirmation
- **Split Payments**: Team creation, payment coordination, and contribution tracking
- **Multi-tenant**: Separate experiences for players and facility owners
- **Localization**: Nigerian market focus with NGN currency formatting

## External Dependencies

### Build Dependencies
- **Vite**: Modern build tool and development server
- **@faker-js/faker**: Mock data generation for development and testing

### Planned Integrations
- **Paystack**: Payment processing for Nigerian market (implementation referenced in requirements)
- **Database**: Future integration with PostgreSQL or similar for data persistence
- **Push Notifications**: For team coordination and booking updates
- **SMS/Mobile Money**: External payment coordination outside the app
- **Bank Verification APIs**: Optional payment verification through Paystack

### Configuration
- **Vite Configuration**: Custom server setup for Replit environment with specific host allowlist
- **Asset Management**: Image placeholder service integration for development
- **Meta Tags**: Comprehensive SEO and social media optimization
- **PWA Ready**: Structured for progressive web app conversion