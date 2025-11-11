#!/usr/bin/env bash

set -e 

export VERSION="4.8.5"
export RELEASE="1.2"

reset_shaka_state() {
    echo "Resetting Shaka Player state"
    cd shaka-player
    
    git am --abort >/dev/null 2>&1 || true # Abort patch application if in progress
    git clean -fdx >/dev/null 2>&1 # Clean untracked files
    git reset --hard HEAD >/dev/null 2>&1 # Reset any local changes
    
    # Return to main branch and delete custom branch
    git checkout main >/dev/null 2>&1
    git branch -D amz_$VERSION >/dev/null 2>&1 || true
    
    echo "Shaka Player state has been reset"
    cd ..
}

validate_integration() {
    echo "Validating Shaka Player integration"
    
    # Validates correct sintax
    node --check dist/shaka-player.compiled.js
}

# Check if shaka-player directory exists and has the correct git branch
is_shaka_repo_valid() {
    # Check if shaka-player directory exists
    [ -d "shaka-player" ] && \
    # Change to shaka-player directory
    (cd shaka-player && \
     # Verify it's a valid git repository
     git rev-parse --git-dir >/dev/null 2>&1 && \
     # Check if amz_$VERSION branch exists OR if current branch is amz_$VERSION
     (git show-ref --verify --quiet refs/heads/amz_$VERSION || \
      [[ "$(git branch --show-current)" == "amz_$VERSION" ]]))
}

# Trap for cleanup on failure
cleanup_on_failure() {
    echo "Build failed. Resetting state"
    cd "$(dirname "$0")"
    if [[ -d "shaka-player" ]]; then
        reset_shaka_state
    fi
    exit 1
}

trap cleanup_on_failure ERR

echo "Starting Shaka Player v$VERSION-r$RELEASE integration for Vega TV platform"

# Clone shaka repo or reset if it already exists
if [ ! -d "shaka-player" ]; then
    echo "Cloning official Shaka Player repository from GitHub"
    git clone https://github.com/shaka-project/shaka-player.git
elif is_shaka_repo_valid; then
    echo "Shaka Player repository already exists"
    reset_shaka_state
else
    echo "Error: shaka-player directory is corrupted or missing amz_$VERSION branch"
    echo "Please run: npm run clean"
    exit 1
fi

echo "Entering Shaka Player directory"
cd shaka-player

# Checkout branch from $VERSION tag
{
    echo "Creating Amazon branch 'amz_$VERSION' from tag v$VERSION"
    git checkout -b amz_$VERSION v$VERSION
} || {
    echo "Branch 'amz_$VERSION' already exists, using existing branch"
}

# Copy shaka-rel tarball
echo "Copying custom Shaka Player tarball with Vega TV patches"
cp ../shaka-rel-v$VERSION-r$RELEASE.tar.gz .

# Unpack tarball
echo "Extracting custom patches, polyfills, and source files"
tar -xzf shaka-rel-v$VERSION-r$RELEASE.tar.gz

# Apply patches
{
    echo "Applying custom patches for Vega TV platform compatibility"
    git am shaka-rel/shaka-patch/*.patch -3
} || {
    echo "Custom patches already applied, skipping patch application"
    git am --abort
}

# Disable Google Fonts to support restricted network environments
if [ -f "ui/controls.less" ]; then
    # Comment out font imports to prevent network failures
    sed 's|@import (css, inline) "https://fonts.googleapis.com/css?family=Roboto";|\n/* Roboto font disabled for network compatibility */|g' ui/controls.less | \
    sed 's|@import (css, inline) "https://fonts.googleapis.com/icon?family=Material+Icons+Round";|\n/* Material Icons disabled for network compatibility */|g' > ui/controls.less.tmp
    mv ui/controls.less.tmp ui/controls.less
    echo "Font imports disabled for network-restricted environments"
fi

# Build customized Shaka Player
echo "Building customized Shaka Player with Vega build system"
if ! kepler exec python build/all.py; then
    echo "Vega build failed, attempting direct build"
    build/all.py
fi

# Return to /shaka-setup
echo "Returning to shaka-setup directory"
cd ..

# Ensure // @ts-nocheck is inside the files to be copied so as not to cause linter / compiler problems
echo "Adding TypeScript no-check directives to prevent linting issues"
LINE_TO_ADD="// @ts-nocheck"
DIRECTORIES=('shaka-player/dist' 'shaka-player/shaka-rel/src')

# Iterate over the list of file paths
for DIRECTORY in "${DIRECTORIES[@]}"; do
    find "$DIRECTORY" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
        # Maybe the file already contains the line
        if ! grep -qF "$LINE_TO_ADD" "$file"; then
            # Add the line to the top of the file
            { echo "$LINE_TO_ADD"; cat "$file"; } > "$file.tmp" && mv "$file.tmp" "$file"
            echo "Added @ts-nocheck to: $file"
        else
            echo "@ts-nocheck already present in: $file"
        fi
    done
done

# Final validation
cd shaka-player
if validate_integration; then
    echo "Shaka Player v$VERSION integration completed"
    cd ..
else
    echo "Shaka Player integration failed"
    cd ..
    exit 1
fi