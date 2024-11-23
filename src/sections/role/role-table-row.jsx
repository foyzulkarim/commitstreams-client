import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import TextHighlight from 'src/components/text-highlight';

// ----------------------------------------------------------------------

export default function RoleTableRow({
  name,
  displayName,
  description,
  permissions,
  handleClick,
  searchTerm,
}) {
  return (
    <TableRow hover tabIndex={-1} onClick={handleClick}>
      <TableCell padding="checkbox">
        <input type="checkbox" />
      </TableCell>
      <TableCell>
        <TextHighlight text={name} searchKeyword={searchTerm} />
      </TableCell>

      <TableCell>
        <TextHighlight text={displayName} searchKeyword={searchTerm} />
      </TableCell>

      <TableCell>
        <TextHighlight text={description} searchKeyword={searchTerm} />
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {permissions?.map((permission) => (
            <Chip
              key={permission}
              label={permission}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}

RoleTableRow.propTypes = {
  name: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  permissions: PropTypes.array,
  handleClick: PropTypes.func,
  searchTerm: PropTypes.string,
};
