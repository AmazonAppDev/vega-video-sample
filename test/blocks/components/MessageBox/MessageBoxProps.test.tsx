// MessageBoxProps.test.ts
import { MessageBoxProps } from '../../../../src/blocks/components/MessageBox';

describe('MessageBoxProps Interface', () => {
  test('should create valid props with required message only', () => {
    const props: MessageBoxProps = {
      message: 'Test message',
    };

    expect(props.message).toBe('Test message');
    expect(props.testID).toBeUndefined();
    expect(props.buttonLabel).toBeUndefined();
    expect(props.buttonOnPress).toBeUndefined();
  });

  test('should create valid props with all properties', () => {
    const mockButtonOnPress = jest.fn();
    const props: MessageBoxProps = {
      message: 'Test message',
      testID: 'test-message-box',
      buttonLabel: 'Click me',
      buttonOnPress: mockButtonOnPress,
    };

    expect(props.message).toBe('Test message');
    expect(props.testID).toBe('test-message-box');
    expect(props.buttonLabel).toBe('Click me');
    expect(props.buttonOnPress).toBe(mockButtonOnPress);
  });

  test('buttonOnPress should be callable when provided', () => {
    const mockButtonOnPress = jest.fn();
    const props: MessageBoxProps = {
      message: 'Test message',
      buttonOnPress: mockButtonOnPress,
    };

    props.buttonOnPress?.();
    expect(mockButtonOnPress).toHaveBeenCalledTimes(1);
  });

  test('should allow empty string as message', () => {
    const props: MessageBoxProps = {
      message: '',
    };

    expect(props.message).toBe('');
  });

  test('should handle undefined optional properties', () => {
    const props: MessageBoxProps = {
      message: 'Test message',
      testID: undefined,
      buttonLabel: undefined,
      buttonOnPress: undefined,
    };

    expect(props.message).toBe('Test message');
    expect(props.testID).toBeUndefined();
    expect(props.buttonLabel).toBeUndefined();
    expect(props.buttonOnPress).toBeUndefined();
  });
});
