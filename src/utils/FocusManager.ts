// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Simple focus restoration manager that avoids passing functions as navigation params
 */
class FocusManager {
  private focusCallbacks: Map<string, () => void> = new Map();

  /**
   * Register a focus restoration callback for a specific ID
   */
  registerFocusCallback(id: string, callback: () => void) {
    this.focusCallbacks.set(id, callback);
  }

  /**
   * Execute and remove a focus restoration callback
   */
  restoreFocus(id: string) {
    const callback = this.focusCallbacks.get(id);
    if (callback) {
      callback();
      this.focusCallbacks.delete(id);
    }
  }

  /**
   * Remove a focus restoration callback without executing it
   */
  unregisterFocusCallback(id: string) {
    this.focusCallbacks.delete(id);
  }

  /**
   * Clear all focus callbacks
   */
  clearAll() {
    this.focusCallbacks.clear();
  }
}

export const focusManager = new FocusManager();
