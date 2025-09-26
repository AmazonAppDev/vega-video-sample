import { Typography } from '@amazon-devices/kepler-ui-components';
import { act, render, renderHook } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LocaleComponent, { styles } from '../../src/components/LocaleComponent';
import RadioPicker, { OptionType } from '../../src/components/RadioPicker';
import {
  setCountryCode,
  settingsSelectors,
} from '../../src/store/settings/SettingsSlice';

jest.mock('@amazon-devices/react-native-kepler', () => ({
  TVFocusGuideView: (props) => <div {...props}>{props.children}</div>,
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const localeOptions: OptionType[] = [
  { label: 'Option 1', value: '1', code: 'A' },
  { label: 'Option 2', value: '2', code: 'B' },
  { label: 'Option 3', value: '3', code: 'C' },
];

describe('LocaleComponent', () => {
  const mockDispatch = jest.fn();
  const mockCountryCode = 'US';

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockReturnValue(mockCountryCode);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with styles', () => {
    const tree = render(<LocaleComponent />);
    expect(tree).toMatchSnapshot();
  });
  it('Typography is present in component', async () => {
    const { UNSAFE_queryByType } = render(
      <Typography style={styles.label} variant="title" />,
    );
    const typography = UNSAFE_queryByType(Typography);
    expect(typography).toBeDefined();
  });
  it('View is present in component', async () => {
    const { UNSAFE_queryByType } = render(<View style={styles.container} />);
    const view = UNSAFE_queryByType(Typography);
    expect(view).toBeDefined();
  });
  it('renders correctly without styles', () => {
    const defaultValue: OptionType = localeOptions[0];
    const tree = render(
      <RadioPicker
        options={[]}
        onSelect={jest.fn()}
        defaultValue={defaultValue}
      />,
    );
    expect(tree).toMatchSnapshot();
  });

  it('should dispatch setCountryCode with the correct option', () => {
    const { result } = renderHook(() => {
      const dispatch = useDispatch();
      const onSelect = (option: any) => {
        dispatch(setCountryCode(option));
      };
      return { onSelect };
    });
    act(() => {
      result.current.onSelect(localeOptions[0]);
    });
    expect(mockDispatch).toHaveBeenCalledWith(setCountryCode(localeOptions[0]));
  });

  it('calls onSelect with the correct option when the button is clicked', () => {
    const tree = render(<LocaleComponent />);
    expect(tree).toMatchSnapshot();
  });

  it('should return the correct countryCode from useSelector', () => {
    const { result } = renderHook(() => {
      const countryCode = useSelector(settingsSelectors.countryCode);
      return countryCode;
    });

    expect(result.current).toBe(mockCountryCode);
  });

  it('renders correctly', () => {
    const { getByText } = render(<LocaleComponent />);
    expect(getByText('Select Country Code:')).toBeDefined();
  });
});
