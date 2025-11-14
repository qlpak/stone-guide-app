#!/bin/bash
# Environment verification script for Stone Guide deployment

echo "════════════════════════════════════════════════════════════════"
echo "Stone Guide - Environment Verification"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}$1 is installed${NC}"
        return 0
    else
        echo -e "${RED}$1 is NOT installed${NC}"
        return 1
    fi
}

# Track if everything is ok
ALL_OK=true

echo "📦 Checking required tools..."
echo ""

# Check Docker
if check_command docker; then
    if docker ps &> /dev/null; then
        echo -e "${GREEN}   ↳ Docker daemon is running${NC}"
    else
        echo -e "${RED}   ↳ Docker daemon is NOT running - Please start Docker Desktop${NC}"
        ALL_OK=false
    fi
else
    ALL_OK=false
fi

# Check kubectl
if check_command kubectl; then
    VERSION=$(kubectl version --client -o json 2>/dev/null | grep gitVersion | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}   ↳ Version: $VERSION${NC}"
else
    ALL_OK=false
fi

# Check Ansible
if check_command ansible; then
    VERSION=$(ansible --version | head -1)
    echo -e "${GREEN}   ↳ $VERSION${NC}"
else
    echo -e "${YELLOW}   ↳ Will be installed by setup-ansible.sh${NC}"
fi

echo ""
echo "Checking Kubernetes cluster..."
echo ""

# Check kubectl config
if [ -f ~/.kube/config ]; then
    echo -e "${GREEN}kubectl config exists${NC}"
    
    # Get current context
    CONTEXT=$(kubectl config current-context 2>&1)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Current context: $CONTEXT${NC}"
    else
        echo -e "${RED}Cannot get kubectl context${NC}"
        ALL_OK=false
    fi
    
    # Test cluster connection
    if kubectl cluster-info &> /dev/null; then
        echo -e "${GREEN}Cluster is accessible${NC}"
        
        # Get cluster info
        CLUSTER_URL=$(kubectl cluster-info | grep "control plane" | awk '{print $NF}')
        echo -e "${GREEN}   ↳ Cluster URL: $CLUSTER_URL${NC}"
        
        # Check nodes
        NODES=$(kubectl get nodes --no-headers 2>/dev/null | wc -l | tr -d ' ')
        if [ "$NODES" -gt 0 ]; then
            echo -e "${GREEN}$NODES node(s) available${NC}"
            kubectl get nodes 2>/dev/null | sed 's/^/   /'
        fi
    else
        echo -e "${RED}Cannot connect to Kubernetes cluster${NC}"
        echo -e "${YELLOW}   ↳ Docker Desktop Kubernetes may be disabled${NC}"
        ALL_OK=false
    fi
else
    echo -e "${RED}kubectl config not found${NC}"
    ALL_OK=false
fi

echo ""
echo "Checking system resources..."
echo ""

# Check available memory (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    TOTAL_MEM=$(sysctl hw.memsize | awk '{print int($2/1024/1024/1024)}')
    echo -e "${GREEN}Total Memory: ${TOTAL_MEM}GB${NC}"
    
    if [ "$TOTAL_MEM" -lt 8 ]; then
        echo -e "${YELLOW}   Recommended: 8GB+ for running all services${NC}"
    fi
fi

# Check disk space
DISK_FREE=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}Available disk space: $DISK_FREE${NC}"

echo ""
echo "════════════════════════════════════════════════════════════════"

if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}Environment is ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start Docker Desktop (if not running)"
    echo "  2. Enable Kubernetes in Docker Desktop settings"
    echo "  3. Run: ./setup-ansible.sh"
    echo "  4. Run: ansible-playbook deploy.yaml"
else
    echo -e "${RED}Some requirements are missing${NC}"
    echo ""
    echo "Required actions:"
    echo ""
    
    if ! docker ps &> /dev/null; then
        echo -e "${YELLOW}Start Docker Desktop:${NC}"
        echo "   • Open Docker Desktop application"
        echo "   • Wait for it to fully start"
        echo ""
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${YELLOW}Enable Kubernetes in Docker Desktop:${NC}"
        echo "   1. Open Docker Desktop"
        echo "   2. Go to Settings (gear icon)"
        echo "   3. Click on 'Kubernetes' tab"
        echo "   4. Check 'Enable Kubernetes'"
        echo "   5. Click 'Apply & Restart'"
        echo "   6. Wait 2-3 minutes for Kubernetes to start"
        echo ""
    fi
    
    if ! command -v kubectl &> /dev/null; then
        echo -e "${YELLOW}Install kubectl:${NC}"
        echo "   brew install kubectl"
        echo ""
    fi
    
    echo "Then run this script again: ./verify-env.sh"
fi

echo "════════════════════════════════════════════════════════════════"
