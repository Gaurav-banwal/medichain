import { prisma } from '../lib/prisma';

async function checkColumns() {
  try {
    const columns = await prisma.$queryRaw<any[]>`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, column_name;
    `;
    console.log("COLUMNS IN DB:");
    columns.forEach(col => {
      console.log(`- ${col.table_name}.${col.column_name} (${col.data_type})`);
    });
  } catch (error) {
    console.error(error);
  }
}

checkColumns().catch(console.error).finally(() => prisma.$disconnect());
