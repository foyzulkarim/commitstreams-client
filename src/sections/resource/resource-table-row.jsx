import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import TextHighlight from 'src/components/text-highlight';
// ----------------------------------------------------------------------
export default function ResourceTableRow({
  name,
  description,
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

ResourceTableRow.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  handleClick: PropTypes.func,
  searchTerm: PropTypes.string,
};
