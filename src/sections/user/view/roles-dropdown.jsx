import React from 'react';
import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const RolesDropdown = ({ roles, selectedRole, onRoleChange }) => {
  const handleChange = (event) => {
    onRoleChange(event.target.value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="user-role-label">User Role</InputLabel>
      <Select
        labelId="user-role-label"
        value={selectedRole}
        label="User Role"
        onChange={handleChange}
      >
        {roles.map((role) => (
          <MenuItem key={role._id} value={role._id}>
            {role.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

RolesDropdown.propTypes = {
  roles: PropTypes.array.isRequired,
  selectedRole: PropTypes.string.isRequired,
  onRoleChange: PropTypes.func.isRequired,
};

export default RolesDropdown; 
