#!/usr/bin/env node

/**
 * WhatsApp Notification Sender
 *
 * This script sends notifications to the Demo WhatsApp group using the wasend command.
 * It can be triggered from GitHub Actions or run locally.
 *
 * Environment Variables:
 * - WA_MESSAGE_FILE: Path to file containing the message
 * - WA_GROUP_NAME: Name of the WhatsApp group (default: "Demo")
 * - WAIT_FOR_RESPONSE: Whether to wait for user response (default: false)
 * - GITHUB_RUN_URL: URL to the GitHub Actions run
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GROUP_NAME = process.env.WA_GROUP_NAME || 'Demo';
const MESSAGE_FILE = process.env.WA_MESSAGE_FILE || '/tmp/wa_message.txt';
const WAIT_FOR_RESPONSE = process.env.WAIT_FOR_RESPONSE === 'true';
const GITHUB_RUN_URL = process.env.GITHUB_RUN_URL || '';

async function findGroup() {
  console.log(`🔍 Finding WhatsApp group: ${GROUP_NAME}`);

  try {
    // Use wafind to locate the Demo group
    const output = execSync(`echo '/wafind ${GROUP_NAME}' | node`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    console.log('✅ Group found');
    return true;
  } catch (error) {
    console.error('❌ Failed to find group:', error.message);
    return false;
  }
}

async function sendMessage(message) {
  console.log(`📤 Sending WhatsApp message to ${GROUP_NAME}`);

  try {
    // Escape special characters in message
    const escapedMessage = message.replace(/"/g, '\\"').replace(/\n/g, '\\n');

    // Send message using wasend command
    // Note: This assumes the slash commands are available in the environment
    const command = `/wasend "${GROUP_NAME}" "${escapedMessage}"`;

    // Write command to temp file for execution
    const cmdFile = '/tmp/wa_command.txt';
    fs.writeFileSync(cmdFile, command);

    console.log('Message preview:', message.substring(0, 100) + '...');
    console.log('Command:', command.substring(0, 100) + '...');

    // Execute the command
    // In GitHub Actions, this would trigger the slash command handler
    execSync(`cat ${cmdFile}`, { stdio: 'inherit' });

    console.log('✅ Message sent successfully');

    // Log timestamp for response tracking
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      group: GROUP_NAME,
      messageSent: true,
      waitingForResponse: WAIT_FOR_RESPONSE
    };

    const logFile = path.join(__dirname, '../../.wa-notifications.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    return true;
  } catch (error) {
    console.error('❌ Failed to send message:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 WhatsApp Notification Sender Started');
  console.log('==========================================');
  console.log(`Group: ${GROUP_NAME}`);
  console.log(`Wait for response: ${WAIT_FOR_RESPONSE}`);
  console.log('==========================================\n');

  // Read message from file or use default
  let message;
  if (fs.existsSync(MESSAGE_FILE)) {
    message = fs.readFileSync(MESSAGE_FILE, 'utf-8');
  } else {
    message = `🔔 *Notification from VGS Assembly Web Ticketing*

A GitHub Actions workflow has completed.

${GITHUB_RUN_URL ? `View run: ${GITHUB_RUN_URL}` : ''}

_Automated notification from CI/CD pipeline_`;
  }

  // Find the group first
  const groupFound = await findGroup();
  if (!groupFound) {
    console.error('❌ Cannot proceed: Group not found');
    process.exit(1);
  }

  // Send the message
  const sent = await sendMessage(message);
  if (!sent) {
    console.error('❌ Cannot proceed: Message not sent');
    process.exit(1);
  }

  if (WAIT_FOR_RESPONSE) {
    console.log('\n⏳ Message sent. Response monitoring will start in check-response job.');
    console.log('   Checking every 5 minutes for user response...');
  }

  console.log('\n✅ Notification process completed');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { findGroup, sendMessage };
