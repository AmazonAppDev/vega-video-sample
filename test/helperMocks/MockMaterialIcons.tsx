// __mocks__/@amazon-devices/react-native-vector-icons/MaterialIcons.tsx
import React from 'react';
import { Text, View } from 'react-native';

const MockMaterialIcons = ({
  name,
  size,
  color,
  testID,
}: {
  name: string;
  size: number;
  color: string;
  testID: string;
}) => {
  return (
    <View
      testID={testID}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}>
      <Text>{name}</Text>
    </View>
  );
};
export default MockMaterialIcons;
