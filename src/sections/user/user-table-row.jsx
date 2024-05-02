import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns'

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
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
      const parts = text.split(regex);
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
          <TextHighlight
            text={username}
            searchKeyword={searchTerm}
          />
        </Stack>
      </TableCell>

      <TableCell><TextHighlight
        text={displayName}
        searchKeyword={searchTerm}
      /></TableCell>

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
  searchTerm: PropTypes.string,
  public_repos: PropTypes.number,
};
