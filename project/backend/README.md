# Banking Application Backend

## Overview
This is a Spring Boot backend for a banking application with JWT authentication and RESTful APIs.

## Features
- JWT Authentication
- Account Management
- Transaction History
- Internal Transfers
- H2 In-Memory Database
- CORS Support

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

## Running the Application

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Demo Credentials
- Email: `demo@banquex.com`
- Password: `demo123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Banking
- `GET /api/banking/accounts` - Get user accounts
- `GET /api/banking/accounts/{id}` - Get specific account
- `GET /api/banking/transactions` - Get all transactions
- `GET /api/banking/accounts/{id}/transactions` - Get account transactions
- `GET /api/banking/balance/total` - Get total balance
- `POST /api/banking/transfer` - Perform transfer

## Database
H2 Console available at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:bankingdb`
- Username: `sa`
- Password: (empty)