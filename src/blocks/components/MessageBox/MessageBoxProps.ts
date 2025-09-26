// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface MessageBoxProps {
  message: string;
  testID?: string;
  buttonOnPress?: () => void;
  buttonLabel?: string;
}
