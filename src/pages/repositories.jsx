import { Helmet } from 'react-helmet-async';

import Repositories from 'src/sections/repository/view/repositories-view';

export default function RepositoryPage() {
  return (
    <>
      <Helmet>
        <title> Following </title>
      </Helmet>

      <Repositories />
    </>
  );
}
