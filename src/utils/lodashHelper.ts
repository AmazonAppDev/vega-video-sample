import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

export const areComponentPropsEqual = (
  prevProps: any,
  nextProps: any,
  excludedProps?: any,
): boolean => {
  // exclude the props not required and compare the objects.
  if (excludedProps) {
    const requiredPrevProps = omit(prevProps, excludedProps);
    const requiredNextProps = omit(nextProps, excludedProps);
    return isEqual(requiredPrevProps, requiredNextProps);
  }
  return isEqual(prevProps, nextProps);
};
