import PropTypes from 'prop-types';
import { useState, useContext } from 'react';

import Box from '@mui/material/Box';

import { AuthContext } from 'src/contexts/AuthContext';

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const { userProfile } = useContext(AuthContext);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          marginTop: '20px',
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} userProfile={userProfile} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
