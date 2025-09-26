import React, { Suspense } from 'react';
import BufferingWindow from '../components/BufferingWindow';

export const WithSuspense = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<BufferingWindow testID="buffering-view" />}>
      <Component {...props} />
    </Suspense>
  );
};
