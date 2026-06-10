# MediChain Auth API Documentation

This document describes the authentication API endpoints available in the MediChain Next.js project.

**Base URL**: `http://localhost:3000`

---

## 1. User Registration

Creates a new user record in the PostgreSQL database and issues a signed JWT token.

*   **Endpoint**: `/api/auth/register`
*   **Method**: `POST`
*   **Content-Type**: `application/json`

### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Full name of the user |
| `email` | `string` | **Yes** | Unique email address |
| `role` | `string` | **Yes** | User role: `CITIZEN`, `DOCTOR`, `PHARMACY`, or `REGULATOR` |
| `walletAddress` | `string` | No | Web3 wallet address (MetaMask) |

### Request Example
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@gmail.com",
  "role": "CITIZEN",
  "walletAddress": "0x9876543210987654321098765432109876543210"
}
```

### Success Response (`201 Created`)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "usr_v4qkdjmg6",
    "name": "Jane Doe",
    "email": "jane.doe@gmail.com",
    "role": "CITIZEN",
    "walletAddress": "0x9876543210987654321098765432109876543210",
    "createdAt": "2026-06-10T08:34:01.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfdjRxa2RqbWc2Ii..."
}
```

### Error Responses
*   **`400 Bad Request`**: If required parameters (`name`, `email`, `role`) are missing.
*   **`500 Internal Server Error`**: If the email is already registered, database is unreachable, etc.

---

## 2. User Login (Email / OAuth simulation)

Finds an existing user by their email address and generates a signed session JWT.

*   **Endpoint**: `/api/auth/login`
*   **Method**: `POST`
*   **Content-Type**: `application/json`

### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Yes** | Registered email address |

### Request Example
```json
{
  "email": "jane.doe@gmail.com"
}
```

### Success Response (`200 OK`)
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "usr_v4qkdjmg6",
    "name": "Jane Doe",
    "email": "jane.doe@gmail.com",
    "role": "CITIZEN",
    "walletAddress": "0x9876543210987654321098765432109876543210",
    "createdAt": "2026-06-10T08:34:01.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfdjRxa2RqbWc2Ii..."
}
```

### Error Responses
*   **`400 Bad Request`**: If `email` parameter is missing.
*   **`404 Not Found`**: If the user doesn't exist in the database.

---

## 3. Protected User Profile

Fetches the logged-in user's profile details. Requires a valid JWT token.

*   **Endpoint**: `/api/auth/profile`
*   **Method**: `GET`
*   **Headers**: 
    `Authorization: Bearer <JWT_TOKEN>`

### Success Response (`200 OK`)
```json
{
  "message": "Access granted to protected profile",
  "user": {
    "id": "usr_v4qkdjmg6",
    "name": "Jane Doe",
    "email": "jane.doe@gmail.com",
    "role": "CITIZEN",
    "walletAddress": "0x9876543210987654321098765432109876543210",
    "createdAt": "2026-06-10T08:34:01.000Z"
  }
}
```

### Error Responses
*   **`401 Unauthorized`**: If the `Authorization` header is missing, incorrectly formatted, or the JWT is invalid/expired.
*   **`404 Not Found`**: If the user account associated with the token has been deleted.
