import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { fetchWrapperAxios } from 'src/utils/api';

import { useAlert } from 'src/contexts/AlertContext';
import { AuthContext } from 'src/contexts/AuthContext';

import Label from 'src/components/label';

import ProfileCard from './profile-card';
import RolesDropdown from './roles-dropdown';

export default function AlertDialog({ open, closeDialog, user }) {

  // get current user from AuthContext
  const { userProfile: currentUser } = useContext(AuthContext);
  const { showAlert } = useAlert();

  // each follower will have {id: string, date: string} values in the array
  const followers = user.csFollowers ?? [];

  const handleClose = (shouldRefetch) => {
    closeDialog(shouldRefetch);
  };

  const handleActivationToggle = async () => {
    try {
      const action = user.isDeactivated ? 'activate' : 'deactivate';
      await fetchWrapperAxios(`/v1/users/${user._id}/${action}`, {
        method: 'PUT',
      });
      showAlert(`User ${action}d successfully`, 'success');
      handleClose(true);
    } catch (error) {
      showAlert(`Failed to ${user.isDeactivated ? 'activate' : 'deactivate'} user`, 'error');
    }
  };

  // isDisable will be true if the user is the current user or the user is a demo user or if teh  current user is already in the followers list
  const isAlreadyFollowing = followers.some(follower => follower._id === currentUser._id);

  let message = '';
  if (isAlreadyFollowing) {
    message = 'You are already following this user';
  } else if (user.isDemo) {
    message = 'Demo user';
  } else if (user._id === currentUser._id) {
    message = 'You are the current user';
  }

  // Add state to track available roles and selected role 
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user.roleId);

  // Load available roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await fetchWrapperAxios('/v1/roles/search');
        setAvailableRoles(roles);
      } catch (error) {
        showAlert('Failed to load roles', 'error');
      }
    };
    fetchRoles();
  }, [showAlert]);

  // Handler for when a role is selected
  const handleRoleChange = async (role) => {
    try {
      await fetchWrapperAxios(`/v1/users/update-role/${user._id}`, {
        method: 'PUT',
        data: { roleId: role },
      });
      setSelectedRole(role);
      showAlert('User role updated', 'success');
      handleClose(true); // Refresh user list
    } catch (error) {
      showAlert('Failed to update user role', 'error');
    }
  };

  // Check if current user can manage user activation
  const canManageActivation = currentUser.isSuperAdmin || currentUser.isAdmin;

  console.log('user dialog', { user, currentUser });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {user.username} {user.isDemo ? '(Demo)' : ''}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <ProfileCard user={user} {...user} />
        </DialogContentText>

        {currentUser.isSuperAdmin && <RolesDropdown
          roles={availableRoles}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />}
        {!currentUser.isSuperAdmin && <Label>{user.role}</Label>}
      </DialogContent>
      <DialogActions>
        {message}
        {canManageActivation && user._id !== currentUser._id && !user.isDemo && (
          <Button
            onClick={handleActivationToggle}
            color={user.isDeactivated ? 'success' : 'error'}
          >
            {user.isDeactivated ? 'Activate' : 'Deactivate'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func,
  user: PropTypes.object,
}
