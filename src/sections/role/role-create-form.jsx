import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
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
import RHFMultiSelect from 'src/components/hook-form/rhf-multi-select';

import PermissionsManager from './permission';

// ----------------------------------------------------------------------

const AVAILABLE_PERMISSIONS = [
  'read:users',
  'write:users',
  'read:roles',
  'write:roles',
  // Add more permissions as needed
];


const permissionsProps = {
  role: {
    _id: "role_admin",
    name: "Super Administrator",
  },
  resources: [
    {
      _id: "resource_users",
      name: "User Management",
      is_system_managed: false,
      api: {
        endpoint: "/api/users",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      client: {
        component: "UserManagementPage",
        actions: [
          {
            name: "create_user",
            label: "Create User",
            visibility: { show: true, enabled: true },
          },
          {
            name: "edit_user",
            label: "Edit User",
            visibility: { show: true, enabled: true },
          },
        ],
      },
    },
  ],
  permissions: [
    {
      resource_id: "resource_users",
      api_access: {
        methods: ["GET", "POST"],
        custom_rate_limit: {
          requests: 100,
          duration: 3600,
        },
      },
      client_access: {
        actions: [
          {
            name: "create_user",
            label: "Create User",
            visibility: { show: true, enabled: true },
          },
        ],
      },
    },
  ],
};



export default function RoleCreateForm({ open, onClose, role }) {
  const { showAlert } = useAlert();

  const RoleSchema = Yup.object().shape({
    name: Yup.string().required('Role name is required'),
    displayName: Yup.string().required('Display name is required'),
    description: Yup.string().nullable(),
    permissions: Yup.array().of(
      Yup.string()
    ).default([]),
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
      showAlert(error.message, 'error');
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
              <RHFMultiSelect
                name="permissions"
                label="Permissions"
                options={AVAILABLE_PERMISSIONS.map((permission) => ({
                  value: permission,
                  label: permission,
                }))}
              />
            </Stack>
          </Box>
        </FormProvider>
        <PermissionsManager {...permissionsProps} />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <LoadingButton variant="contained" loading={isSubmitting} onClick={onSubmit}>
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
