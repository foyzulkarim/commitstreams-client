import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import TextHighlight from 'src/components/text-highlight';

// ----------------------------------------------------------------------

export default function RoleTableRow({
  name,
  description = '',
  handleClick,
  searchTerm,
}) {
  return (
    <TableRow hover tabIndex={-1} onClick={handleClick}>
      <TableCell>
        <TextHighlight text={name} searchKeyword={searchTerm} />
      </TableCell>
      <TableCell>
        <TextHighlight text={description} searchKeyword={searchTerm} />
      </TableCell>
    </TableRow>
  );
}

RoleTableRow.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  handleClick: PropTypes.func,
  searchTerm: PropTypes.string,
};
