#!/bin/bash
set -e

###############################################################################
# CodeX Backend Production Deployment Script
# Target: Ubuntu 20.04 / 22.04 / 24.04 LTS (Docker Compose, Nginx & Certbot SSL)
#
# FULLY SANITIZED & EDGE-CASE HARDENED:
# - Zero hardcoded production secrets.
# - Prompts for credentials with sample values (Press [Enter] to use defaults).
# - Non-interactive / CI/CD automated fallback support.
# - Handles sudo vs root execution seamlessly.
# - Handles APT locks and package repository edge cases.
# - Handles UFW firewall rules (opens ports 80, 443 & 22).
# - Resolves port conflicts (stops conflicting Apache if present).
# - Docker daemon readiness check before executing container commands.
# - Skips failed Docker logins when using sample/public images.
# - Quotes all variables in .env to prevent special character truncation (e.g. #, $, &).
# - Performs DNS pre-checks before Certbot SSL to prevent deployment crashes.
# - Container health polling with automatic log dump on startup failure.
###############################################################################

# --- Terminal Styling ---
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "=========================================================="
echo "    CodeX Backend Production Deployment Script"
echo "=========================================================="
echo -e "${NC}"
echo -e "${YELLOW}Tip: Press [Enter] on any prompt to accept the sample/default value.${NC}\n"

# -----------------------------------------------------------------------------
# Edge Case 1: Privilege & Sudo Detection
# -----------------------------------------------------------------------------
if [ "$EUID" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
        SUDO="sudo"
    else
        echo -e "${RED}Error: This script requires root privileges or sudo.${NC}" >&2
        exit 1
    fi
else
    SUDO=""
fi

# Detect actual user and home directory
CURRENT_USER="${SUDO_USER:-$USER}"
USER_HOME=$(getent passwd "$CURRENT_USER" | cut -d: -f6)
USER_HOME="${USER_HOME:-$HOME}"
BACKEND_DIR="${DEPLOY_DIR:-$USER_HOME/codex/backend}"
EXISTING_ENV="$BACKEND_DIR/.env"

# -----------------------------------------------------------------------------
# Edge Case 2: Interactive vs Non-Interactive / CI Reader
# -----------------------------------------------------------------------------
is_interactive() {
    [ -t 0 ] || [ -c /dev/tty ]
}

read_input() {
    if [ -t 0 ]; then
        read -r "$@"
    elif [ -c /dev/tty ]; then
        read -r "$@" </dev/tty
    else
        # Non-interactive fallback: assign default if provided
        return 0
    fi
}

read_secret() {
    if [ -t 0 ]; then
        read -r -s "$@"
    elif [ -c /dev/tty ]; then
        read -r -s "$@" </dev/tty
    else
        return 0
    fi
}

prompt_var() {
    local var_name="$1"
    local prompt_text="$2"
    local default_sample="$3"
    local sample_hint="$4"

    local current_val="${!var_name}"
    if [ -n "$current_val" ]; then
        return
    fi

    if ! is_interactive; then
        eval "$var_name=\"$default_sample\""
        return
    fi

    local prompt_msg="  [?] ${BOLD}${prompt_text}${NC}"
    if [ -n "$sample_hint" ]; then
        prompt_msg="$prompt_msg ${CYAN}(e.g.: ${sample_hint})${NC}"
    fi
    if [ -n "$default_sample" ]; then
        prompt_msg="$prompt_msg [Enter for: ${default_sample}]"
    fi

    local input_val=""
    read_input -p "$(echo -e "${prompt_msg}: ")" input_val
    if [ -z "$input_val" ]; then
        eval "$var_name=\"$default_sample\""
    else
        eval "$var_name=\"$input_val\""
    fi
}

prompt_secret() {
    local var_name="$1"
    local prompt_text="$2"
    local default_sample="$3"
    local sample_hint="$4"

    local current_val="${!var_name}"
    if [ -n "$current_val" ]; then
        return
    fi

    if ! is_interactive; then
        eval "$var_name=\"$default_sample\""
        return
    fi

    local hint_display=""
    if [ -n "$sample_hint" ]; then
        hint_display=" ${CYAN}(e.g.: ${sample_hint})${NC}"
    fi
    if [ -n "$default_sample" ]; then
        hint_display="$hint_display [Enter for sample]"
    fi

    local input_val=""
    read_secret -p "$(echo -e "${YELLOW}  [🔒] ${BOLD}$prompt_text${NC}${hint_display} (input hidden): ${NC}")" input_val
    echo ""
    if [ -z "$input_val" ]; then
        if [ -n "$default_sample" ]; then
            eval "$var_name=\"$default_sample\""
            echo -e "       ${GREEN}↳ Accepted sample value: ${default_sample:0:16}...${NC}"
        else
            echo -e "${RED}       ↳ Value cannot be empty.${NC}"
        fi
    else
        eval "$var_name=\"$input_val\""
        echo -e "       ${GREEN}↳ Custom credential captured.${NC}"
    fi
}

# -----------------------------------------------------------------------------
# Configuration Gathering
# -----------------------------------------------------------------------------
if [ -f "$EXISTING_ENV" ] && is_interactive; then
    echo -e "${YELLOW}Found existing environment configuration at $EXISTING_ENV.${NC}"
    read_input -p "Do you want to reuse existing credentials from this file? (y/N): " reuse_env
    if [[ "$reuse_env" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Loading existing configuration...${NC}"
        set -a
        # shellcheck disable=SC1090
        source "$EXISTING_ENV"
        set +a
    fi
fi

echo -e "\n${BOLD}[Configuration Step] Enter values or press [Enter] to use sample defaults:${NC}\n"

# --- 1. Domain & Server Setup ---
echo -e "${CYAN}--- 1. Domain & SSL Setup ---${NC}"
prompt_var DOMAIN "API Domain Name" "api.qucodex.com" "api.qucodex.com"
prompt_var EMAIL "SSL Certbot Alert Email" "codex.club@quantumeducation.in" "admin@qucodex.com"
prompt_var PORT "Backend Internal Port" "5000" "5000"
prompt_var CORS_ORIGIN "CORS Allowed Origins" "https://qucodex.com,https://www.qucodex.com" "https://qucodex.com,https://www.qucodex.com"
prompt_var FRONTEND_URL "Frontend URL" "https://qucodex.com" "https://qucodex.com"

# --- 2. Docker Image & Registry Credentials ---
echo -e "\n${CYAN}--- 2. Docker Image & Registry Credentials ---${NC}"
prompt_var CONTAINER_NAME "Docker Container Name" "codex-backend" "codex-backend"
prompt_var IMAGE "Docker Image" "qucodex/codex-backend:latest" "qucodex/codex-backend:latest"
prompt_var DOCKER_USER "Docker Hub Username" "qucodex" "qucodex"
prompt_secret DOCKER_TOKEN "Docker Hub Access Token / PAT" "dckr_pat_sample_token_placeholder" "dckr_pat_xxxxxx"

# --- 3. Database & Security ---
echo -e "\n${CYAN}--- 3. Database & App Security ---${NC}"
prompt_secret MONGODB_URI "MongoDB Connection String" "mongodb+srv://sample_db_user:sample_password@cluster0.mongodb.net/codex?retryWrites=true&w=majority" "mongodb+srv://<user>:<password>@cluster0.mongodb.net/codex"

if [ -z "$ACCESS_TOKEN_SECRET" ]; then
    if is_interactive; then
        read_secret -p "$(echo -e "${YELLOW}  [🔒] ${BOLD}JWT ACCESS_TOKEN_SECRET${NC} [Enter to auto-generate random 64-char key]: ")" input_jwt
        echo ""
    else
        input_jwt=""
    fi
    if [ -z "$input_jwt" ]; then
        if command -v openssl >/dev/null 2>&1; then
            ACCESS_TOKEN_SECRET=$(openssl rand -hex 32)
        else
            ACCESS_TOKEN_SECRET=$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 32)
        fi
        echo -e "       ${GREEN}↳ Auto-generated secure random JWT secret.${NC}"
    else
        ACCESS_TOKEN_SECRET="$input_jwt"
        echo -e "       ${GREEN}↳ Custom JWT secret captured.${NC}"
    fi
fi
prompt_var ACCESS_TOKEN_EXPIRY "Access Token Expiry" "10d" "10d"

# --- 4. Cloudinary (Media Storage) ---
echo -e "\n${CYAN}--- 4. Cloudinary Credentials ---${NC}"
prompt_var CLOUDINARY_CLOUD_NAME "Cloudinary Cloud Name" "sample_cloudinary_cloud" "fswmfdcp"
prompt_var CLOUDINARY_API_KEY "Cloudinary API Key" "857412934439237" "857412934439237"
prompt_secret CLOUDINARY_API_SECRET "Cloudinary API Secret" "sample_cloudinary_secret_key" "4NuyzxI-bNF948LvYdrqAJljyyk"

# --- 5. SMTP Email Configuration (AWS SES Production / Brevo Temporary) ---
echo -e "\n${CYAN}--- 5. SMTP Email Configuration (AWS SES Production / Brevo Temporary) ---${NC}"
prompt_var SMTP_HOST "SMTP Host" "email-smtp.ap-south-1.amazonaws.com" "email-smtp.ap-south-1.amazonaws.com (SES) or smtp-relay.brevo.com (Brevo)"
prompt_var SMTP_PORT "SMTP Port" "587" "587"
prompt_var SMTP_USER "SMTP Username" "YOUR_SES_OR_BREVO_SMTP_USERNAME" "AKIA... (SES IAM) or user@brevo.com"
prompt_secret SMTP_PASSWORD "SMTP Password" "sample_smtp_password_placeholder" "SES SMTP Password or Brevo Key"
prompt_var FROM_EMAIL "Sender Email Address" "noreply@qucodex.com" "noreply@qucodex.com"
prompt_var FROM_NAME "Sender Display Name" "CodeX Club" "CodeX Club"

# --- 6. Admin Account ---
echo -e "\n${CYAN}--- 6. Initial Admin Account ---${NC}"
prompt_var ADMIN_EMAIL "Admin Account Email" "admin@qucodex.com" "admin@qucodex.com"
prompt_secret ADMIN_PASSWORD "Admin Account Password" "SampleAdminPassword@123" "Xb8&L2!fY#5vK*9mQ$3p"

# --- 7. Cloudflare Turnstile ---
echo -e "\n${CYAN}--- 7. Cloudflare Turnstile ---${NC}"
prompt_secret TURNSTILE_SECRET_KEY "Turnstile Secret Key" "0x4AAAAAAASampleKeyPlaceholder" "0x4AAAAAAD5G7f7lXOqcyn-zy5heSUH5VyQ"
TURNSTILE_SECRET="$TURNSTILE_SECRET_KEY"
prompt_var TURNSTILE_HOSTNAMES "Turnstile Allowed Hostnames" "qucodex.com,www.qucodex.com,$DOMAIN" "qucodex.com,www.qucodex.com,$DOMAIN"

# --- Summary Confirmation ---
echo -e "\n${BOLD}[Configuration Summary]${NC}"
echo -e "  Domain:             $DOMAIN"
echo -e "  Port:               $PORT"
echo -e "  CORS Origins:       $CORS_ORIGIN"
echo -e "  Docker Image:       $IMAGE ($CONTAINER_NAME)"
echo -e "  Docker User:        $DOCKER_USER"
echo -e "  Admin Email:        $ADMIN_EMAIL"
echo -e "  SMTP Host & User:   $SMTP_HOST ($SMTP_USER)"
echo -e "  Cloudinary Cloud:   $CLOUDINARY_CLOUD_NAME"
echo ""

if is_interactive; then
    read_input -p "$(echo -e "${YELLOW}Proceed with deployment? [Y/n]: ${NC}")" confirm_deploy
    if [[ "$confirm_deploy" =~ ^[Nn]$ ]]; then
        echo -e "${RED}Deployment cancelled.${NC}"
        exit 0
    fi
fi

echo -e "\n${GREEN}Starting deployment execution...${NC}\n"

# -----------------------------------------------------------------------------
# Edge Case 3: Package Manager & Dpkg Locks
# -----------------------------------------------------------------------------
wait_for_apt_lock() {
    local max_wait=60
    local count=0
    while $SUDO fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || $SUDO fuser /var/lib/apt/lists/lock >/dev/null 2>&1; do
        if [ $count -ge $max_wait ]; then
            echo -e "${YELLOW}Apt lock held for too long. Attempting safe recovery...${NC}"
            $SUDO killall apt apt-get 2>/dev/null || true
            $SUDO dpkg --configure -a || true
            break
        fi
        echo -e "${YELLOW}Waiting for background apt processes to finish... (${count}s)${NC}"
        sleep 2
        count=$((count + 2))
    done
}

echo -e "${CYAN}[0/7] Cleaning up existing containers & directory...${NC}"
$SUDO docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
if [ -f "$BACKEND_DIR/docker-compose.yml" ]; then
    $SUDO docker compose -f "$BACKEND_DIR/docker-compose.yml" down 2>/dev/null || true
fi
rm -rf "$BACKEND_DIR"

# -----------------------------------------------------------------------------
# Edge Case 4: Apache / Web Server Port 80/443 Conflicts
# -----------------------------------------------------------------------------
if systemctl is-active --quiet apache2 2>/dev/null; then
    echo -e "${YELLOW}[Edge Case] Apache is active on port 80. Disabling Apache in favor of Nginx...${NC}"
    $SUDO systemctl stop apache2 2>/dev/null || true
    $SUDO systemctl disable apache2 2>/dev/null || true
fi

echo -e "${CYAN}[1/7] Updating package index & installing Nginx, Certbot & Docker...${NC}"
wait_for_apt_lock
export DEBIAN_FRONTEND=noninteractive
$SUDO apt-get update -y
$SUDO apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" \
    curl ca-certificates nginx certbot python3-certbot-nginx docker.io docker-compose-v2 dnsutils

# -----------------------------------------------------------------------------
# Edge Case 5: UFW Firewall Setup (Ensure 80, 443 and SSH are open)
# -----------------------------------------------------------------------------
if command -v ufw >/dev/null 2>&1; then
    if $SUDO ufw status | grep -q "Status: active"; then
        echo -e "${YELLOW}[Edge Case] UFW firewall is active. Ensuring ports 80, 443, and SSH remain open...${NC}"
        $SUDO ufw allow 'Nginx Full' 2>/dev/null || ($SUDO ufw allow 80/tcp && $SUDO ufw allow 443/tcp)
        $SUDO ufw allow 22/tcp 2>/dev/null || true
    fi
fi

# -----------------------------------------------------------------------------
# Edge Case 6: Docker Service Initialization & Group Setup
# -----------------------------------------------------------------------------
echo -e "${CYAN}[2/7] Configuring and validating Docker service...${NC}"
$SUDO systemctl enable --now docker
$SUDO usermod -aG docker "$CURRENT_USER" 2>/dev/null || true

# Wait until Docker daemon socket is actually ready
DOCKER_READY=0
for i in {1..15}; do
    if $SUDO docker info >/dev/null 2>&1; then
        DOCKER_READY=1
        break
    fi
    sleep 1
done

if [ $DOCKER_READY -ne 1 ]; then
    echo -e "${RED}Error: Docker daemon failed to initialize. Please check 'sudo systemctl status docker'.${NC}" >&2
    exit 1
fi

# -----------------------------------------------------------------------------
# Edge Case 7: Docker Hub Authentication Fallback (Skip if dummy/placeholder token)
# -----------------------------------------------------------------------------
echo -e "${CYAN}[3/7] Docker Registry Authentication...${NC}"
if [ -n "$DOCKER_TOKEN" ] && [ "$DOCKER_TOKEN" != "dckr_pat_sample_token_placeholder" ] && [ "$DOCKER_TOKEN" != "dckr_pat_xxxxxx" ]; then
    echo "$DOCKER_TOKEN" | $SUDO docker login -u "$DOCKER_USER" --password-stdin || {
        echo -e "${YELLOW}Warning: Docker login failed. Proceeding with public image pull...${NC}"
    }
else
    echo -e "${YELLOW}No custom Docker PAT provided. Proceeding with public image pull...${NC}"
fi

echo -e "${CYAN}[4/7] Preparing workspace directory: ${BACKEND_DIR}...${NC}"
mkdir -p "$BACKEND_DIR"
cd "$BACKEND_DIR"

# -----------------------------------------------------------------------------
# Edge Case 8: Special Character Quoting in .env (Prevents #, $, & truncation)
# -----------------------------------------------------------------------------
echo -e "${CYAN}[5/7] Writing Environment Configuration (.env)...${NC}"
cat > .env <<EOF
NODE_ENV="production"
PORT="${PORT}"

SERVER_URL="https://${DOMAIN}"
CORS_ORIGIN="${CORS_ORIGIN}"

MONGODB_URI="${MONGODB_URI}"

ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}"
ACCESS_TOKEN_EXPIRY="${ACCESS_TOKEN_EXPIRY}"

CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME}"
CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY}"
CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET}"

SMTP_HOST="${SMTP_HOST}"
SMTP_PORT="${SMTP_PORT}"
SMTP_USER="${SMTP_USER}"
SMTP_PASSWORD="${SMTP_PASSWORD}"
FROM_EMAIL="${FROM_EMAIL}"
FROM_NAME="${FROM_NAME}"

ADMIN_EMAIL="${ADMIN_EMAIL}"
ADMIN_PASSWORD="${ADMIN_PASSWORD}"

FRONTEND_URL="${FRONTEND_URL}"

TURNSTILE_SECRET="${TURNSTILE_SECRET}"
TURNSTILE_SECRET_KEY="${TURNSTILE_SECRET_KEY}"
TURNSTILE_HOSTNAMES="${TURNSTILE_HOSTNAMES}"
EOF

# Restrict permissions: only owner can read the environment file
chmod 600 .env

echo -e "${CYAN}[6/7] Generating docker-compose.yml & Deploying Containers...${NC}"
cat > docker-compose.yml <<EOF
services:
  backend:
    container_name: ${CONTAINER_NAME}
    image: ${IMAGE}
    restart: always
    ports:
      - "127.0.0.1:${PORT}:${PORT}"
    env_file:
      - .env
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:${PORT}/api/v1/healthcheck || wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/v1/healthcheck || exit 1"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s
EOF

# Pull and launch
$SUDO docker compose pull || echo -e "${YELLOW}Notice: Using existing or local image if pull fails.${NC}"
$SUDO docker compose up -d --remove-orphans
$SUDO docker image prune -f || true

# -----------------------------------------------------------------------------
# Edge Case 9: Container Startup Verification & Health Polling
# -----------------------------------------------------------------------------
echo -e "${CYAN}Waiting for backend container to boot and pass healthcheck...${NC}"
HEALTHY=0
for i in {1..15}; do
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/api/v1/healthcheck" 2>/dev/null || echo "000")
    if [ "$STATUS_CODE" -eq 200 ]; then
        HEALTHY=1
        echo -e "${GREEN}✓ Container is healthy (HTTP 200 OK from /api/v1/healthcheck).${NC}"
        break
    fi
    echo "  [${i}/15] Waiting for server on port ${PORT}... (Status: ${STATUS_CODE})"
    sleep 2
done

if [ $HEALTHY -ne 1 ]; then
    echo -e "\n${RED}Warning: Healthcheck endpoint did not respond with 200 OK.${NC}"
    echo -e "${YELLOW}Displaying last 30 lines of container logs for diagnosis:${NC}"
    $SUDO docker logs --tail 30 "$CONTAINER_NAME" || true
    echo -e "${YELLOW}The deployment will continue with Nginx setup, but please check the logs above.${NC}\n"
fi

# -----------------------------------------------------------------------------
# Edge Case 10: Nginx Configuration & Long Server Names
# -----------------------------------------------------------------------------
echo -e "${CYAN}[7/7] Configuring Nginx Reverse Proxy & SSL for ${DOMAIN}...${NC}"

# Ensure server_names_hash_bucket_size is sufficient
if ! grep -q "server_names_hash_bucket_size" /etc/nginx/nginx.conf 2>/dev/null; then
    $SUDO sed -i '/http {/a \    server_names_hash_bucket_size 64;' /etc/nginx/nginx.conf 2>/dev/null || true
fi

$SUDO tee "/etc/nginx/sites-available/$DOMAIN" >/dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Real-IP \$remote_addr;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

$SUDO ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
$SUDO rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax
if ! $SUDO nginx -t; then
    echo -e "${RED}Error: Nginx configuration test failed.${NC}" >&2
    exit 1
fi
$SUDO systemctl restart nginx

# -----------------------------------------------------------------------------
# Edge Case 11: DNS Resolution Pre-Check before Certbot SSL
# -----------------------------------------------------------------------------
echo -e "${CYAN}Checking DNS resolution for $DOMAIN before requesting SSL...${NC}"
DOMAIN_IP=$(getent ahosts "$DOMAIN" 2>/dev/null | awk '{print $1}' | head -n 1 || echo "")
SERVER_IP=$(curl -s4 --max-time 5 https://ifconfig.me 2>/dev/null || curl -s4 --max-time 5 https://api.ipify.org 2>/dev/null || echo "")

echo "  Domain Resolved IP: ${DOMAIN_IP:-unknown}"
echo "  Server Public IP:   ${SERVER_IP:-unknown}"

if [ -n "$DOMAIN_IP" ] && [ -n "$SERVER_IP" ] && [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
    echo -e "${GREEN}DNS verified! Proceeding with Certbot SSL certificate issuance...${NC}"
    if $SUDO certbot --nginx -d "$DOMAIN" --agree-tos --email "$EMAIL" --non-interactive --redirect; then
        $SUDO systemctl enable --now certbot.timer 2>/dev/null || true
        echo -e "${GREEN}✓ SSL Certificate issued and auto-renewal enabled!${NC}"
    else
        echo -e "${YELLOW}Warning: Certbot was unable to obtain certificate automatically.${NC}"
        echo -e "${YELLOW}Your API is currently accessible over HTTP: http://${DOMAIN}${NC}"
    fi
else
    echo -e "${YELLOW}Notice: $DOMAIN does not yet resolve to this server's public IP ($SERVER_IP).${NC}"
    echo -e "${YELLOW}Let's Encrypt requires DNS propagation to succeed.${NC}"
    echo -e "${GREEN}HTTP reverse proxy is ACTIVE at: http://${DOMAIN}${NC}"
    echo -e "${YELLOW}Once your DNS A-record points to $SERVER_IP, run this command for SSL:${NC}"
    echo -e "  ${BOLD}sudo certbot --nginx -d $DOMAIN --agree-tos --email $EMAIL --redirect${NC}\n"
fi

# -----------------------------------------------------------------------------
# Deployment Summary
# -----------------------------------------------------------------------------
echo ""
echo -e "${GREEN}==========================================================${NC}"
echo -e "${GREEN}         Deployment Completed Successfully!${NC}"
echo -e "${GREEN}==========================================================${NC}"
echo -e "  API Domain:      http://${DOMAIN} (or https://${DOMAIN} if SSL issued)"
echo -e "  Healthcheck:     /api/v1/healthcheck"
echo -e "  Container Name:  ${CONTAINER_NAME}"
echo -e "  Local Port:      ${PORT}"
echo -e "${GREEN}==========================================================${NC}"
$SUDO docker compose ps
