import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Label from 'src/components/label';
import TextHighlight from 'src/components/text-highlight';

export default function UserTableRow({
  searchTerm,
  avatarUrl,
  displayName,
  email,
  authType,
  handleClick,
  isAdmin,
}) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" onClick={handleClick}>
      <TableCell><TextHighlight
        text={displayName}
        searchKeyword={searchTerm}
      /></TableCell>

      <TableCell>
        <TextHighlight
          text={email}
          searchKeyword={searchTerm}
        />
        {' '}{isAdmin && <Label color="error">Admin</Label>}
      </TableCell>

      <TableCell>
        <Label>{authType}</Label>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  displayName: PropTypes.any,
  handleClick: PropTypes.func,
  email: PropTypes.any,
  authType: PropTypes.any,
  isAdmin: PropTypes.bool,
  searchTerm: PropTypes.string,
};
