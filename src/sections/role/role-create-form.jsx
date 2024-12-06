import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { fetchWrapperAxios } from 'src/utils/api';

import { useAlert } from 'src/contexts/AlertContext';

import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field';

import PermissionsManager from './permission';

// ----------------------------------------------------------------------

export default function RoleCreateForm({ open, onClose, role }) {
  const { showAlert } = useAlert();

  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [errorResources, setErrorResources] = useState(null);

  // Fetch resources from the server
  useEffect(() => {
    const fetchResources = async () => {
      setLoadingResources(true);
      setErrorResources(null);
      try {
        const data = await fetchWrapperAxios('/v1/resources');
        setResources(data.resources);
      } catch (error) {
        setErrorResources('Failed to load resources.');
        showAlert('Failed to load resources.', 'error');
      } finally {
        setLoadingResources(false);
      }
    };

    if (open) {
      fetchResources();
    }
  }, [open, showAlert]);

  const RoleSchema = Yup.object().shape({
    name: Yup.string().required('Role name is required'),
    displayName: Yup.string().required('Display name is required'),
    description: Yup.string().nullable(),
    permissions: Yup.array().of(Yup.string()).default([]),
    isSystem: Yup.boolean().default(false),
  });

  const defaultValues = {
    name: role?.name || '',
    displayName: role?.displayName || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
    isSystem: role?.isSystem || false,
  };

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (role?._id) {
        await fetchWrapperAxios(`/v1/roles/${role._id}`, {
          method: 'PUT',
          data,
        });
        showAlert('Role updated successfully', 'success');
      } else {
        await fetchWrapperAxios('/v1/roles', {
          method: 'POST',
          data,
        });
        showAlert('Role created successfully', 'success');
      }
      onClose(true);
    } catch (error) {
      showAlert(error.message || 'Operation failed', 'error');
    }
  });

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h3">
          {role?._id ? 'Edit Role' : 'Create New Role'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Role Name" />
              <RHFTextField name="displayName" label="Display Name" />
              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={4}
              />
            </Stack>
          </Box>
        </FormProvider>
        <PermissionsManager
          resources={resources}
          permissions={role?.permissions || []}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={isSubmitting}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={isSubmitting}
          onClick={onSubmit}
          disabled={loadingResources || !!errorResources}
        >
          {role?._id ? 'Update' : 'Create'} Role
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

RoleCreateForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  role: PropTypes.object,
};
