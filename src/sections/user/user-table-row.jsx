import PropTypes from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns'

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  username,
  avatarUrl,
  displayName,
  created_at,
  location,
  public_repos,
  handleClick,
}) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" onClick={handleClick}>
      <TableCell component="th" scope="row" >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={username} src={avatarUrl} />
          <Typography variant="subtitle2" noWrap>
            {username}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>{displayName}</TableCell>

      <TableCell>{format(new Date(created_at), 'dd MMMM yyyy')} ({formatDistanceToNow(new Date(created_at), { addSuffix: true })})</TableCell>

      <TableCell>{location}</TableCell>

      <TableCell>
        <Label>{public_repos}</Label>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  displayName: PropTypes.any,
  handleClick: PropTypes.func,
  location: PropTypes.any,
  username: PropTypes.any,
  created_at: PropTypes.any,
  selected: PropTypes.any,
  public_repos: PropTypes.number,
};
