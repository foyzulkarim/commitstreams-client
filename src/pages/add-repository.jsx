import { Helmet } from 'react-helmet-async';

import AddRepositoryView from 'src/sections/repository/view/add-repository-view';

export default function RepositoryPage() {
  return (
    <>
      <Helmet>
        <title> Repositories </title>
      </Helmet>

      <AddRepositoryView />
    </>
  );
}
