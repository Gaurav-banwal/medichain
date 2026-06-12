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
*   **Headers**: Sets `Set-Cookie: token=<JWT_TOKEN>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
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

Creates a new user record in the PostgreSQL database using a hashed password. Sets an `HttpOnly` JWT cookie for session management.

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

Authenticates an existing user against the PostgreSQL database using their email and password. On success, issues a signed session JWT in an `HttpOnly` cookie.

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

---

## 6. Create Prescription

Creates a new prescription record transactionally with its itemized medicines. This endpoint requires an active session cookie. It automatically identifies the prescribing doctor from the authenticated session (validating that the user has the `DOCTOR` role) and verifies that the recipient (`patientId`) has the `CITIZEN` role.

*   **Endpoint**: `/api/prescriptions`
*   **Method**: `POST`
*   **Content-Type**: `application/json`
*   **Cookies**: Requires `token=<JWT_TOKEN>` (Doctor session)

### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `patientId` | `string` | **Yes** | ID of the citizen (patient) |
| `ipfsHash` | `string` | **Yes** | Storage IPFS CID/hash containing metadata |
| `expiryDate` | `string` | **Yes** | Expiration date of the prescription (ISO String) |
| `items` | `array` | **Yes** | List of prescription item objects |
| `prescriptionId` | `string` | No | Unique blockchain ID (auto-generated if omitted) |
| `txHash` | `string` | No | Transaction hash of on-chain event |

#### `items` Element Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `medicineName` | `string` | **Yes** | Name of the medicine |
| `dosage` | `string` | **Yes** | Dose format (e.g. `1-0-1` or `500mg`) |
| `duration` | `string` | **Yes** | Duration of medicine usage (e.g. `5 Days`) |
| `quantity` | `number` | **Yes** | Total quantity to dispense |
| `instructions` | `string` | No | Additional usage instructions |

### Request Example
```json
{
  "patientId": "cmq7s6tsg0000n8qqzl0czzll",
  "ipfsHash": "QmDemoPrescriptionHash123",
  "expiryDate": "2026-12-12T12:00:00.000Z",
  "items": [
    {
      "medicineName": "Paracetamol 500mg",
      "dosage": "1-0-1",
      "duration": "5 Days",
      "quantity": 10,
      "instructions": "Take after meals"
    }
  ]
}
```

### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "test-id-1781250588410",
    "prescriptionId": "0xblockchain-rx-id-1781250588410",
    "doctorId": "cmq7s6uk80001n8qqu9kc4pge", // Inferred from active doctor session
    "patientId": "cmq7s6tsg0000n8qqzl0czzll",
    "ipfsHash": "QmDemoPrescriptionHash123",
    "txHash": null,
    "status": "CREATED",
    "expiryDate": "2026-12-12T12:00:00.000Z",
    "createdAt": "2026-06-12T07:49:49.012Z",
    "pharmacyId": null,
    "dispensedAt": null,
    "PrescriptionItem": [
      {
        "id": "test-item-1-1781250588410",
        "prescriptionId": "test-id-1781250588410",
        "medicineName": "Paracetamol 500mg",
        "dosage": "1-0-1",
        "duration": "5 Days",
        "quantity": 10,
        "instructions": "Take after meals"
      }
    ]
  }
}
```

### Error Responses
*   **`401 Unauthorized`**: If there is no active session cookie.
*   **`403 Forbidden`**: If the logged-in user is not a `DOCTOR`.
*   **`400 Bad Request`**: If required fields are missing, patientId is not a CITIZEN, or item formats are invalid.
*   **`500 Internal Server Error`**: For database transaction or other server-side errors.

---

## 7. Retrieve Prescriptions

Retrieves a list of prescriptions. This endpoint is context-aware and automatically filters prescriptions based on the logged-in user's role:
- If logged in as **`DOCTOR`**: Automatically returns only prescriptions given/created by this doctor (`doctorId = session.userId`).
- If logged in as **`CITIZEN`**: Automatically returns only prescriptions possessed by this patient (`patientId = session.userId`).
- If logged in as **`PHARMACY`** or **`REGULATOR`**: Can query all prescriptions, optionally using filtering query parameters.

*   **Endpoint**: `/api/prescriptions`
*   **Method**: `GET`
*   **Cookies**: Requires `token=<JWT_TOKEN>`

### Query Parameters (For PHARMACY / REGULATOR roles only)
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `doctorId` | `string` | No | Filter by doctor ID |
| `patientId` | `string` | No | Filter by citizen (patient) ID |
| `pharmacyId` | `string` | No | Filter by pharmacy ID |
| `status` | `string` | No | Filter by status (`CREATED`, `VERIFIED`, `DISPENSED`, `EXPIRED`) |

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "test-id-1781250588410",
      "prescriptionId": "0xblockchain-rx-id-1781250588410",
      "doctorId": "cmq7s6uk80001n8qqu9kc4pge",
      "patientId": "cmq7s6tsg0000n8qqzl0czzll",
      "ipfsHash": "QmDemoPrescriptionHash123",
      "txHash": null,
      "status": "CREATED",
      "expiryDate": "2026-12-12T12:00:00.000Z",
      "createdAt": "2026-06-12T07:49:49.012Z",
      "pharmacyId": null,
      "dispensedAt": null,
      "PrescriptionItem": [
        {
          "id": "test-item-1",
          "medicineName": "Paracetamol",
          "dosage": "1-0-1",
          "duration": "5 Days",
          "quantity": 10
        }
      ]
    }
  ],
  "total": 1
}
```

---

## 8. Fetch Specific Prescription

Fetches a single prescription by its database ID (`id`) or its blockchain identifier (`prescriptionId`).

*   **Endpoint**: `/api/prescriptions/[id]`
*   **Method**: `GET`

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "test-id-1781250588410",
    "prescriptionId": "0xblockchain-rx-id-1781250588410",
    "doctorId": "cmq7s6uk80001n8qqu9kc4pge",
    "patientId": "cmq7s6tsg0000n8qqzl0czzll",
    "ipfsHash": "QmDemoPrescriptionHash123",
    "status": "CREATED",
    "PrescriptionItem": [...]
  }
}
```

### Error Responses
*   **`404 Not Found`**: If the prescription ID does not exist in the database.

---

## 9. Update Prescription

Updates a prescription's status, transaction hash, or links it to a pharmacy upon dispensing.

*   **Endpoint**: `/api/prescriptions/[id]`
*   **Method**: `PATCH`
*   **Content-Type**: `application/json`

### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | No | New status (`CREATED`, `VERIFIED`, `DISPENSED`, `EXPIRED`) |
| `txHash` | `string` | No | Blockchain transaction hash of the action |
| `pharmacyId` | `string` | No | ID of the dispensing pharmacy |
| `dispensedAt` | `string` | No | Dispensed timestamp (ISO String) |

### Request Example
```json
{
  "status": "DISPENSED",
  "pharmacyId": "cmq7s6uzp0002n8qqjy3f9zvm",
  "dispensedAt": "2026-06-12T07:49:50.031Z"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "test-id-1781250588410",
    "prescriptionId": "0xblockchain-rx-id-1781250588410",
    "doctorId": "cmq7s6uk80001n8qqu9kc4pge",
    "patientId": "cmq7s6tsg0000n8qqzl0czzll",
    "ipfsHash": "QmDemoPrescriptionHash123",
    "txHash": null,
    "status": "DISPENSED",
    "pharmacyId": "cmq7s6uzp0002n8qqjy3f9zvm",
    "dispensedAt": "2026-06-12T07:49:50.031Z",
    "PrescriptionItem": [...]
  }
}
```

### Error Responses
*   **`400 Bad Request`**: If the provided `pharmacyId` does not exist or does not belong to a user with the `PHARMACY` role.
*   **`404 Not Found`**: If the prescription ID does not exist.

