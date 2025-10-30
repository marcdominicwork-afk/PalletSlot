# Base44 App

## Overview
This is a Vite + React application that provides a web interface for the Base44 dock scheduling and warehouse management system. The app communicates with the Base44 API using the `@base44/sdk` package.

## Project Information
- **Framework**: Vite + React 18
- **Language**: JavaScript (JSX)
- **Package Manager**: npm
- **UI Libraries**: Radix UI, Tailwind CSS, shadcn/ui components
- **API Integration**: Base44 SDK
- **Development Port**: 5000
- **Host**: 0.0.0.0 (configured for Replit proxy)

## Architecture
The application is structured as follows:

### Key Directories
- `/src/pages/` - Main page components (Booking, Schedule, Carriers, etc.)
- `/src/components/` - Reusable UI components organized by feature
- `/src/api/` - Base44 API client configuration and integration
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions
- `/src/utils/` - Additional utility functions

### Core Features
- **Booking Management**: Create and manage dock appointments
- **Schedule Viewing**: Timeline and printable schedule views
- **Resource Management**: Carriers, companies, docks, warehouses, users, vehicle types
- **Driver Kiosk**: Self-service arrival confirmation
- **API Integration**: Direct communication with Base44 backend

## Configuration
- **Vite Config**: Configured with `allowedHosts: true` for Replit proxy support
- **Server Binding**: 0.0.0.0:5000 (required for Replit)
- **Path Aliases**: `@/` points to `./src/`
- **JSX Loader**: Configured to handle `.js` files as JSX

## Development
The app runs on Vite's development server with hot module replacement (HMR). The workflow is already configured to run `npm run dev` on port 5000.

## Authentication
The app requires users to be logged in to the Base44 platform to access API resources. Authentication is handled by the Base44 SDK.

## Recent Changes
- **2025-10-30**: Initial Replit setup
  - Configured Vite to bind to 0.0.0.0:5000
  - Set up workflow for development server
  - Verified app runs successfully in Replit environment
  - App requires Base44 authentication to access data

## Dependencies
All dependencies are managed via npm and defined in `package.json`. Key dependencies include:
- React ecosystem (react, react-dom, react-router-dom)
- Radix UI components for accessible UI primitives
- Tailwind CSS for styling
- Base44 SDK for API communication
- Form handling (react-hook-form, zod)
- Date utilities (date-fns)
