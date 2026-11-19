// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef, useState } from 'react';
import { NativeSyntheticEvent, View } from 'react-native';

import {
  TextInput,
  TextInputSubmitEditingEventData,
} from '@amazon-devices/react-native-kepler';
import SearchSvg from '../../../assets/svgr/SearchSVG';
import { COLORS } from '../../styles/Colors';
import { SearchInputProps } from './SearchInputProps';
import { searchInputStyles } from './SearchInputStyles';

export const SearchInput = ({
  onSubmit,
  placeholderText,
}: SearchInputProps) => {
  const [isFocused, setFocused] = useState<boolean>(false);
  const [searchInputText, setSearchInputText] = useState<string>('');
  const textInputRef = useRef<any>(null);
  const styles = searchInputStyles();
  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: isFocused ? COLORS.SILVER : COLORS.DOVE_GRAY,
        },
      ]}>
      <SearchSvg
        width={styles.imageSearch.width || 24}
        height={styles.imageSearch.height || 24}
        stroke="white"
        fill="white"
      />
      <TextInput
        onChangeText={(text: string) => setSearchInputText(text)}
        defaultValue={searchInputText}
        autoFocus={true}
        placeholder={placeholderText}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        style={styles.textInput}
        returnKeyType={'done'}
        onSubmitEditing={(
          event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
        ) => {
          textInputRef.current?.blur();
          // On React Native 0.83, pressing Back on the remote fires
          // onSubmitEditing with submitAction 'previous'. Treat it as a
          // dismiss: close the keyboard and stay on Search.
          if (event.nativeEvent.submitAction === 'previous') {
            return;
          }
          onSubmit(event.nativeEvent.text.trim());
        }}
        ref={textInputRef}
        testID="search_input_text_input"
      />
    </View>
  );
};
