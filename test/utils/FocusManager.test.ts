// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { focusManager } from '../../src/utils/FocusManager';

describe('FocusManager', () => {
  beforeEach(() => {
    focusManager.clearAll();
  });

  it('should register and execute focus callback', () => {
    const mockCallback = jest.fn();
    const testId = 'test-id';

    focusManager.registerFocusCallback(testId, mockCallback);
    focusManager.restoreFocus(testId);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should remove callback after execution', () => {
    const mockCallback = jest.fn();
    const testId = 'test-id';

    focusManager.registerFocusCallback(testId, mockCallback);
    focusManager.restoreFocus(testId);
    focusManager.restoreFocus(testId); // Second call should not execute

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle unregistering callbacks', () => {
    const mockCallback = jest.fn();
    const testId = 'test-id';

    focusManager.registerFocusCallback(testId, mockCallback);
    focusManager.unregisterFocusCallback(testId);
    focusManager.restoreFocus(testId);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should clear all callbacks', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    focusManager.registerFocusCallback('id1', mockCallback1);
    focusManager.registerFocusCallback('id2', mockCallback2);
    focusManager.clearAll();

    focusManager.restoreFocus('id1');
    focusManager.restoreFocus('id2');

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();
  });

  it('should handle non-existent callback gracefully', () => {
    expect(() => {
      focusManager.restoreFocus('non-existent-id');
    }).not.toThrow();
  });
});
