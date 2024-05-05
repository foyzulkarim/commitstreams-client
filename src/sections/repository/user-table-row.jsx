import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns'

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { fetchWrapperAxios } from 'src/utils/api';

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
  _id,
  full_name,
  language,
  created_at,
  forks_count,
  stargazers_count,
  topics,
  isFollowing,
  avatarUrl,
}) {

  const [following, setFollowing] = useState(isFollowing);

  const followRepository = async () => {
    try {
      const response = await fetchWrapperAxios(`/v1/repositories/${_id}/follow`);
      console.log(response); // repository followed   
      if (response.result) {
        // Update the state to reflect the change
        setFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell component="th" scope="row" onClick={handleClick}>
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
        {
          following ? (
            <Label color='success'>
              Following
            </Label>
          ) : (
            <Button color='primary' onClick={followRepository}>
              Follow
            </Button>
          )
        }
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  searchTerm: PropTypes.string,
  _id: PropTypes.string,
  full_name: PropTypes.string,
  language: PropTypes.string,
  created_at: PropTypes.string,
  forks_count: PropTypes.number,
  stargazers_count: PropTypes.number,
  topics: PropTypes.array,
  isFollowing: PropTypes.bool,
  avatarUrl: PropTypes.string,
};
