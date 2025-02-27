# WorkforceHub - HRM System

A comprehensive web-based Human Resource Management (HRM) system designed to streamline worker management, permit requests, and work verification processes.

## Features

- **User Authentication**
  - Secure login and registration system
  - Role-based access control

- **Worker Management**
  - Add, edit, and remove workers
  - Track employee information (name, department, role)
  - Manage reporting relationships
  - View organizational hierarchy

- **Permit Management**
  - Submit leave requests (vacation, sick leave, personal)
  - Track permit status (pending, approved, rejected)
  - Manage approval workflow
  - View permit history

- **Proof of Employment**
  - Generate employment verification documents
  - Print-ready PDF format
  - Official company letterhead template

- **Dashboard**
  - Overview of key metrics
  - Total employee count
  - Department statistics
  - Pending permits count

## Tech Stack

- Frontend:
  - React with TypeScript
  - TanStack Query for data fetching
  - Shadcn UI components
  - Tailwind CSS for styling
  - Wouter for routing

- Backend:
  - Express.js server
  - PostgreSQL database
  - Drizzle ORM
  - Passport.js for authentication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AlexisTAE/HrResourceCenter.git
cd HrResourceCenter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage Guide

### Authentication

1. Access the login page at `/auth`
2. Register a new account or log in with existing credentials
3. Upon successful authentication, you'll be redirected to the dashboard

### Managing Workers

1. Navigate to the Workers section
2. Use the "Add Worker" button to create new employee records
3. Edit worker details using the pencil icon
4. View organizational structure in the Organization Chart section

### Handling Permits

1. Go to the Permits section
2. Click "New Request" to submit a leave request
3. Fill in the required details:
   - Select employee
   - Choose permit type
   - Specify dates
   - Provide reason
4. Track permit status and manage approvals

### Generating Proofs

1. Access the Proofs section
2. Select an employee from the list
3. Click "Generate Proof" to create an employment verification document
4. Use the "Generate PDF" button to download or print

## Database Schema

The system uses the following main tables:

- `users`: Authentication and user management
- `workers`: Employee information and relationships
- `permits`: Leave request tracking and workflow

## Development

- The project uses Vite for development
- Hot module replacement is enabled
- TypeScript for type safety
- ESLint and Prettier for code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
