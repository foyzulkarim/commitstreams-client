import { Helmet } from 'react-helmet-async';

import { RoleView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

export default function RolePage() {
  return (
    <>
      <Helmet>
        <title> Roles | CommitStreams </title>
      </Helmet>

      <RoleView />
    </>
  );
}
