#!/bin/bash

# Create directories
mkdir -p traefik/certs traefik/dynamic

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout traefik/certs/cert.key \
  -out traefik/certs/cert.crt \
  -subj "/CN=isbn-scanner.local"

# Create dynamic configuration for Traefik
cat > traefik/dynamic/conf.yml << EOL
tls:
  certificates:
    - certFile: /etc/certs/cert.crt
      keyFile: /etc/certs/cert.key
EOL

# Make the script executable
chmod +x setup-local-ssl.sh
