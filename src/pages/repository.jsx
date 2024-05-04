import { Helmet } from 'react-helmet-async';

import { RepositoryView } from 'src/sections/repository/view';

export default function RepositoryPage() {
  return (
    <>
      <Helmet>
        <title> Repositories </title>
      </Helmet>

      <h1>Repositories</h1>
      <RepositoryView />
    </>
  );
}
