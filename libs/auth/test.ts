import {
  createUser,
  findUserByEmail,
  signToken,
  verifyToken,
} from './index';
import prisma from '../prisma';

async function runTests() {
  console.log('--- Starting JWT Auth & Prisma DB Tests (Gmail/OAuth Setup) ---\n');

  try {
    // 1. Prisma DB Operations
    console.log('[Test 1] Prisma DB Operations...');
    
    // Clean up past test users
    console.log('- Cleaning up previous test user if exists...');
    await prisma.user.deleteMany({
      where: { email: 'john.doe@medichain.org' },
    });
    
    const userPayload = {
      name: 'John Doe',
      email: 'john.doe@medichain.org',
      role: 'DOCTOR' as const,
      walletAddress: '0x1234567890123456789012345678901234567890',
    };

    console.log('- Creating user in database...');
    const user = await createUser(userPayload);
    console.log(`- Created User ID: ${user.id}`);

    console.log('- Fetching user by email...');
    const fetchedUser = await findUserByEmail('john.doe@medichain.org');
    if (!fetchedUser || fetchedUser.name !== 'John Doe') {
      throw new Error('Could not retrieve created user by email');
    }
    console.log('✅ Prisma DB operations passed.\n');

    // 2. JWT Signing and Verification
    console.log('[Test 2] JWT Signing & Verification...');
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    console.log('- Signing JWT token...');
    const token = signToken(jwtPayload, '1h');
    console.log(`- Signed Token: ${token.substring(0, 40)}...`);

    console.log('- Verifying token...');
    interface DecodedToken {
      userId: string;
      email: string;
      role: string;
    }

    const decoded = verifyToken<DecodedToken>(token);
    console.log(`- Decoded User ID: ${decoded.userId}`);
    console.log(`- Decoded Email: ${decoded.email}`);
    console.log(`- Decoded Role: ${decoded.role}`);

    if (decoded.userId !== user.id || decoded.email !== user.email || decoded.role !== user.role) {
      throw new Error('Decoded token payload does not match original payload');
    }

    // Verify token error handling
    console.log('- Testing invalid token handling...');
    try {
      verifyToken('invalid.jwt.token');
      throw new Error('Verification should have failed for invalid token');
    } catch (err: any) {
      console.log(`- Received expected error: "${err.message}"`);
      if (err.message !== 'Invalid token') {
        throw new Error(`Unexpected error message: ${err.message}`);
      }
    }
    console.log('✅ JWT Signing & Verification passed.\n');

    // Final database cleanup
    console.log('- Performing final database cleanup...');
    await prisma.user.deleteMany({
      where: { email: 'john.doe@medichain.org' },
    });

    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    // Disconnect prisma client
    await prisma.$disconnect();
  }
}

runTests();
