import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

export default function RHFSelect({ name, children, helperText, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: false }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          label={label}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

RHFSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.string,
  children: PropTypes.node,
};
