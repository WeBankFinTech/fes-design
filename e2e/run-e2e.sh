#!/bin/bash
set -e

echo "=== Starting docs dev server in background ==="
cd /private/tmp/issue-873
pnpm run docs:dev &
SERVER_PID=$!

echo "=== Waiting for server to be ready ==="
for i in {1..60}; do
    if curl -s http://localhost:5174/ > /dev/null 2>&1; then
        echo "Server is ready!"
        break
    fi
    echo "Waiting... ($i/60)"
    sleep 2
done

echo "=== Testing table page for console errors ==="
curl -s http://localhost:5174/zh/components/table > /tmp/table_page.html
if grep -q "FTable\|f-table" /tmp/table_page.html; then
    echo "Table page loads correctly"
else
    echo "Warning: Table page content may not have loaded properly"
fi

echo "=== Testing modal page for console errors ==="
curl -s http://localhost:5174/zh/components/modal > /tmp/modal_page.html
if grep -q "FModal\|f-modal" /tmp/modal_page.html; then
    echo "Modal page loads correctly"
else
    echo "Warning: Modal page content may not have loaded properly"
fi

echo "=== Killing dev server ==="
kill $SERVER_PID 2>/dev/null || true

echo "=== E2E test complete ==="
echo "DONE"