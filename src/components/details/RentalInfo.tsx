// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Typography } from '@amazon-devices/kepler-ui-components';
import React from 'react';
import { COLORS } from '../../styles/Colors';
import { customFormatDate } from '../../utils/commonFunctions';

interface RentalInfoProps {
  showAddRental: boolean;
  rentalTimestamp: string | null;
  rentAmount: string;
}

export const RentalInfo: React.FC<RentalInfoProps> = ({
  showAddRental,
  rentalTimestamp,
  rentAmount,
}) => {
  if (showAddRental || !rentalTimestamp) {
    return null;
  }

  return (
    <Typography variant="label" color={COLORS.WHITE} testID="text-rent-success">
      Rented for {rentAmount} on {customFormatDate(new Date(rentalTimestamp))}
    </Typography>
  );
};
