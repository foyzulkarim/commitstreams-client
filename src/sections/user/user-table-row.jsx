import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

function TextHighlight({ text, searchKeyword }) {
  const [highlightedText, setHighlightedText] = useState(text);

  useEffect(() => {
    if (searchKeyword) {
      const regex = new RegExp(`(${searchKeyword})`, 'gi');
      const parts = text?.split(regex) ?? [];
      const newHighlightedText = parts.map((part, i) =>
        part.toLowerCase() === searchKeyword.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      );
      setHighlightedText(newHighlightedText);
    } else {
      setHighlightedText(text); // Reset to original text
    }
  }, [text, searchKeyword]);

  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="subtitle2">
        {highlightedText}
      </Typography>
    </Stack>
  );
}

TextHighlight.propTypes = {
  text: PropTypes.string.isRequired,
  searchKeyword: PropTypes.string,
}


export default function UserTableRow({
  searchTerm,
  avatarUrl,
  displayName,
  email,
  authType,
  handleClick,
  isAdmin,
}) {
  console.log(avatarUrl);
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
