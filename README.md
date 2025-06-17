# School Management System - Frontend

This is the frontend application for the School Management System, built with Angular 18 and integrated with a Spring Boot backend.

## Features

- 🔐 Secure authentication with JWT and OAuth2 (Google, Facebook, Twitter, Instagram)
- 👥 Role-based access control (Super Admin, Principal, Teacher, Student)
- 🏫 School management for administrators
- 👨‍🏫 Teacher dashboard with class management
- 👨‍🎓 Student portal with task tracking and feedback
- 📊 Interactive dashboards with charts and statistics
- 📱 Responsive design for all devices

## Prerequisites

- Node.js (v18 or later)
- Angular CLI (v18 or later)
- npm (v9 or later)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/school-management-system-frontend.git
cd school-management-system-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Update the API URL and OAuth2 credentials

4. Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core module (services, interceptors)
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── dashboard/      # Dashboard components
│   │   ├── school/         # School management
│   │   ├── teacher/        # Teacher features
│   │   └── student/        # Student features
│   ├── shared/             # Shared module (components, directives)
│   └── app.module.ts       # Root module
├── assets/
│   └── images/            # Static images
└── environments/          # Environment configurations
```

## Development

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Implement lazy loading for feature modules
- Follow SOLID principles

### Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## Build

Build for production:
```bash
ng build --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@schoolmanagementsystem.com or create an issue in the repository.