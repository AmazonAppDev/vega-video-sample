// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { NavBarProps } from './NavBarProps';

export interface InternalNavBarBarProps extends NavBarProps {
  setNavigationBarIsRendered?: (isNavigationBarRendered: boolean) => void;
}
