import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import { fetchWrapperAxios } from 'src/utils/api';

import { useAlert } from 'src/contexts/AlertContext';

import FeedCards from '../feed-cards';

// ----------------------------------------------------------------------

export default function FeedView() {
  const [pulls, setPulls] = useState([]);
  const [reload, setReload] = useState(false);
  const { showAlert } = useAlert();

  const loadPullRequests = async () => {
    try {
      const data = await fetchWrapperAxios(`/v1/pulls/search`);
      setPulls(data);
      showAlert('Pull requests loaded', 'success');
    } catch (error) {
      showAlert('Pull requests error', 'error');
    }
  };

  useEffect(() => {
    loadPullRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const syncWithGitHubHandler = async () => {
    try {
      await fetchWrapperAxios(`/v1/pulls/fetch-updates`);
      setReload(!reload);
      showAlert('Sync with GitHub successful', 'success');
    } catch (error) {
      showAlert('Sync with GitHub error', 'error');
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
