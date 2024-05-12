import React from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import SourceIcon from '@mui/icons-material/Source';

const PullRequestCard = ({
  title, // checked
  html_url, // checked
  number, // checked
  state, // checked
  created_at, // checked
  updated_at, // checked
  closed_at, // checked
  merged_at, // checked
  user, // Author {id, login, node_id, type, avatar_url}  
  source_branch, // { full_name, id, name, node_id}
  target_branch, // { full_name, id, name, node_id}
}) => (
  <Card>
    <CardHeader
      avatar={<Avatar alt={user.login} src={user.avatar_url} />}
      title={
        <Typography variant="h6">
          <Link href={html_url} target="_blank" rel="noopener noreferrer">
            {title} #{number}
          </Link>
        </Typography>
      }
      subheader={`https://github.com/${target_branch.full_name} `}
    />

    <CardContent>
      {/* Branch Information */}
      <Box mt={2}>
        <Typography variant="subtitle2">Branches:</Typography>
        <Box display="flex" alignItems="center">
          <SourceIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            {source_branch.full_name}
          </Typography>
          {/* Add a similar box for the base branch if you'd like */}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2">
            Created:{' '}
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}{' '}
          </Typography>
          <Typography variant="body2">
            Updated:{' '}
            {formatDistanceToNow(new Date(updated_at), { addSuffix: true })}{' '}
          </Typography>
          {/* ... Add closed, merged, etc. if needed */}
        </Grid>
        {/* Grid items for Avatar grid  and Hyperlink Grid */}
      </Grid>
    </CardContent>
  </Card>
);

PullRequestCard.propTypes = {
  title: PropTypes.string.isRequired,
  html_url: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  state: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  closed_at: PropTypes.string,
  merged_at: PropTypes.string,
  user: PropTypes.object.isRequired,
  source_branch: PropTypes.object.isRequired,
  target_branch: PropTypes.object.isRequired,
};

export default PullRequestCard;
