# TypeScript CRUD API

**Repository**: https://github.com/shyshy243/-TypeScript-CRUD-API-with-Node.js-Express-MySQL

## Overview
- Language: TypeScript
- Framework: Express
- Database: MySQL

## Prerequisites
- Node.js 
- npm
- MySQL server running

## Setup
1. Copy `config.json` and fill in your database settings.
2. Create those database tables (your SQL schema is in project comments or migration file).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build & start server:
   ```bash
   npm run build
   npm start
   ```

### config.json example

```json
{
  "host": "localhost",
  "user": "root",
  "password": "062105",
  "database": "typescript_crud_api"
}
```

The server listens on `http://localhost:4000` by default.

## API Endpoints

(Adjust paths if your controller routing has prefixes in `server.ts`.)

- Departments
  - GET `/departments`
  - GET `/departments/:id`
  - POST `/departments`
  - PUT `/departments/:id`
  - DELETE `/departments/:id`

- Employees
  - GET `/employees`
  - GET `/employees/:id`
  - POST `/employees`
  - PUT `/employees/:id`
  - DELETE `/employees/:id`

- Requests
  - GET `/requests`
  - GET `/requests/:id`
  - POST `/requests`
  - PUT `/requests/:id`
  - DELETE `/requests/:id`

- Transfers
  - GET `/transfers`
  - GET `/transfers/:id`
  - POST `/transfers`
  - PUT `/transfers/:id`
  - DELETE `/transfers/:id`

- Users
  - GET `/users`
  - GET `/users/:id`
  - POST `/users`
  - PUT `/users/:id`
  - DELETE `/users/:id`

## Structure

```
src/
  ├─ _helpers/
  ├─ _middleware/
  ├─ department/
  ├─ employee/
  ├─ request/
  ├─ transfer/
  └─ users/
```

