import { Prescription } from '@/components/prescription/PrescriptionDetails';
import { TimelineEvent } from '@/components/dashboard/ActivityTimeline';
import { TransactionData } from '@/components/blockchain/TransactionCard';
import { VerifiedPrescription } from '@/components/pharmacy/VerificationCard';

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    prescriptionId: 'MC-482938',
    doctorName: 'Dr. Arjun Sharma',
    patientName: 'Ravi Kumar',
    abhaId: '91-2093-8472-1823',
    ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    status: 'ACTIVE',
    issueDate: 'Jun 10, 2026',
    expiryDate: 'Jul 10, 2026',
    medicines: [
      { name: 'Amoxicillin 500mg', dosage: '1-0-1', duration: '7 days', quantity: 14 },
      { name: 'Paracetamol 650mg', dosage: '1-1-1', duration: '5 days', quantity: 15 },
    ],
    txHash: '0x3bf9a8d9b1c7811ef123b1b7596e7614d1487595',
    blockNumber: 4829381,
  },
  {
    id: '2',
    prescriptionId: 'MC-293847',
    doctorName: 'Dr. Priya Mehta',
    patientName: 'Anita Singh',
    abhaId: '91-3847-2910-4823',
    ipfsHash: 'QmYWXjkrKiJW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6',
    status: 'DISPENSED',
    issueDate: 'Jun 01, 2026',
    expiryDate: 'Jul 01, 2026',
    medicines: [
      { name: 'Metformin 500mg', dosage: '1-0-1', duration: '30 days', quantity: 60 },
    ],
    txHash: '0x7e3a61f224b1c7812eb123b1b7596e7614d1487595',
    blockNumber: 4829378,
  },
  {
    id: '3',
    prescriptionId: 'MC-182736',
    doctorName: 'Dr. Suresh Nair',
    patientName: 'Mohan Das',
    abhaId: '91-1234-5678-9012',
    ipfsHash: 'QmZABCDefGHiJkLmNoPQrStUvWxYzABCDefGHiJkLmNoPQ',
    status: 'EXPIRED',
    issueDate: 'May 01, 2026',
    expiryDate: 'Jun 01, 2026',
    medicines: [
      { name: 'Atorvastatin 10mg', dosage: '0-0-1', duration: '90 days', quantity: 90 },
      { name: 'Aspirin 75mg', dosage: '1-0-0', duration: '90 days', quantity: 90 },
    ],
    txHash: '0x9d2e16f391b1c7812ab123b1b7596e7614d1487595',
    blockNumber: 4829352,
  },
  {
    id: '4',
    prescriptionId: 'MC-374859',
    doctorName: 'Dr. Arjun Sharma',
    patientName: 'Preethi Rajan',
    abhaId: '91-9876-5432-1098',
    ipfsHash: 'QmPQrStUvWxYzABCDefGHiJkLmNoPQrStUvWxYzABCDef',
    status: 'ACTIVE',
    issueDate: 'Jun 08, 2026',
    expiryDate: 'Jul 08, 2026',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1-0-0', duration: '30 days', quantity: 30 },
      { name: 'Losartan 50mg', dosage: '0-0-1', duration: '30 days', quantity: 30 },
    ],
    txHash: '0xf83c21a421b1c7812bb123b1b7596e7614d1487595',
    blockNumber: 4829310,
  },
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    title: 'Prescription MC-482938 Issued',
    description: 'Dr. Arjun Sharma issued prescription for Ravi Kumar. Metadata uploaded to IPFS and committed to Polygon.',
    timestamp: '2 mins ago',
    type: 'create',
    txHash: '0x3bf9a8d9b1c7811ef123b1b7596e7614d1487595',
  },
  {
    id: '2',
    title: 'MC-293847 Dispensed at Apollo Pharmacy',
    description: 'Metformin 500mg (60 units) dispensed after successful blockchain verification.',
    timestamp: '1 hour ago',
    type: 'dispense',
    txHash: '0x7e3a61f224b1c7812eb123b1b7596e7614d1487595',
  },
  {
    id: '3',
    title: 'Regulator Audit — Block #4829352',
    description: 'Government regulator ran automated compliance scan on 48 prescriptions in block range.',
    timestamp: '3 hours ago',
    type: 'audit',
  },
  {
    id: '4',
    title: 'MC-182736 Flagged — Expired',
    description: 'Citizen attempted to use expired prescription MC-182736. System blocked dispensing.',
    timestamp: '6 hours ago',
    type: 'flag',
    txHash: '0x9d2e16f391b1c7812ab123b1b7596e7614d1487595',
  },
];

export const mockTransactions: TransactionData[] = [
  {
    txHash: '0x3bf9a8d9b1c7811ef123b1b7596e7614d1487595',
    blockNumber: 4829381,
    fromAddress: '0x71C4B4E839878a7f9c41b1B7596E7614d1487595',
    toAddress: '0x0284c78129038cb2e93b1b7596e7614d1487595',
    action: 'Prescription Created',
    timestamp: '2 mins ago',
    gasUsed: '0.000421',
  },
  {
    txHash: '0x7e3a61f224b1c7812eb123b1b7596e7614d1487595',
    blockNumber: 4829378,
    fromAddress: '0x0284c78129038cb2e93b1b7596e7614d1487595',
    toAddress: '0x10b981249b1c7812eb123b1b7596e7614d1487595',
    action: 'Prescription Verified',
    timestamp: '1 hour ago',
    gasUsed: '0.000210',
  },
  {
    txHash: '0x9d2e16f391b1c7812ab123b1b7596e7614d1487595',
    blockNumber: 4829352,
    fromAddress: '0x10b981249b1c7812eb123b1b7596e7614d1487595',
    toAddress: '0x71C4B4E839878a7f9c41b1B7596E7614d1487595',
    action: 'Prescription Dispensed',
    timestamp: '3 hours ago',
    gasUsed: '0.000582',
  },
  {
    txHash: '0xf83c21a421b1c7812bb123b1b7596e7614d1487595',
    blockNumber: 4829310,
    fromAddress: '0x71C4B4E839878a7f9c41b1B7596E7614d1487595',
    toAddress: '0x0284c78129038cb2e93b1b7596e7614d1487595',
    action: 'Prescription Revoked',
    timestamp: '6 hours ago',
    gasUsed: '0.000311',
  },
];

export const mockVerifiedPrescription: VerifiedPrescription = {
  prescriptionId: 'MC-482938',
  patientName: 'Ravi Kumar',
  doctorName: 'Dr. Arjun Sharma',
  issueDate: 'Jun 10, 2026',
  expiryDate: 'Jul 10, 2026',
  status: 'ACTIVE',
  medicines: [
    { name: 'Amoxicillin 500mg', dosage: '1-0-1', quantity: 14 },
    { name: 'Paracetamol 650mg', dosage: '1-1-1', quantity: 15 },
  ],
  txHash: '0x3bf9a8d9b1c7811ef123b1b7596e7614d1487595',
  blockNumber: 4829381,
  ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
};

export const weeklyChartData = [
  { name: 'Mon', value: 12, value2: 8 },
  { name: 'Tue', value: 19, value2: 14 },
  { name: 'Wed', value: 15, value2: 11 },
  { name: 'Thu', value: 28, value2: 20 },
  { name: 'Fri', value: 22, value2: 18 },
  { name: 'Sat', value: 10, value2: 7 },
  { name: 'Sun', value: 8, value2: 5 },
];

export const monthlyChartData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 145 },
  { name: 'Mar', value: 198 },
  { name: 'Apr', value: 167 },
  { name: 'May', value: 212 },
  { name: 'Jun', value: 243 },
];
