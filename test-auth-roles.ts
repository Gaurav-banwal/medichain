import { prisma } from "./lib/prisma";

async function runAuthTest() {
  console.log("=== STARTING AUTHENTICATION & ROLE TEST ===\n");

  const baseUrl = "http://localhost:3000";

  const testUsers = [
    {
      name: "Citizen Test Account",
      email: "citizen.test@medichain.io",
      password: "password123",
      role: "CITIZEN",
      walletAddress: "0x1000000000000000000000000000000000000001"
    },
    {
      name: "Doctor Test Account",
      email: "doctor.test@medichain.io",
      password: "password123",
      role: "DOCTOR",
      walletAddress: "0x2000000000000000000000000000000000000002"
    },
    {
      name: "Pharmacy Test Account",
      email: "pharmacy.test@medichain.io",
      password: "password123",
      role: "PHARMACY",
      walletAddress: "0x3000000000000000000000000000000000000003"
    },
    {
      name: "Regulator Admin Account",
      email: "admin@medichain.gov", // must match REGULATOR_ADMIN_EMAIL
      password: "password123",
      role: "REGULATOR",
      walletAddress: null
    }
  ];

  try {
    // Step 1: Cleanup test accounts in DB to run fresh
    console.log("Step 1: Cleaning up existing test accounts...");
    for (const tu of testUsers) {
      const existing = await prisma.user.findUnique({ where: { email: tu.email } });
      if (existing) {
        console.log(`- Deleting existing user: ${tu.email}`);
        await prisma.user.delete({ where: { email: tu.email } });
      }
    }
    console.log("Cleanup complete.\n");

    // Step 2: Test Registration (Signup API)
    console.log("Step 2: Testing user registration via POST /api/auth/signup...");
    for (const tu of testUsers) {
      console.log(`- Registering ${tu.role}: ${tu.email}...`);
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tu),
      });

      const data: any = await response.json();
      if (!response.ok) {
        console.error(`  ❌ FAILED: Status ${response.status} - ${JSON.stringify(data)}`);
        throw new Error(`Registration failed for ${tu.role}`);
      }

      console.log(`  ✅ SUCCESS: User registered. ID: ${data.user.id}`);
      
      // Check token cookie setting
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader && setCookieHeader.includes("token=")) {
        console.log("  ✅ SUCCESS: HttpOnly token cookie set in response.");
      } else {
        console.warn("  ⚠️ WARNING: No token cookie set in response header.");
      }
    }
    console.log("");

    // Step 3: Verify Data Stored in Backend (PostgreSQL Check)
    console.log("Step 3: Verifying data exists in the backend database...");
    for (const tu of testUsers) {
      const dbUser = await prisma.user.findUnique({ where: { email: tu.email } });
      if (dbUser) {
        console.log(`- Found ${dbUser.role} in PostgreSQL:`);
        console.log(`  Name: ${dbUser.name}`);
        console.log(`  Wallet: ${dbUser.walletAddress || "N/A"}`);
        console.log(`  Has passwordHash: ${!!dbUser.passwordHash}`);
        
        if (dbUser.role !== tu.role) {
          console.error(`  ❌ FAILED: Role mismatch! Expected ${tu.role}, got ${dbUser.role}`);
          throw new Error("Data corruption error");
        }
        console.log("  ✅ SUCCESS: Database records match request payload.");
      } else {
        console.error(`  ❌ FAILED: User ${tu.email} not found in database!`);
        throw new Error("Database record missing");
      }
    }
    console.log("");

    // Step 4: Test Login API
    console.log("Step 4: Testing user login via POST /api/auth/login...");
    for (const tu of testUsers) {
      console.log(`- Logging in as ${tu.role}: ${tu.email}...`);
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: tu.email,
          password: tu.password
        }),
      });

      const data: any = await response.json();
      if (!response.ok) {
        console.error(`  ❌ FAILED: Status ${response.status} - ${JSON.stringify(data)}`);
        throw new Error(`Login failed for ${tu.role}`);
      }

      console.log(`  ✅ SUCCESS: Login successful. User matches role: ${data.user.role}`);
      
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader && setCookieHeader.includes("token=")) {
        console.log("  ✅ SUCCESS: HttpOnly token cookie set in response.");
      } else {
        console.warn("  ⚠️ WARNING: No token cookie set in response header.");
      }
    }
    console.log("");

    // Step 5: Test Google Login and Role modal completion flow
    console.log("Step 5: Testing new Google user registration and role select API...");
    
    const demoEmail = "google-test-user@demo.io";
    const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
    if (existingDemo) {
      await prisma.user.delete({ where: { email: demoEmail } });
    }

    console.log(`- Initiating Google Sign In for ${demoEmail}...`);
    const resGoogleInitDemo = await fetch(`${baseUrl}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: "mock-google-credential" }),
    });

    const initData: any = await resGoogleInitDemo.json();
    if (initData.isNewUser) {
      console.log(`  ✅ SUCCESS: API flagged user as new: ${initData.email}`);
      
      // Step 6: Complete Google Registration
      console.log(`- Completing Google signup for ${initData.email} as CITIZEN...`);
      const resGoogleReg = await fetch(`${baseUrl}/api/auth/google/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: initData.email,
          name: initData.name,
          role: "CITIZEN",
          walletAddress: "0x9999999999999999999999999999999999999999"
        })
      });

      const regData: any = await resGoogleReg.json();
      if (resGoogleReg.ok) {
        console.log(`  ✅ SUCCESS: Google signup complete in DB. ID: ${regData.user.id}`);
        
        // Check DB directly
        const dbGUser = await prisma.user.findUnique({ where: { email: demoEmail } });
        if (dbGUser && dbGUser.role === "CITIZEN") {
          console.log(`  ✅ SUCCESS: Google user records verified in PostgreSQL database.`);
        } else {
          console.error("  ❌ FAILED: Google user database record validation failed.");
          throw new Error("Google registration record invalid");
        }
      } else {
        console.error(`  ❌ FAILED: ${JSON.stringify(regData)}`);
        throw new Error("Google registration endpoint failed");
      }
    } else {
      console.error(`  ❌ FAILED: Expected isNewUser: true, got ${JSON.stringify(initData)}`);
      throw new Error("Google initial endpoint failed");
    }

    console.log("\n=== ALL AUTHENTICATION AND ROLE TESTS PASSED SUCCESSFULLY ===");

  } catch (error) {
    console.error("\n❌ Test Suite Failed:", error);
  } finally {
    // Cleanup the database test accounts
    console.log("\nCleaning up test accounts from database...");
    for (const tu of testUsers) {
      try {
        await prisma.user.delete({ where: { email: tu.email } });
      } catch (e) {}
    }
    try {
      await prisma.user.delete({ where: { email: "google-test-user@demo.io" } });
    } catch (e) {}
    console.log("Cleanup done. Disconnecting prisma...");
    await prisma.$disconnect();
  }
}

runAuthTest();
