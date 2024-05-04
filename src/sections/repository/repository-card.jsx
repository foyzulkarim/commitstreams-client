/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TodayIcon from '@mui/icons-material/Today';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import VisibilityIcon from '@mui/icons-material/Visibility';


const RepositoryCard = ({
  full_name = '',
  description = '',
  owner = {},
  homepage = '',
  stargazers_count = 0,
  watchers_count = 0,
  forks_count = 0,
  updated_at = '',
  topics = [],
  license = {},
  created_at = '',
  language = '',
  html_url = '',
  languageData = {},
}) => {
  const timeSinceCreation = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  const formattedUpdatedAt = format(new Date(updated_at), 'MMM dd, yyyy');
  const totalLinesOfCode = Object.values(languageData).reduce((a, b) => a + b, 0);


  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<Avatar src={owner.avatar_url} />}
        title={full_name}
        subheader={timeSinceCreation}
      />

      <CardContent>
        <Stack spacing={2} flexWrap="wrap">
          <Stack flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} margin={1} flexWrap="wrap">
            {Object.entries(languageData).map(([lng, linesOfCode]) => (
              <Stack paddingTop={1}>
                <Chip
                  key={lng}
                  label={`${lng}: ${((linesOfCode / totalLinesOfCode) * 100).toFixed(2)}%`}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            {topics.map((topic) => (
              <Chip key={topic} label={topic} variant="outlined" size="small" />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} mt={1}>
            <Stack display="flex" alignItems="center">
              <StarIcon />
              <Typography variant="body2" ml={0.5}>
                {stargazers_count}
              </Typography>
            </Stack>
            <Stack display="flex" alignItems="center">
              <VisibilityIcon />
              <Typography variant="body2" ml={0.5}>
                {watchers_count}
              </Typography>
            </Stack>
            <Stack display="flex" alignItems="center">
              <ForkRightIcon />
              <Typography variant="body2" ml={0.5}>
                {forks_count}
              </Typography>
            </Stack>
          </Stack>
          <Stack>
            <Stack display="flex" alignItems="center">
              <TodayIcon />
              <Typography variant="body2" ml={0.5}>
                Updated on {formattedUpdatedAt}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={2} direction="row">
            {homepage && (
              <Link href={homepage} target="_blank" rel="noopener noreferrer">
                {homepage}
              </Link>
            )}
            {html_url && (
              <Link href={html_url} target="_blank" rel="noopener noreferrer">
                {html_url}
              </Link>
            )}
          </Stack>
          <Stack>
            {license && (
              <Stack display="flex" alignItems="center">
                <Link href={license.url} target="_blank" variant="body2" color="text.secondary">
                  License: {license.name}
                </Link>
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions disableSpacing>
        <Button variant="contained">Follow</Button>
      </CardActions>
    </Card>
  );
};

RepositoryCard.propTypes = {
  full_name: PropTypes.string,
  description: PropTypes.string,
  owner: PropTypes.shape({
    avatar_url: PropTypes.string,
  }),
  homepage: PropTypes.string,
  stargazers_count: PropTypes.number,
  forks_count: PropTypes.number,
  updated_at: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.string),
  license: PropTypes.shape({
    name: PropTypes.string,
  }),
  created_at: PropTypes.string,
  language: PropTypes.string,
  html_url: PropTypes.string,
  watchers_count: PropTypes.number,
  languageData: PropTypes.object,
};

export default RepositoryCard;
