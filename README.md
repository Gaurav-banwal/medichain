# 🏥 MediChain

### Decentralized Prescription Verification & Medicine Tracking System

MediChain is a blockchain-powered healthcare platform that enables secure prescription management, medicine verification, and government auditing through decentralized technologies.

The platform integrates DigiLocker-based identity verification, Polygon blockchain, IPFS storage, and role-based dashboards to create a transparent and tamper-proof healthcare ecosystem.

---

# 🚀 Problem Statement

Healthcare systems face several challenges:

* Fake and forged prescriptions
* Prescription reuse and abuse
* Lack of medicine traceability
* Counterfeit drug circulation
* Limited government audit capabilities
* Fragmented healthcare records

MediChain solves these problems by creating an immutable and verifiable prescription lifecycle using blockchain technology.

---

# 💡 Solution

MediChain provides a decentralized healthcare infrastructure where:

1. Citizens authenticate using DigiLocker.
2. Doctors create digital prescriptions.
3. Prescriptions are stored on IPFS.
4. IPFS hashes are recorded on Polygon Blockchain.
5. Pharmacies verify prescriptions before dispensing medicines.
6. Government regulators can audit all transactions in real time.

Every action is recorded on-chain, ensuring transparency and accountability.

---

# 🏗 System Architecture

```text
Citizen
   │
DigiLocker Authentication
   │
   ▼
Next.js Frontend
   │
   ▼
Backend API
   │
 ┌─────────────┬─────────────┐
 │             │             │
 ▼             ▼             ▼

PostgreSQL    IPFS       Polygon
(Database)   (Storage)  (Blockchain)
```

---

# 👥 User Roles

## 👤 Citizen

* Login via DigiLocker
* View prescriptions
* Track medicine history
* Verify medicine authenticity
* Access blockchain records

---

## 👨‍⚕️ Doctor

* Create prescriptions
* Upload prescription metadata to IPFS
* Publish records to blockchain
* Generate prescription QR codes
* Manage patient prescriptions

---

## 💊 Pharmacy

* Scan prescription QR codes
* Verify blockchain records
* Dispense medicines
* Update prescription status
* View verification history

---

## 🏛 Government Regulator

* Monitor prescription activity
* Audit blockchain records
* Generate reports
* Verify prescription lifecycle
* Investigate suspicious records

---

# 🔗 Prescription Lifecycle

```text
Doctor Creates Prescription
            │
            ▼
      Upload to IPFS
            │
            ▼
 Store Hash on Polygon
            │
            ▼
 Generate QR Code
            │
            ▼
 Pharmacy Verification
            │
            ▼
 Medicine Dispensed
            │
            ▼
 Government Audit Trail
```

---

# ⚙️ Tech Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* ShadCN UI
* Recharts

## Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL

## Blockchain

* Polygon Amoy Testnet
* Solidity
* Hardhat
* Ethers.js

## Storage

* IPFS
* Pinata

## Authentication

* DigiLocker OAuth

## Wallet

* MetaMask

---

# 🗄 Database Models

## User

```text
id
name
email
role
walletAddress
digilockerId
abhaId
```

## Prescription

```text
id
prescriptionId
doctorId
patientId
ipfsHash
status
expiryDate
```

## PrescriptionItem

```text
id
prescriptionId
medicineName
dosage
duration
quantity
```

## DispenseRecord

```text
id
prescriptionId
pharmacyId
dispensedAt
txHash
```

## BlockchainTransaction

```text
id
txHash
blockNumber
action
timestamp
```

## AuditLog

```text
id
userId
action
role
txHash
timestamp
```

---

# 🔐 Security Features

* DigiLocker-based identity verification
* Role-Based Access Control (RBAC)
* Blockchain immutability
* IPFS decentralized storage
* Secure wallet authentication
* Audit logging
* Prescription tamper prevention

---

# 📊 Key Features

### Prescription Verification

* Blockchain-backed prescriptions
* QR-based verification
* Duplicate prevention

### Medicine Tracking

* Dispensing history
* Medicine lifecycle tracking
* Prescription status management

### Government Auditability

* Immutable audit trail
* Real-time monitoring
* Regulatory reporting

### Transparency

* Decentralized records
* Public verification capability
* Traceable transactions

---

# 🌐 Deployment
Vercel


# 🏆 Hackathon Impact

MediChain demonstrates how blockchain can improve healthcare transparency, reduce prescription fraud, prevent counterfeit medicine distribution, and provide a trustworthy audit system for regulators.

The platform is designed as a hackathon MVP while remaining scalable for future integration with national healthcare infrastructure systems.

---

# 👨‍💻 Team

Built with ❤️ using Next.js, Polygon, IPFS, Prisma, PostgreSQL.

## Tagline

"Secure. Verifiable. Decentralized Healthcare."
