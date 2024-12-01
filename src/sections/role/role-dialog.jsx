import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fetchWrapperAxios } from 'src/utils/api';

import { useAlert } from 'src/contexts/AlertContext';


// ----------------------------------------------------------------------

const AVAILABLE_PERMISSIONS = [
  'read:users',
  'write:users',
  'read:roles',
  'write:roles',
  // Add more permissions as needed
];


export default function RoleDialog({ open, closeDialog, role, setSelectedRole }) {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      permissions: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (role?._id) {
        await fetchWrapperAxios(`/v1/roles/${role._id}`, {
          method: 'PUT',
          data: formData,
        });
        showAlert('Role updated successfully', 'success');
      } else {
        await fetchWrapperAxios('/v1/roles', {
          method: 'POST',
          data: formData,
        });
        showAlert('Role created successfully', 'success');
      }
      closeDialog(true);
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  return (
    <Dialog open={open} onClose={() => closeDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{role?._id ? 'Edit Role' : 'Create Role'}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 2,
          }}
        >
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={formData.permissions}
              onChange={handlePermissionChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <MenuItem key={permission} value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {role?._id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RoleDialog.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func,
  role: PropTypes.object,
  setSelectedRole: PropTypes.func,
};
