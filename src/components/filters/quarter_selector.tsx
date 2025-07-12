'use client';

import { useState } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
import { useRouter } from 'next/navigation';

export const QuarterSelector = ({ currentQuarter }: { currentQuarter: string }) => {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const quarter = event.target.value as string;
    router.push(`/dashboard?quarter=${quarter}`);
  };

  return (
    <FormControl fullWidth sx={{ mb: 4, maxWidth: 200 }}>
      <InputLabel>Quarter</InputLabel>
      <Select
        value={currentQuarter}
        label="Quarter"
        onChange={handleChange}
      >
        {['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2'].map(q => (
          <MenuItem key={q} value={q}>{q}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};