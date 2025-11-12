# WhatsApp Integration Guide

This document explains how the VGS Assembly Web Ticketing System integrates with WhatsApp for CI/CD notifications and two-way communication.

## Overview

The WhatsApp integration provides:
- ✅ Automated CI/CD pipeline notifications
- ✅ Build status updates to the "Demo" WhatsApp group
- ✅ Response monitoring with 5-minute check intervals
- ✅ Local development notification tools
- ✅ Two-way communication for approvals and feedback

## Components

### 1. GitHub Actions Workflow

**File:** `.github/workflows/whatsapp-notify.yml`

Automatically sends notifications when CI/CD pipeline completes:
- Triggered after the main CI/CD workflow
- Sends success/failure messages with details
- Can wait for user responses before proceeding
- Manual trigger available with custom messages

### 2. Notification Scripts

#### `send-whatsapp-notification.js`
Sends messages to the Demo WhatsApp group using the `/wasend` command.

**Features:**
- Finds the target group using `/wafind`
- Formats and sends structured messages
- Logs sent messages for tracking
- Supports custom message templates

#### `check-whatsapp-response.js`
Monitors the Demo group for user responses.

**Features:**
- Checks for new messages every 5 minutes
- Sends follow-up reminders every 15 minutes
- Stops after 1 hour (12 checks) if no response
- Logs response activity

#### `local-whatsapp-notify.sh`
Command-line tool for local development notifications.

**Features:**
- Send custom messages from terminal
- Send build status notifications
- Read messages from the group
- Check for responses with automated monitoring
- Color-coded output for better UX

## Usage

### Automatic Notifications (GitHub Actions)

#### Pipeline Completion Notifications

Automatically triggered when CI/CD pipeline completes:

```yaml
# Success notification example:
✅ *CI/CD Pipeline Successful*

*Project:* VGS Assembly Web Ticketing
*Workflow:* CI/CD Pipeline
*Branch:* main
*Commit:* a1b2c3d
*Status:* Success

All checks passed! 🎉
Build artifacts are ready for deployment.

_View run:_ https://github.com/...
```

#### Manual Notification with Response Monitoring

Trigger manually from GitHub Actions page:

1. Go to Actions → WhatsApp Notifications
2. Click "Run workflow"
3. Enter custom message (optional)
4. Enable "Wait for user response" ✓
5. Click "Run workflow"

The system will:
- Send your message immediately
- Check for responses every 5 minutes
- Send reminders every 15 minutes
- Stop after 1 hour if no response

### Local Development Notifications

#### Send Custom Message

```bash
./.github/scripts/local-whatsapp-notify.sh "Your message here"
```

#### Send Build Status

```bash
# Success
./.github/scripts/local-whatsapp-notify.sh --build-status success

# Failure
./.github/scripts/local-whatsapp-notify.sh --build-status failure

# Building
./.github/scripts/local-whatsapp-notify.sh --build-status building
```

#### Read Messages

```bash
./.github/scripts/local-whatsapp-notify.sh --read
```

#### Check for Responses

```bash
./.github/scripts/local-whatsapp-notify.sh --check-response
```

This will:
- Monitor the Demo group for 1 hour
- Check every 5 minutes
- Send reminders every 15 minutes
- Stop when response detected or time expires

#### Find Group

```bash
./.github/scripts/local-whatsapp-notify.sh --find
```

### Using Slash Commands Directly

The scripts use these Claude Code slash commands:

#### Send Message
```
/wasend "Demo" "Your message here"
```

#### Read Messages
```
/waread "Demo"
```

#### Find Group
```
/wafind "Demo"
```

## Configuration

### Environment Variables

**For GitHub Actions:**
- `WA_GROUP_NAME` - WhatsApp group name (default: "Demo")
- `CHECK_INTERVAL_MINUTES` - Minutes between checks (default: 5)
- `MAX_CHECKS` - Maximum checks before timeout (default: 12)

**For Local Scripts:**
```bash
export WA_GROUP_NAME="Demo"
./.github/scripts/local-whatsapp-notify.sh "Message"
```

### Customizing Check Intervals

Edit `.github/workflows/whatsapp-notify.yml`:

```yaml
env:
  CHECK_INTERVAL_MINUTES: 5   # Change to desired interval
  MAX_CHECKS: 12               # Change for different timeout (checks * interval = total time)
```

## Integration with CI/CD Pipeline

### Current Setup

The WhatsApp workflow is triggered after the main CI/CD pipeline:

```yaml
# .github/workflows/ci-cd.yml
on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types: [completed]
```

### Adding Approval Gates

You can use WhatsApp responses as approval gates:

1. **Send notification with response monitoring:**
   ```yaml
   - name: Request deployment approval
     uses: ./.github/workflows/whatsapp-notify.yml
     with:
       message: "🚀 Ready to deploy to production. Reply 'approve' to proceed."
       wait_for_response: true
   ```

2. **Check response and proceed:**
   ```yaml
   - name: Deploy if approved
     if: contains(github.event.workflow_run.conclusion, 'success')
     run: |
       # Check response log
       if grep -q "approve" .wa-notifications.log; then
         npm run deploy
       fi
   ```

## Response Monitoring

### How It Works

1. **Initial Notification Sent**
   - Message sent to Demo group
   - Timestamp logged
   - Response monitoring begins

2. **Periodic Checks (Every 5 Minutes)**
   - Script reads messages using `/waread`
   - Compares timestamps to detect new messages
   - Logs any new activity

3. **Reminder Messages (Every 15 Minutes)**
   - After checks 3, 6, 9
   - Gentle reminders about pending action
   - Includes context and urgency info

4. **Timeout (After 1 Hour)**
   - Final notification sent
   - Monitoring stops
   - Logs timeout event

### Response Detection

The system detects new messages by:
- Comparing message timestamps
- Looking for messages newer than notification time
- Checking message content (optional)

## Message Templates

### Build Success

```
✅ *CI/CD Pipeline Successful*

*Project:* VGS Assembly Web Ticketing
*Workflow:* CI/CD Pipeline
*Branch:* main
*Commit:* a1b2c3d
*Status:* Success

All checks passed! 🎉
Build artifacts are ready for deployment.
```

### Build Failure

```
❌ *CI/CD Pipeline Failed*

*Project:* VGS Assembly Web Ticketing
*Workflow:* CI/CD Pipeline
*Branch:* main
*Commit:* a1b2c3d
*Status:* Failed

Please check the logs and fix the issues.
```

### Reminder

```
⏰ *Reminder: Awaiting your response*

The CI/CD pipeline completed and is waiting for your input.

Please respond in this chat if you've reviewed the build results.

_This is an automated follow-up. I'll check again in 5 minutes._
```

### Timeout

```
⏰ *No Response Received*

After 60 minutes of waiting, no response was detected.

The CI/CD pipeline has completed. Please review when you have time.

_Automated monitoring has stopped._
```

## Troubleshooting

### Messages Not Sending

**Check:**
1. WhatsApp slash commands are available
2. Group name is correct (case-sensitive)
3. Node.js is installed
4. Scripts have execute permissions

**Debug:**
```bash
# Test group lookup
./.github/scripts/local-whatsapp-notify.sh --find

# Check logs
cat .wa-notifications.log
```

### Response Not Detected

**Check:**
1. Timing - response must be after notification
2. Group name matches exactly
3. `/waread` command is working

**Debug:**
```bash
# Manually read messages
./.github/scripts/local-whatsapp-notify.sh --read
```

### GitHub Actions Not Triggering

**Check:**
1. Workflow file syntax
2. CI/CD pipeline completed
3. Repository permissions
4. Workflow is enabled

**Debug:**
```bash
# Validate workflow file
gh workflow view whatsapp-notify
```

## Security Considerations

### WhatsApp Credentials

- Slash commands handle authentication internally
- No credentials stored in code or environment variables
- Commands use Claude Code's built-in WhatsApp integration

### Message Content

- Don't include sensitive data in notifications
- Use links to GitHub for detailed information
- Avoid exposing API keys or secrets

### Access Control

- Only authorized users can trigger manual workflows
- Response monitoring is read-only
- Group membership controls notification access

## Advanced Usage

### Custom Message Formatting

Messages support WhatsApp markdown:

```javascript
const message = `
*Bold text*
_Italic text_
~Strikethrough~
\`\`\`Code block\`\`\`

• Bullet points
1. Numbered lists
`;
```

### Conditional Notifications

Only notify on specific events:

```yaml
jobs:
  notify-on-failure:
    if: github.event.workflow_run.conclusion == 'failure'
    # ... notification steps
```

### Multi-Group Notifications

Send to multiple groups:

```bash
for group in "Demo" "Dev Team" "Stakeholders"; do
  WA_GROUP_NAME="$group" ./.github/scripts/local-whatsapp-notify.sh "Message"
done
```

## Best Practices

1. **Use Response Monitoring Sparingly**
   - Only for critical approvals
   - Set reasonable timeout limits
   - Provide clear context

2. **Keep Messages Concise**
   - Mobile-friendly format
   - Key info at top
   - Links for details

3. **Test Locally First**
   - Use local script for testing
   - Verify group connectivity
   - Check message formatting

4. **Monitor Notification Logs**
   - Review `.wa-notifications.log`
   - Track response times
   - Identify patterns

5. **Handle Timeouts Gracefully**
   - Don't block deployments
   - Provide alternative paths
   - Log timeout events

## Examples

### Example 1: Deploy Approval Workflow

```bash
# 1. Send approval request
./.github/scripts/local-whatsapp-notify.sh \
  "🚀 Build complete. Ready to deploy to production. Reply 'APPROVE' to proceed."

# 2. Start response monitoring
./.github/scripts/local-whatsapp-notify.sh --check-response

# 3. Check result and deploy
if grep -q "APPROVE" .wa-notifications.log; then
  echo "Approved! Deploying..."
  npm run deploy
fi
```

### Example 2: Test Failure Alert

```bash
# Send test failure notification
./.github/scripts/local-whatsapp-notify.sh --build-status failure

# Include error summary
./.github/scripts/local-whatsapp-notify.sh \
  "❌ Test failures detected:

  • API tests: 3 failures
  • Component tests: 1 failure

  See logs: $GITHUB_RUN_URL"
```

### Example 3: Scheduled Status Update

```bash
# Daily summary (add to cron or GitHub Actions schedule)
./.github/scripts/local-whatsapp-notify.sh \
  "📊 Daily Summary - $(date +%Y-%m-%d)

  • Builds: 12 successful, 1 failed
  • Deployments: 3 to staging
  • Test coverage: 87%

  All systems operational ✅"
```

## Maintenance

### Log Management

Notification logs accumulate over time:

```bash
# View logs
cat .wa-notifications.log

# Clean old logs (keep last 30 days)
find . -name ".wa-notifications.log" -mtime +30 -delete

# Archive logs
tar -czf wa-logs-$(date +%Y%m).tar.gz .wa-notifications.log
mv .wa-notifications.log .wa-notifications.log.old
```

### Script Updates

When updating scripts:

1. Test locally first
2. Check syntax with shellcheck (bash) or node (js)
3. Update documentation
4. Test in CI/CD environment
5. Monitor first few runs

## Support

For issues or questions:
1. Check this documentation
2. Review `.wa-notifications.log` for errors
3. Test with local script first
4. Check GitHub Actions logs
5. Verify slash command availability

---

**Last Updated:** 2025-11-09
**Version:** 1.0.0
