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
  isSuperAdmin,
  role,
}) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" onClick={handleClick}>
      <TableCell style={{ padding: '16px' }}>
        <TextHighlight
          text={displayName}
          searchKeyword={searchTerm}
        />
      </TableCell>

      <TableCell style={{ padding: '16px' }}>
        <TextHighlight
          text={email}
          searchKeyword={searchTerm}
        />
      </TableCell>
      <TableCell style={{ padding: '16px' }}>
        <Label {...(isSuperAdmin ? { color: 'success' } : {})}>{role}</Label>
      </TableCell>
      <TableCell style={{ padding: '16px' }}>
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
  isSuperAdmin: PropTypes.bool,
  searchTerm: PropTypes.string,
  role: PropTypes.string,
};
