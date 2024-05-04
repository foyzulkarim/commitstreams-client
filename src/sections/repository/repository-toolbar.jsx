import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

export default function RepositoryToolbar({ onButtonClick,
  username, onFilterUsername, repository, onFilterRepository

}) {
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
      <Button variant="contained" color="primary" onClick={onButtonClick}>
        Fetch from GitHub
      </Button>
    </Toolbar>
  );
}

RepositoryToolbar.propTypes = {
  onButtonClick: PropTypes.func,
  username: PropTypes.string,
  onFilterUsername: PropTypes.func,
  repository: PropTypes.string,
  onFilterRepository: PropTypes.func
};
