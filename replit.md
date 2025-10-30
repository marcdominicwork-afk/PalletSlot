# Base44 App - Angular 19 Conversion

## Overview
This application has been converted from React/Vite to Angular 19. It provides a web interface for the Base44 dock scheduling and warehouse management system. The app will communicate with the Base44 API using the `@base44/sdk` package.

## Project Information
- **Framework**: Angular 19 (Standalone Components)
- **Language**: TypeScript
- **Package Manager**: npm
- **UI Framework**: Tailwind CSS v4
- **Development Port**: 5000
- **Host**: 0.0.0.0 (configured for Replit proxy)

## Architecture
The application uses Angular 19's standalone component architecture (no NgModules required).

### Key Directories
- `/src/app/` - Application components and services
- `/src/assets/` - Static assets
- `/public/` - Public files (favicon, etc.)
- `/backup/react-src/` - Backup of original React source code

### Planned Features (from React version)
- **Booking Management**: Create and manage dock appointments
- **Schedule Viewing**: Timeline and printable schedule views
- **Resource Management**: Carriers, companies, docks, warehouses, users, vehicle types
- **Driver Kiosk**: Self-service arrival confirmation
- **API Integration**: Direct communication with Base44 backend

## Configuration

### Angular Configuration
- **angular.json**: Configured with host `0.0.0.0` and port `5000`
- **allowedHosts**: Set to `["all"]` for Replit proxy support
- **Server Binding**: 0.0.0.0:5000 (required for Replit)
- **Routing**: Angular Router enabled

### Tailwind CSS v4 Setup
- **PostCSS Configuration**: `.postcssrc.json` with `@tailwindcss/postcss` plugin
- **Import Method**: `@import "tailwindcss"` in `src/styles.scss`
- **No Config File Needed**: Tailwind v4 uses CSS-based configuration with `@theme` directive

## Development
The app runs on Angular CLI's development server with hot module replacement (HMR). The workflow is configured to run `npm start` on port 5000.

### Available Scripts
- `npm start` - Start development server (ng serve)
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run tests

## Authentication
The app will require users to be logged in to the Base44 platform to access API resources. Authentication will be handled by the Base44 SDK.

## Conversion Progress

### Completed
- **2025-10-30**: Angular 19 Project Setup
  - Created Angular 19 project with standalone components
  - Configured for Replit environment (0.0.0.0:5000, allowedHosts)
  - Installed and configured Tailwind CSS v4
  - Set up PostCSS for Tailwind compilation
  - Created workflow for development server
  - Backed up original React source to `/backup/react-src/`

### Pending
- Install and configure Base44 SDK
- Set up Angular routing (13 routes from React app)
- Create Angular services for API integration
- Convert UI components to Angular
- Convert page components to Angular
- Implement form handling with Angular Reactive Forms
- Set up authentication and user management
- Test and verify all features

## ABP Framework Compatibility
This Angular 19 setup is compatible with ABP Framework packages (version 9.2+):
- `@abp/ng.core` - Core infrastructure
- `@abp/ng.components` - Shared components
- `@abp/ng.theme.basic` - Basic theme
- Other ABP modules as needed

ABP packages can be installed once the base application structure is in place.

## Dependencies
All dependencies are managed via npm and defined in `package.json`. Key dependencies include:
- Angular 19 ecosystem (@angular/core, @angular/router, etc.)
- Tailwind CSS v4 (@tailwindcss/postcss)
- TypeScript 5.7
- RxJS 7.8
- Zone.js 0.15

## Notes
- The React source code is preserved in `/backup/react-src/` for reference during conversion
- Tailwind CSS v4 uses a new architecture without traditional config files
- Angular 19 uses standalone components by default (no NgModules)
