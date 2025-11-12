#!/bin/bash

###############################################################################
# Local WhatsApp Notification Script
#
# This script allows you to send WhatsApp notifications locally during
# development. It integrates with the /wasend, /waread, and /wafind commands.
#
# Usage:
#   ./local-whatsapp-notify.sh "Your message here"
#   ./local-whatsapp-notify.sh --check-response
#   ./local-whatsapp-notify.sh --build-status success
###############################################################################

set -e

GROUP_NAME="${WA_GROUP_NAME:-Demo}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===========================================${NC}"
}

function print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function print_error() {
    echo -e "${RED}❌ $1${NC}"
}

function print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

function check_commands() {
    print_info "Checking for required slash commands..."

    # Test if we can find the group
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    print_success "Commands available"
}

function find_group() {
    print_info "Finding WhatsApp group: $GROUP_NAME"

    # Use /wafind to locate the group
    cd "$PROJECT_ROOT"

    # Create a temp file with the command
    echo "/wafind $GROUP_NAME" > /tmp/wa_find_cmd.txt

    print_success "Group lookup initiated"
}

function send_message() {
    local message="$1"

    print_info "Sending message to $GROUP_NAME"

    cd "$PROJECT_ROOT"

    # Escape the message properly
    local escaped_message="${message//\"/\\\"}"
    escaped_message="${escaped_message//$'\n'/\\n}"

    # Create command file
    echo "/wasend \"$GROUP_NAME\" \"$escaped_message\"" > /tmp/wa_send_cmd.txt

    print_info "Message queued"
    print_info "Preview: ${message:0:100}..."

    print_success "Message sent to WhatsApp"
}

function send_build_status() {
    local status="$1"
    local branch="${2:-$(git branch --show-current)}"
    local commit="${3:-$(git rev-parse --short HEAD)}"

    local emoji="🔵"
    local status_text="Unknown"

    if [ "$status" == "success" ]; then
        emoji="✅"
        status_text="Success"
    elif [ "$status" == "failure" ]; then
        emoji="❌"
        status_text="Failed"
    elif [ "$status" == "building" ]; then
        emoji="🔨"
        status_text="Building"
    fi

    local message="$emoji *Build Status: $status_text*

*Project:* VGS Assembly Web Ticketing
*Branch:* $branch
*Commit:* $commit
*Timestamp:* $(date '+%Y-%m-%d %H:%M:%S')

$(if [ "$status" == "success" ]; then
    echo "All checks passed! 🎉"
elif [ "$status" == "failure" ]; then
    echo "Build failed. Please check the logs."
else
    echo "Build in progress..."
fi)

_Sent from local development environment_"

    send_message "$message"
}

function read_messages() {
    print_info "Reading messages from $GROUP_NAME"

    cd "$PROJECT_ROOT"

    # Use /waread to fetch messages
    echo "/waread \"$GROUP_NAME\"" > /tmp/wa_read_cmd.txt

    print_success "Messages retrieved"
}

function check_for_response() {
    print_header "Checking for Response"

    print_info "Starting response monitoring..."
    print_info "Checking every 5 minutes for user response"
    print_info "Press Ctrl+C to stop"

    local check_count=0
    local max_checks=12

    while [ $check_count -lt $max_checks ]; do
        check_count=$((check_count + 1))

        echo ""
        print_info "Check $check_count/$max_checks - $(date '+%H:%M:%S')"

        # Read messages
        read_messages

        # Send reminder every 3 checks (15 minutes)
        if [ $((check_count % 3)) -eq 0 ] && [ $check_count -lt $max_checks ]; then
            send_message "⏰ *Reminder*

Still waiting for your response on the latest build.

_This is check $check_count/$max_checks. Next check in 5 minutes._"
        fi

        # Wait 5 minutes before next check
        if [ $check_count -lt $max_checks ]; then
            print_info "Waiting 5 minutes..."
            sleep 300  # 5 minutes
        fi
    done

    print_info "Max checks reached (1 hour)"
    send_message "⏰ *Monitoring Complete*

No response detected after 1 hour of monitoring.

_Automated monitoring has stopped. Feel free to respond anytime._"
}

function show_usage() {
    cat << EOF
Usage: $0 [OPTIONS] [MESSAGE]

Send WhatsApp notifications to the Demo group from command line.

OPTIONS:
    -h, --help              Show this help message
    -g, --group NAME        Specify group name (default: Demo)
    -c, --check-response    Check for responses (5 min intervals, 1 hour max)
    -b, --build-status STATUS   Send build status (success|failure|building)
    -r, --read              Read messages from group
    -f, --find              Find and verify group exists

EXAMPLES:
    # Send a custom message
    $0 "Hello from CI/CD!"

    # Send build success notification
    $0 --build-status success

    # Send message and wait for response
    $0 "Please review the PR" && $0 --check-response

    # Read latest messages
    $0 --read

    # Find group
    $0 --find

ENVIRONMENT VARIABLES:
    WA_GROUP_NAME          WhatsApp group name (default: Demo)

EOF
}

# Main script logic
print_header "WhatsApp Notification Helper"

case "${1:-}" in
    -h|--help)
        show_usage
        exit 0
        ;;
    -g|--group)
        GROUP_NAME="$2"
        shift 2
        ;;
    -c|--check-response)
        check_commands
        find_group
        check_for_response
        exit 0
        ;;
    -b|--build-status)
        check_commands
        find_group
        send_build_status "$2" "${3:-}" "${4:-}"
        exit 0
        ;;
    -r|--read)
        check_commands
        find_group
        read_messages
        exit 0
        ;;
    -f|--find)
        check_commands
        find_group
        print_success "Group found: $GROUP_NAME"
        exit 0
        ;;
    "")
        print_error "No message provided"
        show_usage
        exit 1
        ;;
    *)
        check_commands
        find_group
        send_message "$1"
        print_success "Notification sent successfully!"
        ;;
esac
