# School Management System

A comprehensive school management system built with Angular 18, Spring Boot, and PostgreSQL.

## Features

- Multi-role access (Super Admin, Principal, Teacher, Student, Parent)
- Real-time attendance tracking
- Performance analytics and reporting
- Task management
- Parent communication system

## Prerequisites

- Node.js (Latest LTS version)
- npm (Latest version)
- Java 17
- PostgreSQL

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200/`

## Project Structure

```
src/
├── app/
│   ├── core/           # Core modules (auth, guards, interceptors)
│   ├── features/       # Feature modules
│   ├── shared/         # Shared components and services
│   └── models/         # Data models and interfaces
├── assets/            # Static assets
└── environments/      # Environment configurations
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run e2e` - Run end-to-end tests

## Authentication

The system uses JWT-based authentication. All HTTP requests are automatically intercepted to include the authentication token.

## Error Handling

A global error handler is implemented to handle various HTTP errors and network failures with meaningful user feedback.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License. 