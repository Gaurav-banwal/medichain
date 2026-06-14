import { prisma } from '../lib/prisma';

async function cleanup() {
  await prisma.user.deleteMany({
    where: { email: "gauravabanwal1234@gmail.com" }
  });
  console.log("Cleanup complete!");
}

cleanup().catch(console.error).finally(() => prisma.$disconnect());
