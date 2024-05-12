import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import PullRequestCard from './pull-request-card';

const FeedCards = ({ items }) => (
  <Stack spacing={2}>
    {items.map((item) => (
      <PullRequestCard key={item._id} {...item} />
    ))}
  </Stack>
);

FeedCards.propTypes = {
  items: PropTypes.array.isRequired,
};

export default FeedCards;
