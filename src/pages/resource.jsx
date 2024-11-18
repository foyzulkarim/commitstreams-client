import { Helmet } from 'react-helmet-async';

import { ResourceView } from 'src/sections/resource';
// ----------------------------------------------------------------------
export default function ResourcePage() {
  return (
    <>
      <Helmet>
        <title> Resources | CommitStreams </title>
      </Helmet>

      <ResourceView />
    </>
  );
}