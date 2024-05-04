import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

export default function RepositoryToolbar(
  { onFetchFromGitHubButtonClick, onSearchButtonClick, username, onFilterUsername, repository, onFilterRepository, searchDisabled, fetchDisabled }) {

  return (

    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: "space-between"
      }}
    >
      <Stack direction="row" spacing={2}>
        <OutlinedInput
          value={username}
          onChange={onFilterUsername}
          placeholder="Username"
        />
        <OutlinedInput
          value={repository}
          onChange={onFilterRepository}
          placeholder="Repository"
        />
      </Stack>
      <Stack direction="row" justifyItems="flex-end" spacing={1}>
        <Button variant="contained" color="primary" disabled={searchDisabled} onClick={onSearchButtonClick}>
          Search
        </Button>
        <Button variant="contained" color="primary" disabled={fetchDisabled} onClick={onFetchFromGitHubButtonClick}>
          Fetch from GitHub
        </Button>
      </Stack>
    </Toolbar>
  );
}

RepositoryToolbar.propTypes = {
  onFetchFromGitHubButtonClick: PropTypes.func,
  onSearchButtonClick: PropTypes.func,
  username: PropTypes.string,
  onFilterUsername: PropTypes.func,
  repository: PropTypes.string,
  onFilterRepository: PropTypes.func,
  searchDisabled: PropTypes.bool,
  fetchDisabled: PropTypes.bool,
};
