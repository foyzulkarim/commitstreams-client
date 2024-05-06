import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import { fetchWrapperAxios } from 'src/utils/api';

import FeedCards from '../feed-cards';

// ----------------------------------------------------------------------

export default function FeedView() {
  const [pulls, setPulls] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loadPullRequests = async () => {
      try {
        // Load repositories from the backend using fetch
        const data = await fetchWrapperAxios(`/v1/pulls/search`);
        setPulls(data);
        console.log('Load pull requests:', data);
      } catch (error) {
        console.error('Load pull reqeusts error:', error);
      }
    };

    loadPullRequests();
  }, [reload]);

  const syncWithGitHubHandler = async () => {
    try {
      const data = await fetchWrapperAxios(`/v1/pulls/fetch-updates`);
      setReload(!reload);
      console.log('Sync with GitHub:', data);
    } catch (error) {
      console.error('Sync with GitHub error:', error);
    }
  }

  return (
    <Container>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="space-between"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" justifyContent="flex-start">
          <Button variant='contained' startIcon={<CloudSyncIcon />} onClick={syncWithGitHubHandler}>Sync with GitHub</Button>
        </Stack>
      </Stack>

      <Stack>
        <FeedCards items={pulls} />
      </Stack>
    </Container>
  );
}
