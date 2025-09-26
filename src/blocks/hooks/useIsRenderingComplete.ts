// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useCallback, useState } from 'react';

export const useIsRenderingComplete = () => {
  const [isRendered, setIsrendered] = useState(false);

  const setRenderingCompleted = useCallback(
    (isComponentRendered: boolean) => {
      if (isRendered && isComponentRendered) {
        return;
      }
      setIsrendered(isComponentRendered);
    },
    [isRendered],
  );

  return { setRenderingCompleted, isRendered };
};
