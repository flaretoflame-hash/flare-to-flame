#!/usr/bin/env bash
set -e

echo "Checking for a usable Chrome/Chromium Headless Shell..."

if [ -n "$REMOTION_BROWSER_EXECUTABLE" ] && [ -f "$REMOTION_BROWSER_EXECUTABLE" ]; then
  echo "Using manually set REMOTION_BROWSER_EXECUTABLE: $REMOTION_BROWSER_EXECUTABLE"
  exit 0
fi

PW_PATH=$(find /opt/pw-browsers -maxdepth 1 -type d -name "chromium_headless_shell-*" 2>/dev/null | sort -V | tail -1)
if [ -n "$PW_PATH" ]; then
  EXEC_PATH="$PW_PATH/chrome-linux/headless_shell"
  if [ -f "$EXEC_PATH" ]; then
    echo "Found Playwright Chromium Headless Shell: $EXEC_PATH"
    echo "export REMOTION_BROWSER_EXECUTABLE=\"$EXEC_PATH\""
    exit 0
  fi
fi

for BIN in chromium-browser chromium google-chrome google-chrome-stable; do
  if command -v "$BIN" >/dev/null 2>&1; then
    EXEC_PATH=$(command -v "$BIN")
    echo "Found system browser: $EXEC_PATH"
    echo "export REMOTION_BROWSER_EXECUTABLE=\"$EXEC_PATH\""
    exit 0
  fi
done

echo "No existing browser found. Asking Remotion to download its own Chrome Headless Shell..."
echo "(This needs network access to remotion.media — whitelist this domain if it fails.)"
npx remotion browser ensure

if [ $? -ne 0 ]; then
  echo ""
  echo "FAILED: Remotion could not download its own browser."
  echo "Fix options:"
  echo "  1. Whitelist 'remotion.media' in your network/proxy settings, then retry this script."
  echo "  2. Install Playwright once (npx playwright install chromium) to get a usable browser path."
  echo "  3. apt-get install chromium (if you have system package access)."
  exit 1
fi

echo "Chrome Headless Shell ready via Remotion's own download."
