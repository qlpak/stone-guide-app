#!/bin/bash
# Quick setup script for Ansible deployment

echo "Setting up Ansible for Stone Guide deployment..."

# Check if Ansible is installed
if ! command -v ansible &> /dev/null; then
    echo "Installing Ansible..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install ansible
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y ansible
        elif command -v yum &> /dev/null; then
            sudo yum install -y ansible
        fi
    fi
else
    echo "Ansible is already installed"
fi

# Install Kubernetes Ansible collection
echo "Installing Kubernetes collection for Ansible..."
ansible-galaxy collection install kubernetes.core

# Verify kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed. Please install it first:"
    echo "   macOS: brew install kubectl"
    echo "   Linux: Check your distribution's package manager"
    exit 1
else
    echo "kubectl is installed"
fi

# Test cluster connection
echo "Testing Kubernetes cluster connection..."
if kubectl cluster-info &> /dev/null; then
    echo "Connected to Kubernetes cluster"
else
    echo "Cannot connect to Kubernetes cluster"
    echo "   Make sure your kubeconfig is properly configured"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Setup complete! You're ready to deploy."
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Quick commands:"
echo "  Deploy:    ansible-playbook deploy.yaml"
echo "  Rollback:  ansible-playbook deploy.yaml --tags rollback"
echo ""
echo "Edit variables in deploy.yaml before first run!"
echo "════════════════════════════════════════════════════════════════"
