# MediChain Core API Documentation

This document describes the core functional API endpoints available in the MediChain Next.js project. For authentication-related endpoints (register, login, signup, session details, logout), please refer to the [Authentication API Documentation](file:///home/leo/Projects/project/medichain/AUTH_API_DOCS.md).

**Base URL**: `http://localhost:3000`

---

## 1. Create Prescription

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
| `medicineName` | `string` | **Yes** | Name of the medicine (must match a registered medicine in the system, validated case-insensitively) |
| `dosage` | `string` | **Yes** | Dose format (e.g. `1-0-1` or `500mg`) |
| `duration` | `string` | **Yes** | Duration of medicine usage (e.g. `5 Days`) |
| `quantity` | `number` | **Yes** | Total quantity to dispense |
| `instructions` | `string` | No | Additional usage instructions |
| `dosageAmount` | `number` | No | Optional. Numeric dosage amount (auto-parsed if omitted) |
| `durationDays` | `number` | No | Optional. Numeric duration in days (auto-parsed if omitted) |
| `frequencyPerDay` | `number` | No | Optional. Numeric frequency per day (auto-parsed if omitted) |

### Request Example
```json
{
  "patientId": "cmq7s6tsg0000n8qqzl0czzll",
  "ipfsHash": "QmDemoPrescriptionHash123",
  "expiryDate": "2026-12-12T12:00:00.000Z",
  "items": [
    {
      "medicineName": "Paracetamol",
      "dosage": "1-0-1",
      "duration": "5 Days",
      "quantity": 10,
      "instructions": "Take after meals",
      "dosageAmount": 1,
      "durationDays": 5,
      "frequencyPerDay": 2
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
        "instructions": "Take after meals",
        "dosageAmount": 1,
        "durationDays": 5,
        "frequencyPerDay": 2,
        "medicineId": "cmqarsq0q00007cqqbh3h9i0x",
        "medicineName": "Paracetamol",
        "dosage": "1-0-1",
        "duration": "5 Days",
        "quantity": 10
      }
    ]
  }
}
```

### Error Responses
*   **`401 Unauthorized`**: If there is no active session cookie.
*   **`403 Forbidden`**: If the logged-in user is not a `DOCTOR`.
*   **`400 Bad Request`**: If required fields are missing, patientId is not a CITIZEN, item formats are invalid, or if any `medicineName` is not registered in the system.
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
          "prescriptionId": "test-id-1781250588410",
          "instructions": null,
          "dosageAmount": 1,
          "durationDays": 5,
          "frequencyPerDay": 2,
          "medicineId": "cmqarsq0q00007cqqbh3h9i0x",
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

---

## 10. Dashboard Analytics

Fetches aggregated statistics and analytics suited for the user's role. Supported for `REGULATOR` (Government) and `PHARMACY` roles.

*   **Endpoint**: `/api/analytics`
*   **Method**: `GET`
*   **Cookies**: Requires `token=<JWT_TOKEN>`
*   **Query Parameters**:
    * `year` (optional): The calendar year for monthly sales data (defaults to the current year).

### Success Response (`200 OK`)

#### Response for `REGULATOR` (Government Role)
```json
{
  "success": true,
  "role": "REGULATOR",
  "data": {
    "summary": {
      "totalNationalRevenue": 1540.50,
      "totalNationalItemsSold": 120,
      "totalNationalStockRemaining": 450
    },
    "salesByMedicine": [
      {
        "medicineId": "cmqarsq0q00007cqqbh3h9i0x",
        "medicineName": "Paracetamol",
        "unit": "mg",
        "totalQuantity": 80,
        "totalRevenue": 800.00
      }
    ],
    "monthlySales": [
      { "month": "Jan", "quantity": 10, "revenue": 100 },
      { "month": "Feb", "quantity": 15, "revenue": 150 },
      ...
    ],
    "bannedSalesAlerts": [
      {
        "id": "alert-uuid",
        "medicineName": "Banned Medicine Name",
        "quantityDispensed": 5,
        "pharmacyName": "Suspect Pharmacy Ltd",
        "pharmacyEmail": "pharmacy@suspect.demo",
        "dispensedAt": "2026-06-14T09:47:00.000Z"
      }
    ]
  }
}
```

#### Response for `PHARMACY` Role
```json
{
  "success": true,
  "role": "PHARMACY",
  "data": {
    "summary": {
      "totalRevenue": 450.00,
      "totalItemsSold": 35,
      "totalStockRemaining": 150
    },
    "inventory": [
      {
        "medicineId": "cmqarsq0q00007cqqbh3h9i0x",
        "medicineName": "Paracetamol",
        "unit": "mg",
        "stockRemaining": 100,
        "price": 10.00,
        "soldQuantity": 30,
        "totalSales": 300.00
      }
    ],
    "monthlySales": [
      { "month": "Jan", "quantity": 5, "revenue": 50 },
      ...
    ],
    "lowStockAlerts": [
      {
        "medicineId": "low-stock-uuid",
        "medicineName": "Amoxicillin",
        "unit": "mg",
        "stockRemaining": 5,
        "price": 15.00,
        "soldQuantity": 2,
        "totalSales": 30.00
      }
    ]
  }
}
```

### Error Responses
*   **`401 Unauthorized`**: If no active session JWT token is found.
*   **`403 Forbidden`**: If the logged-in user role is not `REGULATOR` or `PHARMACY`.
*   **`500 Internal Server Error`**: For database or query errors.

---

## 11. Medicine & Regulation Management

Endpoints to fetch registered medicines, register new medicines, and update active regulations (banning/limiting daily dosages).

### 11.1 Fetch All Medicines
Retrieves a list of all registered medicines along with their regulation files.

*   **Endpoint**: `/api/medicines`
*   **Method**: `GET`
*   **Cookies**: Requires `token=<JWT_TOKEN>`
*   **Query Parameters**:
    * `includeBanned` (optional, boolean): Set to `false` to filter out banned medicines. Defaults to `true`.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "demo-medicine-id-1",
      "name": "Paracetamol",
      "unit": "mg",
      "maxDosePerDay": 1000,
      "maxDurationDays": 10,
      "createdAt": "2026-06-14T09:47:00.000Z",
      "MedicineRegulation": {
        "id": "regulation-uuid-1",
        "medicineId": "demo-medicine-id-1",
        "scheduleClass": "UNCLASSIFIED",
        "isBanned": false,
        "maxDailyDosage": null,
        "maxDurationDays": null,
        "regulatorId": "regulator-uuid",
        "updatedAt": "2026-06-14T09:47:00.000Z"
      }
    }
  ],
  "total": 1
}
```

---

### 11.2 Register Medicine (Government Only)
Registers a new medicine in the system and establishes its initial regulations.

*   **Endpoint**: `/api/medicines`
*   **Method**: `POST`
*   **Content-Type**: `application/json`
*   **Cookies**: Requires `token=<JWT_TOKEN>` (Must have `REGULATOR` role)

#### Request Body Fields
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Unique name of the medicine |
| `maxDosePerDay` | `number` | **Yes** | Maximum allowed daily dose quantity |
| `maxDurationDays` | `number` | **Yes** | Maximum number of days allowed for prescription |
| `unit` | `string` | No | Dose unit (e.g. `mg`, `ml`). Defaults to `mg`. |
| `scheduleClass` | `string` | No | Schedule classification (e.g. `Schedule H`). Defaults to `UNCLASSIFIED`. |
| `isBanned` | `boolean` | No | Flag indicating if this medicine is banned. Defaults to `false`. |
| `maxDailyDosage` | `number` | No | Numeric regulation threshold for maximum daily dose |
| `regulationMaxDurationDays` | `number` | No | Numeric regulation threshold for maximum duration |

#### Request Example
```json
{
  "name": "Codeine Phosphate",
  "maxDosePerDay": 120,
  "maxDurationDays": 5,
  "unit": "mg",
  "scheduleClass": "Schedule H1",
  "isBanned": false,
  "maxDailyDosage": 60.0
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "new-medicine-uuid",
    "name": "Codeine Phosphate",
    "unit": "mg",
    ...
    "MedicineRegulation": {
      "id": "new-regulation-uuid",
      "scheduleClass": "Schedule H1",
      "isBanned": false,
      ...
    }
  }
}
```

#### Error Responses
*   **`403 Forbidden`**: If the logged-in user is not a `REGULATOR`.
*   **`400 Bad Request`**: If required fields are missing or if the medicine name is already registered.

---

### 11.3 Update Medicine and Regulations (Government Only)
Updates the details of a registered medicine and/or its corresponding active regulations.

*   **Endpoint**: `/api/medicines/[id]`
*   **Method**: `PATCH`
*   **Content-Type**: `application/json`
*   **Cookies**: Requires `token=<JWT_TOKEN>` (Must have `REGULATOR` role)

#### Request Body Fields (All Optional)
* `name`: string
* `unit`: string
* `maxDosePerDay`: number
* `maxDurationDays`: number
* `scheduleClass`: string
* `isBanned`: boolean
* `maxDailyDosage`: number
* `regulationMaxDurationDays`: number

#### Request Example (Banning a medicine)
```json
{
  "isBanned": true
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "medicine-uuid",
    "name": "Banned Medicine Name",
    ...
    "MedicineRegulation": {
      "id": "regulation-uuid",
      "isBanned": true,
      "updatedAt": "2026-06-14T10:48:00.000Z"
    }
  }
}
```

#### Error Responses
*   **`403 Forbidden`**: If the logged-in user is not a `REGULATOR`.
*   **`404 Not Found`**: If the medicine ID does not exist.



