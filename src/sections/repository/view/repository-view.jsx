import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fetchWrapperAxios } from 'src/utils/api';

// import { repositories } from 'src/_mock/repositories';

import RepositoryCard from '../repository-card';
import RepositoryToolbar from '../repository-toolbar';

// ----------------------------------------------------------------------

export default function ProductsView() {

  const [repositories, setRepositories] = useState([]);

  // username 
  const [username, setUsername] = useState('');
  const onFilterUsername = (event) => {
    setUsername(event.target.value);
  };

  // repository
  const [repository, setRepository] = useState('');
  const onFilterRepository = (event) => {
    setRepository(event.target.value);
  };


  const onButtonClick = async () => {
    try {
      const response = await fetchWrapperAxios('/v1/repositories/fetch-from-github', {
        method: 'POST',
        data: {
          username,
          repository,
        },
      });
      console.log(response); // repository
      // add this response to the existing repositories
      setRepositories([...repositories, response]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Repositories
      </Typography>
      <Stack container spacing={3}>
        <Card spacing={2}>
          <RepositoryToolbar
            onButtonClick={onButtonClick}
            onFilterUsername={onFilterUsername}
            onFilterRepository={onFilterRepository}
            username={username}
            repository={repository}
          />
        </Card>
        {repositories.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <RepositoryCard {...product} />
          </Grid>
        ))}
      </Stack>
    </Container>
  );
}
