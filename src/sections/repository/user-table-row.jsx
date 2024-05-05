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
      const escapedSearchKeyword = searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      const regex = new RegExp(`(${escapedSearchKeyword})`, 'i');
      const parts = text?.split(regex) ?? [];
      const newHighlightedText = parts.map((part, i) =>
        part.toLowerCase() === escapedSearchKeyword.toLowerCase() ? (
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
  handleClick,
  searchTerm,
  full_name,
  language,
  created_at,
  forks_count,
  stargazers_count,
  topics,
  isFollowing,
  avatarUrl,
}) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" onClick={handleClick}>
      <TableCell component="th" scope="row" >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={full_name} src={avatarUrl} />
          <TextHighlight
            text={full_name}
            searchKeyword={searchTerm}
          />
        </Stack>
      </TableCell>

      <TableCell><TextHighlight
        text={language}
        searchKeyword={searchTerm}
      /></TableCell>

      <TableCell>{format(new Date(created_at), 'dd MMMM yyyy')} ({formatDistanceToNow(new Date(created_at), { addSuffix: true })})</TableCell>

      <TableCell>
        <Label>{forks_count}</Label>
      </TableCell>

      <TableCell>
        <Label>{stargazers_count}</Label>
      </TableCell>
      <TableCell>
        <Label color={isFollowing ? 'success' : 'error'}>
          {isFollowing ? 'Following' : 'Not following'}
        </Label>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  searchTerm: PropTypes.string,
  full_name: PropTypes.string,
  language: PropTypes.string,
  created_at: PropTypes.string,
  forks_count: PropTypes.number,
  stargazers_count: PropTypes.number,
  topics: PropTypes.array,
  isFollowing: PropTypes.bool,
  avatarUrl: PropTypes.string,
};
