import { prisma } from '../lib/prisma';

async function check() {
  const users = await prisma.user.findMany();
  console.log("USERS:", users.map(u => ({ id: u.id, email: u.email, role: u.role })));
  
  const prescriptions = await prisma.prescription.findMany({
    include: {
      User_Prescription_patientIdToUser: true,
      User_Prescription_doctorIdToUser: true
    }
  });
  console.log("PRESCRIPTIONS:", prescriptions.map(p => ({
    id: p.id,
    prescriptionId: p.prescriptionId,
    patientEmail: p.User_Prescription_patientIdToUser?.email,
    doctorEmail: p.User_Prescription_doctorIdToUser?.email,
    status: p.status
  })));
}

check().catch(console.error).finally(() => prisma.$disconnect());
