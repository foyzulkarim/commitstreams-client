import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { fetchWrapperAxios } from 'src/utils/api';

import RepositoryCard from '../repository-card';
import RepositoryToolbar from '../repository-toolbar';

// ----------------------------------------------------------------------

function NoDataCard({ searchTerm, setShowNoData }) {

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
      setShowNoData(false);
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timeoutId);
  }, [setShowNoData]);


  return (
    isVisible &&
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div" align="center">
          No results found for <pre>{searchTerm}</pre>
        </Typography>
      </CardContent>
    </Card>
  );
}

NoDataCard.propTypes = {
  searchTerm: PropTypes.string,
  setShowNoData: PropTypes.func,
}

export default function ProductsView() {

  // const [repositories, setRepositories] = useState([]);
  const [githubRepository, setGithubRepository] = useState(null);

  const [fetchDisabled, setFetchDisabled] = useState(true);
  const [searchDisabled, setSearchDisabled] = useState(true);

  const [showNoData, setShowNoData] = useState(false);

  // username 
  const [username, setUsername] = useState('');
  const onFilterUsername = (event) => {
    setUsername(event.target.value.trim());
  };

  // repository
  const [repository, setRepository] = useState('');
  const onFilterRepository = (event) => {
    setRepository(event.target.value.trim());
  };

  const onFetchFromGitHubButtonClick = async () => {
    try {
      const response = await fetchWrapperAxios('/v1/repositories/fetch-from-github', {
        method: 'POST',
        data: {
          username,
          repository,
        },
      });
      console.log(response); // repository
      setGithubRepository(response);
      setFetchDisabled(true);
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchButtonClick = async () => {
    try {
      const response = await fetchWrapperAxios('/v1/repositories/search', {
        method: 'POST',
        data: {
          username,
          repository,
        },
      });
      console.log(response); // repository

      // if response is empty (length is 0), enable the fetch button
      if (!response) {
        setFetchDisabled(false);
        setShowNoData(true);
      } else {
        setFetchDisabled(true);
      }
      setGithubRepository(response);
    } catch (error) {
      console.error(error);
      setFetchDisabled(true);
    }
  };

  // if both username and repository are not null, enable the search button
  useEffect(() => {
    if (username && repository) {
      setSearchDisabled(false);
    } else {
      setSearchDisabled(true);
    }
    setFetchDisabled(true);
  }, [username, repository]);


  return (
    <Container>
      <Stack container spacing={3}>
        <Card spacing={2}>
          <RepositoryToolbar
            onFetchFromGitHubButtonClick={onFetchFromGitHubButtonClick}
            onSearchButtonClick={onSearchButtonClick}
            onFilterUsername={onFilterUsername}
            onFilterRepository={onFilterRepository}
            username={username}
            repository={repository}
            searchDisabled={searchDisabled}
            fetchDisabled={fetchDisabled}
          />
        </Card>
        {githubRepository && <RepositoryCard {...githubRepository} />}
        {showNoData && <NoDataCard setShowNoData={setShowNoData} searchTerm={`${username}/${repository}`} />}
      </Stack>
    </Container>
  );
}
