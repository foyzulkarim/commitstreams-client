import PropTypes from 'prop-types';
import React, { useMemo, useState, useContext, createContext } from 'react';

import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'success' });

  const showAlert = (message, severity = 'success') => {
    setAlertState({ open: true, message, severity });
  };

  return (
    useMemo(() => {
      const handleClose = () => {
        setAlertState({ ...alertState, open: false });
      };

      return (
        <AlertContext.Provider value={{ showAlert }}>
          {children}
          <Snackbar open={alertState.open} autoHideDuration={6000} onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <MuiAlert onClose={handleClose} severity={alertState.severity} elevation={6} variant="filled">
              {alertState.message}
            </MuiAlert>
          </Snackbar>
        </AlertContext.Provider>
      );
    }, [children, alertState])
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAlert = () => useContext(AlertContext);
