// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Class containing the error for kepler blocks
 */
export class KeplerBlocksError extends Error {
  /** Type of error based on the classification from KeplerBlocksErrorType */
  type: KeplerBlocksErrorType;
  /** Original error */
  originalError?: any;

  constructor(
    type: KeplerBlocksErrorType,
    message: string,
    originalError?: any,
  ) {
    super(message);
    this.type = type;

    this.originalError = originalError;
  }
}

/** Classified error for kepler blocks */
export type KeplerBlocksErrorType =
  | 'NOT_CONNECTED'
  | 'NETWORK'
  | 'DATA_SOURCE'
  | 'RUNTIME';
