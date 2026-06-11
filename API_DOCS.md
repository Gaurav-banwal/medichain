# MediChain Auth API Documentation

This document describes the authentication API endpoints available in the MediChain Next.js project.

**Base URL**: `http://localhost:3000`

---

## 1. User Registration (Database-backed)

Creates a new user record in the PostgreSQL database using Prisma and returns a signed JWT token in the response body.

*   **Endpoint**: `/api/auth/register`
*   **Method**: `POST`
*   **Content-Type**: `application/json`

### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Full name of the user |
| `email` | `string` | **Yes** | Unique email address |
| `role` | `string` | **Yes** | User role: `CITIZEN`, `DOCTOR`, `PHARMACY`, or `REGULATOR` |
| `walletAddress` | `string` | No | Web3 wallet address |

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
    "id": "670c5388-75b2-4d1a-9694-817ab320141f",
    "name": "Jane Doe",
    "email": "jane.doe@gmail.com",
    "role": "CITIZEN",
    "walletAddress": "0x9876543210987654321098765432109876543210",
    "createdAt": "2026-06-11T09:20:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBjNTM4OC03NWIyLT..."
}
```

### Error Responses
*   **`400 Bad Request`**: If required parameters (`name`, `email`, `role`) are missing.
*   **`500 Internal Server Error`**: If the email/walletAddress is already registered, database is unreachable, etc.

---

## 2. User Signup (Session Cookie-backed)

Creates a new user record in the persistent in-memory database using a hashed password. Sets an `HttpOnly` JWT cookie for session management.

*   **Endpoint**: `/api/auth/signup`
*   **Method**: `POST`
*   **Content-Type**: `application/json`

### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Full name of the user (non-empty string) |
| `email` | `string` | **Yes** | Valid unique email address |
| `password` | `string` | **Yes** | Password (minimum 6 characters) |
| `role` | `string` | **Yes** | User role: `CITIZEN`, `DOCTOR`, `PHARMACY`, or `REGULATOR` |
| `walletAddress` | `string` | No | Web3 wallet address |

### Request Example
```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com",
  "password": "securepassword123",
  "role": "CITIZEN",
  "walletAddress": "0x1234567890123456789012345678901234567890"
}
```

### Success Response (`201 Created`)
*   **Headers**: Sets `Set-Cookie: token=<JWT_TOKEN>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
```json
{
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "role": "CITIZEN",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "id": "e49c7ad1-1bc3-4876-b6b3-6780c10a30b4",
    "createdAt": "2026-06-11T09:20:00.000Z"
  }
}
```

### Error Responses
*   **`400 Bad Request`**: If fields are missing/invalid, password is under 6 characters, role is invalid, or email is already registered.
*   **`500 Internal Server Error`**: For other internal processing failures.

---

## 3. User Login

Authenticates an existing user against the in-memory database using their email and password. On success, issues a signed session JWT in an `HttpOnly` cookie.

*   **Endpoint**: `/api/auth/login`
*   **Method**: `POST`
*   **Content-Type**: `application/json`

### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Yes** | Registered email address |
| `password` | `string` | **Yes** | User password |

### Request Example
```json
{
  "email": "john.doe@gmail.com",
  "password": "securepassword123"
}
```

### Success Response (`200 OK`)
*   **Headers**: Sets `Set-Cookie: token=<JWT_TOKEN>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "e49c7ad1-1bc3-4876-b6b3-6780c10a30b4",
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "role": "CITIZEN",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "createdAt": "2026-06-11T09:20:00.000Z"
  }
}
```

### Error Responses
*   **`400 Bad Request`**: If `email` or `password` parameter is missing.
*   **`401 Unauthorized`**: If the email is not found or the password is incorrect.
*   **`500 Internal Server Error`**: For unexpected server-side errors.

---

## 4. Current User Session Details

Fetches the details of the currently authenticated user session. Requires a valid session token inside the `token` cookie.

*   **Endpoint**: `/api/auth/me`
*   **Method**: `GET`
*   **Cookies**: Requires `token=<JWT_TOKEN>`

### Success Response (`200 OK`)
```json
{
  "authenticated": true,
  "user": {
    "id": "e49c7ad1-1bc3-4876-b6b3-6780c10a30b4",
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "role": "CITIZEN",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "createdAt": "2026-06-11T09:20:00.000Z"
  }
}
```

### Error Responses
*   **`401 Unauthorized`**: If the `token` cookie is missing, invalid, or has expired.
*   **`500 Internal Server Error`**: For unexpected server-side errors.

---

## 5. User Logout

Terminates the current user session by clearing the `token` cookie.

*   **Endpoint**: `/api/auth/logout`
*   **Method**: `POST`

### Success Response (`200 OK`)
*   **Headers**: Clears cookie `token` (`Max-Age=0`, expired date).
```json
{
  "message": "Logged out successfully"
}
```

### Error Responses
*   **`500 Internal Server Error`**: For unexpected server-side errors.
