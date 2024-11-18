import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { fetchWrapperAxios } from 'src/utils/api';

import { useAlert } from 'src/contexts/AlertContext';

import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field';

// ----------------------------------------------------------------------
export default function ResourceCreateForm({ open, onClose, resource }) {
  const { showAlert } = useAlert();
  const ResourceSchema = Yup.object().shape({
    name: Yup.string().required('Resource name is required'),
    description: Yup.string().nullable(),
  });
  const defaultValues = {
    name: resource?.name || '',
    description: resource?.description || '',
  };
  const methods = useForm({
    resolver: yupResolver(ResourceSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (resource?._id) {
        await fetchWrapperAxios(`/v1/resources/${resource._id}`, {
          method: 'PUT',
          data,
        });
        showAlert('Resource updated successfully', 'success');
      } else {
        await fetchWrapperAxios('/v1/resources', {
          method: 'POST',
          data,
        });
        showAlert('Resource created successfully', 'success');
      }
      onClose(true);
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{resource?._id ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Resource Name" />
              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={4}
              />
            </Stack>
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <LoadingButton variant="contained" loading={isSubmitting} onClick={onSubmit}>
          {resource?._id ? 'Update' : 'Create'} Resource
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

ResourceCreateForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  resource: PropTypes.object,
};