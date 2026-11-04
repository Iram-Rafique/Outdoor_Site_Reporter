import process from "node:process";
import { exec } from "child_process";
import { promisify } from "util";
import { access } from "fs/promises";
import { resolve } from "path";

const execAsync = promisify(exec);

// Guardrail: Maximum number of rollback attempts
const MAX_ROLLBACKS = 1;

// ==========================================
// TOOL 1: Run tests
// ==========================================

async function runTests() {
  console.log("Tool: runTests()");

  // No test script is currently configured in this project.
  return {
    ok: true,
    skipped: true,
    reason: "No test suite configured; skipped"
  };
}

// ==========================================
// TOOL 2: Check code quality
// ==========================================

async function lintCode() {
  console.log("Tool: lintCode()");

  try {
    await execAsync("npm run lint");

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "lint errors",
      details: err.stderr || err.message
    };
  }
}

// ==========================================
// TOOL 3: Build the application
// ==========================================

async function buildApp() {
  console.log("Tool: buildApp()");

  try {
    await execAsync("npm run build");

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "build failed",
      details: err.stderr || err.message
    };
  }
}

// ==========================================
// TOOL 4: Check PWA files
// ==========================================

async function checkPWA() {
  console.log("Tool: checkPWA()");

  const requiredFiles = [
    "manifest.webmanifest",
    "sw.js"
  ];

  const missingFiles = [];

  for (const file of requiredFiles) {
    try {
      await access(resolve("dist", file));
    } catch {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    return {
      ok: false,
      reason: `Missing PWA files: ${missingFiles.join(", ")}`
    };
  }

  return {
    ok: true,
    reason: "PWA manifest and service worker found"
  };
}

// ==========================================
// TOOL 5: Deploy to Vercel
// ==========================================

async function deploy() {
  console.log("Tool: deploy()");

  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    return {
      ok: false,
      reason: "VERCEL_TOKEN is missing"
    };
  }

  try {
    await access(resolve(".vercel/project.json"));

    const { stdout } = await execAsync(
      "vercel deploy --prod --yes",
      {
        timeout: 300000,
        env: {
          ...process.env,
          VERCEL_TOKEN: token
        }
      }
    );

    // Vercel CLI outputs the deployment URL.
    const urlMatch = stdout.match(/https:\/\/[^\s]+/);

    if (!urlMatch) {
      return {
        ok: false,
        reason: "Deployment URL not found"
      };
    }

    const url = urlMatch[0].replace(/[),]+$/, "");

    return {
      ok: true,
      url
    };

  } catch (err) {
    return {
      ok: false,
      reason: "Vercel deployment failed",
      details: err.stderr || err.message
    };
  }
}

// ==========================================
// TOOL 6: Check deployment health
// ==========================================

async function checkHealth(url) {
  console.log(`Tool: checkHealth(${url})`);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000)
    });

    return {
      ok: response.status === 200,
      status: response.status
    };

  } catch {
    return {
      ok: false,
      reason: "health check request failed"
    };
  }
}

// ==========================================
// TOOL 7: Rollback deployment
// ==========================================

async function rollback() {
  console.log("Tool: rollback()");

  try {
    await execAsync("vercel rollback --yes", {
      timeout: 120000,
      env: {
        ...process.env,
        VERCEL_TOKEN: process.env.VERCEL_TOKEN
      }
    });

    return { ok: true };

  } catch (err) {
    return {
      ok: false,
      reason: "rollback failed",
      details: err.stderr || err.message
    };
  }
}

// ==========================================
// TOOL 8: Notify agent decisions
// ==========================================

async function notify(message) {
  console.log(`[AGENT] ${message}`);

  return { ok: true };
}

// ==========================================
// AGENT CONTROL LOOP
// ==========================================

async function runAgent() {
  console.log("\n================================");
  console.log("   OUTDOOR REPORTER DEPLOYMENT AGENT");
  console.log("================================\n");

  let rollbackCount = 0;

  await notify("Starting deployment pipeline");

  // STEP 1: Run tests

  const tests = await runTests();

  await notify(
    tests.skipped
      ? tests.reason
      : `Tests ${tests.ok ? "passed" : "failed"}`
  );

  if (!tests.ok) {
    await notify("Tests failed. Deployment blocked.");
    console.log("=== Agent finished: FAILED ===");
    return;
  }

  // STEP 2: Run lint

  const lint = await lintCode();

  await notify(`Lint ${lint.ok ? "passed" : "failed"}`);

  if (!lint.ok) {
    await notify("Lint failed. Deployment blocked.");
    console.error(lint.details || lint.reason);
    console.log("=== Agent finished: FAILED ===");
    return;
  }

  // STEP 3: Build application

  const build = await buildApp();

  await notify(`Build ${build.ok ? "successful" : "failed"}`);

  if (!build.ok) {
    await notify("Build failed. Deployment blocked.");
    console.error(build.details || build.reason);
    console.log("=== Agent finished: FAILED ===");
    return;
  }

  // STEP 4: Check PWA

  const pwa = await checkPWA();

  await notify(`PWA check: ${pwa.reason}`);

  if (!pwa.ok) {
    await notify("PWA check failed. Deployment blocked.");
    console.log("=== Agent finished: FAILED ===");
    return;
  }

  // STEP 5: Deploy to Vercel

  const deployment = await deploy();

  if (!deployment.ok) {
    await notify(`Deployment failed: ${deployment.reason}`);
    console.error(deployment.details || "");
    console.log("=== Agent finished: FAILED ===");
    return;
  }

  await notify(`Deployment successful: ${deployment.url}`);

  // STEP 6: Check deployment health

  const health = await checkHealth(deployment.url);

  if (health.ok) {
    await notify("Health check passed. Application is healthy.");
    console.log("\n=== Agent finished: SUCCESS ===");
    return;
  }

  // STEP 7: Decide whether to roll back

  await notify("Health check failed. Evaluating rollback decision.");

  if (rollbackCount >= MAX_ROLLBACKS) {
    await notify("Escalating to human. Maximum rollback limit reached.");
    console.log("=== Agent finished: ESCALATED ===");
    return;
  }

  // STEP 8: Attempt rollback

  rollbackCount++;

  await notify(`Attempting rollback ${rollbackCount}/${MAX_ROLLBACKS}`);

  const rollbackResult = await rollback();

  if (!rollbackResult.ok) {
    await notify("Rollback failed. Escalating to human.");
    console.error(rollbackResult.details || rollbackResult.reason);
    console.log("=== Agent finished: ESCALATED ===");
    return;
  }

  await notify("Rollback completed. Checking previous production deployment.");

  // A stable production URL is required to verify the rollback.
  const productionUrl = process.env.VERCEL_PRODUCTION_URL;

  if (!productionUrl) {
    await notify(
      "VERCEL_PRODUCTION_URL is missing. Human verification required."
    );
    console.log("=== Agent finished: ESCALATED ===");
    return;
  }

  const rollbackHealth = await checkHealth(productionUrl);

  if (rollbackHealth.ok) {
    await notify("Previous production deployment is healthy.");
    console.log("=== Agent finished: ROLLED BACK SUCCESSFULLY ===");
    return;
  }

  // Both conditions must be true to escalate.
  if (
    !rollbackHealth.ok &&
    rollbackCount >= MAX_ROLLBACKS
  ) {
    await notify("Escalating to human. Maximum rollback limit reached.");
    console.log("=== Agent finished: ESCALATED ===");
    return;
  }
}

// ==========================================
// START THE AGENT
// ==========================================

await runAgent();
