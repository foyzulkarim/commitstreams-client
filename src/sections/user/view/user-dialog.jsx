import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { fetchWrapperAxios } from 'src/utils/api';

import { useAlert } from 'src/contexts/AlertContext';
import { AuthContext } from 'src/contexts/AuthContext';

import ProfileCard from './profile-card';


export default function AlertDialog({ open, closeDialog, user }) {

  // get current user from AuthContext
  const { userProfile: currentUser } = useContext(AuthContext);
  const { showAlert } = useAlert();

  // each follower will have {id: string, date: string} values in the array
  const followers = user.csFollowers ?? [];

  const handleClose = (shouldRefetch) => {
    closeDialog(shouldRefetch);
  };

  const handleFollow = async () => {
    // api call to follow user: /v1/users/:username/follow
    try {
      const response = await fetchWrapperAxios(`/v1/users/${user._id}/follow`);
      if (!response.ok) {
        showAlert('Follow user error', 'error');
      }
      else {
        showAlert('User followed', 'success');
      }
      handleClose(true);
    } catch (error) {
      showAlert('Follow user error', 'error');
      handleClose();
    }
  }

  // isDisable will be true if the user is the current user or the user is a demo user or if teh  current user is already in the followers list
  const isAlreadyFollowing = followers.some(follower => follower.id === currentUser._id);
  const isDisable = user._id === currentUser._id || user.isDemo || isAlreadyFollowing;

  let message = '';
  if (isAlreadyFollowing) {
    message = 'You are already following this user';
  } else if (user.isDemo) {
    message = 'Demo user';
  } else if (user._id === currentUser._id) {
    message = 'You are the current user';
  }

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
      </DialogContent>
      <DialogActions>
        {message}
        <Button disabled={isDisable} onClick={handleFollow}>Follow</Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func,
  user: PropTypes.object,
}
