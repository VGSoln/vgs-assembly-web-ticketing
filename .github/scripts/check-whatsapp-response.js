#!/usr/bin/env node

/**
 * WhatsApp Response Checker
 *
 * This script periodically checks for responses in the Demo WhatsApp group.
 * It runs at 5-minute intervals and stops when a response is detected or max checks reached.
 *
 * Environment Variables:
 * - WA_GROUP_NAME: Name of the WhatsApp group (default: "Demo")
 * - CHECK_INTERVAL_MINUTES: Minutes between checks (default: 5)
 * - MAX_CHECKS: Maximum number of checks before giving up (default: 12 = 1 hour)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GROUP_NAME = process.env.WA_GROUP_NAME || 'Demo';
const CHECK_INTERVAL_MINUTES = parseInt(process.env.CHECK_INTERVAL_MINUTES || '5');
const MAX_CHECKS = parseInt(process.env.MAX_CHECKS || '12');
const CHECK_INTERVAL_MS = CHECK_INTERVAL_MINUTES * 60 * 1000;

// Store the last message timestamp to detect new messages
let lastCheckTime = new Date();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readMessages() {
  console.log(`📬 Reading messages from ${GROUP_NAME}`);

  try {
    // Use waread to fetch messages from the Demo group
    const output = execSync(`echo '/waread ${GROUP_NAME}' | node`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Parse the output to extract messages
    // The actual format depends on the waread command implementation
    return output;
  } catch (error) {
    console.error('❌ Failed to read messages:', error.message);
    return null;
  }
}

function parseMessages(output) {
  // Parse the messages from waread output
  // This is a placeholder - adjust based on actual waread output format

  if (!output) return [];

  // Look for messages after our last check
  const messages = [];
  const lines = output.split('\n');

  for (const line of lines) {
    if (line.trim() && !line.startsWith('//')) {
      messages.push({
        text: line,
        timestamp: new Date()
      });
    }
  }

  return messages;
}

function hasNewResponse(messages) {
  // Check if there are any new messages after our notification was sent
  for (const msg of messages) {
    if (msg.timestamp > lastCheckTime) {
      return true;
    }
  }
  return false;
}

async function sendFollowUpMessage() {
  console.log('📤 Sending follow-up reminder');

  const message = `⏰ *Reminder: Awaiting your response*

The CI/CD pipeline completed and is waiting for your input.

Please respond in this chat if you've reviewed the build results.

_This is an automated follow-up. I'll check again in ${CHECK_INTERVAL_MINUTES} minutes._`;

  try {
    const command = `/wasend "${GROUP_NAME}" "${message.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
    execSync(`echo '${command}'`, { stdio: 'inherit' });
    console.log('✅ Follow-up sent');
  } catch (error) {
    console.error('❌ Failed to send follow-up:', error.message);
  }
}

async function checkLoop() {
  console.log('🔄 Starting response check loop');
  console.log(`   Interval: ${CHECK_INTERVAL_MINUTES} minutes`);
  console.log(`   Max checks: ${MAX_CHECKS} (${MAX_CHECKS * CHECK_INTERVAL_MINUTES} minutes total)`);
  console.log('==========================================\n');

  let checkCount = 0;
  let responseReceived = false;

  while (checkCount < MAX_CHECKS && !responseReceived) {
    checkCount++;
    console.log(`\n📊 Check ${checkCount}/${MAX_CHECKS} - ${new Date().toISOString()}`);

    // Read messages from the group
    const output = await readMessages();
    const messages = parseMessages(output);

    console.log(`   Found ${messages.length} message(s)`);

    // Check if there's a new response
    if (hasNewResponse(messages)) {
      console.log('✅ New response detected!');
      console.log('   Latest message:', messages[messages.length - 1].text.substring(0, 100));
      responseReceived = true;

      // Log the response
      const logFile = path.join(__dirname, '../../.wa-notifications.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        group: GROUP_NAME,
        responseReceived: true,
        checkNumber: checkCount
      };
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

      break;
    }

    // Send a follow-up reminder every 3 checks (15 minutes)
    if (checkCount % 3 === 0 && checkCount < MAX_CHECKS) {
      await sendFollowUpMessage();
    }

    // Wait before next check (unless this was the last check)
    if (checkCount < MAX_CHECKS && !responseReceived) {
      console.log(`   ⏳ Waiting ${CHECK_INTERVAL_MINUTES} minutes until next check...`);
      await sleep(CHECK_INTERVAL_MS);
    }
  }

  if (!responseReceived) {
    console.log('\n⏰ Max checks reached without response');
    console.log('   Total wait time:', MAX_CHECKS * CHECK_INTERVAL_MINUTES, 'minutes');

    // Send final notification
    const finalMessage = `⏰ *No Response Received*

After ${MAX_CHECKS * CHECK_INTERVAL_MINUTES} minutes of waiting, no response was detected.

The CI/CD pipeline has completed. Please review when you have time.

_Automated monitoring has stopped._`;

    try {
      const command = `/wasend "${GROUP_NAME}" "${finalMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
      execSync(`echo '${command}'`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to send final message:', error.message);
    }
  }

  return responseReceived;
}

async function main() {
  console.log('🔔 WhatsApp Response Checker Started');
  console.log('==========================================');
  console.log(`Group: ${GROUP_NAME}`);
  console.log(`Start time: ${new Date().toISOString()}`);
  console.log('==========================================');

  const responseReceived = await checkLoop();

  console.log('\n==========================================');
  console.log('✅ Response checker completed');
  console.log(`Final status: ${responseReceived ? 'Response received' : 'No response'}`);
  console.log('==========================================');

  process.exit(responseReceived ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { readMessages, parseMessages, checkLoop };
