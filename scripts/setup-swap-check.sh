#!/bin/bash

# Check disk space and suggest appropriate swap size
# Usage: ./scripts/setup-swap-check.sh

echo "Checking disk space and system resources..."
echo ""

# Check disk space
echo "=== Disk Space ==="
df -h /
echo ""

# Check current swap
echo "=== Current Swap ==="
swapon --show || echo "No swap currently active"
free -h
echo ""

# Calculate available space
AVAILABLE=$(df / | tail -1 | awk '{print $4}')
AVAILABLE_GB=$(echo "$AVAILABLE" | sed 's/G//' | sed 's/M//')

echo "=== Recommendations ==="
if echo "$AVAILABLE" | grep -q "G"; then
    AVAILABLE_NUM=$(echo "$AVAILABLE" | sed 's/G//')
    if [ "$AVAILABLE_NUM" -ge 8 ]; then
        echo "✓ You have ${AVAILABLE} available. You can create 4-6GB swap."
        echo "  Recommended: sudo ./scripts/setup-swap.sh 4"
    elif [ "$AVAILABLE_NUM" -ge 4 ]; then
        echo "⚠ You have ${AVAILABLE} available. You can create 2-3GB swap."
        echo "  Recommended: sudo ./scripts/setup-swap.sh 2"
    else
        echo "⚠ You have limited space (${AVAILABLE}). Create 1-2GB swap."
        echo "  Recommended: sudo ./scripts/setup-swap.sh 1"
        echo "  Or clean up disk space first (see cleanup commands below)"
    fi
else
    echo "⚠ Very limited disk space (${AVAILABLE})."
    echo "  You need to free up space before creating swap."
    echo "  See cleanup commands below"
fi

echo ""
echo "=== Cleanup Commands (if needed) ==="
echo "# Remove unused Docker resources:"
echo "  docker system prune -a --volumes"
echo ""
echo "# Remove old logs:"
echo "  sudo journalctl --vacuum-time=3d"
echo ""
echo "# Find large files:"
echo "  sudo du -h / | sort -rh | head -20"

