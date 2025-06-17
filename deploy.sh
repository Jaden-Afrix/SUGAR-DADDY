#!/bin/bash

# ===== CONFIGURATION =====
BOT_NAME="SUGAR DADDY BOT"
LOG_FILE="deployment.log"
SESSION_DIR="./session"
RESTART_DELAY=5  # seconds to wait before restarting on crash

# ===== FUNCTIONS =====
log_message() {
    local message="$1"
    local color="$2"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    case "$color" in
        green)  echo -e "\033[1;32m$timestamp $message\033[0m" ;;
        yellow) echo -e "\033[1;33m$timestamp $message\033[0m" ;;
        red)    echo -e "\033[1;31m$timestamp $message\033[0m" ;;
        blue)   echo -e "\033[1;34m$timestamp $message\033[0m" ;;
        *)      echo -e "$timestamp $message" ;;
    esac
    
    echo "$timestamp $message" >> "$LOG_FILE"
}

check_dependencies() {
    local missing=()
    
    if ! command -v node &> /dev/null; then
        missing+=("Node.js")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing+=("npm")
    fi
    
    if [ ${#missing[@]} -gt 0 ]; then
        log_message "❌ Missing dependencies: ${missing[*]}" "red"
        log_message "Please install them before proceeding" "red"
        exit 1
    fi
}

set_permissions() {
    log_message "🔐 Setting secure permissions..." "blue"
    find . -type d -exec chmod 755 {} +
    find . -type f -exec chmod 644 {} +
    chmod 755 index.js
    [ -d "$SESSION_DIR" ] && chmod 700 "$SESSION_DIR"
    log_message "✅ Permissions set securely" "green"
}

install_dependencies() {
    log_message "📦 Installing Node.js packages..." "blue"
    if npm install --silent; then
        log_message "✅ Dependencies installed successfully" "green"
    else
        log_message "❌ Failed to install dependencies" "red"
        exit 1
    fi
}

create_session_dir() {
    if [ ! -d "$SESSION_DIR" ]; then
        log_message "📂 Creating session directory..." "blue"
        if mkdir -p "$SESSION_DIR"; then
            chmod 700 "$SESSION_DIR"
            log_message "✅ Session directory created" "green"
        else
            log_message "❌ Failed to create session directory" "red"
            exit 1
        fi
    else
        log_message "📂 Session directory already exists" "yellow"
    fi
}

start_bot() {
    log_message "🚀 Starting $BOT_NAME..." "blue"
    log_message "💡 Press Ctrl+C to stop" "yellow"
    log_message "🔄 Auto-restart enabled (${RESTART_DELAY}s delay)" "yellow"
    
    while true; do
        node index.js 2>&1 | tee -a "$LOG_FILE"
        
        local exit_status=$?
        local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
        
        if [ $exit_status -eq 0 ]; then
            log_message "🛑 Bot stopped cleanly" "green"
            break
        else
            log_message "⚠️ Bot crashed with exit code $exit_status" "red"
            log_message "🔁 Restarting in ${RESTART_DELAY} seconds..." "yellow"
            sleep $RESTART_DELAY
        fi
    done
}

# ===== MAIN SCRIPT =====
clear
echo -e "\033[1;35m"
echo "   _____ ____  ____   ____  _____  _____  "
echo "  / ____/ __ \\|  _ \\ / __ \\|  __ \\|  __ \\ "
echo " | |  | |  | | |_) | |  | | |  | | |__) |"
echo " | |  | |  | |  _ <| |  | | |  | |  _  / "
echo " | |__| |__| | |_) | |__| | |__| | | \\ \\ "
echo "  \\_____\\____/|____/ \\____/|_____/|_|  \\_\\"
echo -e "\033[0m"
echo "=========================================="
echo "           DEPLOYMENT SYSTEM              "
echo "=========================================="

log_message "=== Starting $BOT_NAME Deployment ===" "blue"

# Initial checks
check_dependencies
create_session_dir
set_permissions
install_dependencies

# Start the bot with auto-restart
start_bot

log_message "=== Deployment Session Ended ===" "blue"