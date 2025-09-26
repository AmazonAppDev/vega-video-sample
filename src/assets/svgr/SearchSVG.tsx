// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Path, Svg } from '@amazon-devices/react-native-svg';
import React from 'react';

const SearchSvg = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement> & any,
) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-6 h-6"
    viewBox="0,0,50,50"
    {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21,3c-9.39844,0 -17,7.60156 -17,17c0,9.39844 7.60156,17 17,17c3.35547,0 6.46094,-0.98437 9.09375,-2.65625l12.28125,12.28125l4.25,-4.25l-12.125,-12.09375c2.17969,-2.85937 3.5,-6.40234 3.5,-10.28125c0,-9.39844 -7.60156,-17 -17,-17zM21,7c7.19922,0 13,5.80078 13,13c0,7.19922 -5.80078,13 -13,13c-7.19922,0 -13,-5.80078 -13,-13c0,-7.19922 5.80078,-13 13,-13z"
      stroke={props.stroke}
      fill={props.fill}
    />
  </Svg>
);
export default SearchSvg;
