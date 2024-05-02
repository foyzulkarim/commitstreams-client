import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import MapIcon from '@mui/icons-material/Map';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import CardContent from '@mui/material/CardContent';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const ProfileCard = ({
  username: login,
  avatarUrl: avatar_url,
  html_url,
  name,
  company,
  blog,
  location,
  email,
  bio,
  twitter_username,
  followers,
  following,
}) => (
  <Card>
    <CardHeader
      avatar={
        <Avatar alt={name} src={avatar_url} sx={{ width: 60, height: 60 }} />
      }
      title={
        <Typography variant="h6">
          <Link
            href={html_url}
            target="_blank"
            rel="noreferrer noopener"
            underline="hover"
          >
            {name}
          </Link>
        </Typography>
      }
      subheader={`@${login}`}
    />
    <CardContent>
      {bio && (
        <Typography variant="body2" color="text.secondary">
          {bio}
        </Typography>
      )}

      <Stack>
        {/* ... Similar structure for followers & following ... */}
        {company && (
          <ListItem disableGutters>
            <ListItemIcon>
              <LocationCityIcon />
            </ListItemIcon>
            <ListItemText primary={company} />
          </ListItem>
        )}
        {location && (
          <ListItem disableGutters>
            <ListItemIcon>
              {' '}
              <MapIcon />{' '}
            </ListItemIcon>
            <ListItemText primary={location} />
          </ListItem>
        )}
        {blog && (
          <ListItem disableGutters>
            <ListItemIcon>
              {' '}
              <LinkedInIcon />{' '}
            </ListItemIcon>
            <ListItemText>
              {' '}
              <Link href={blog} target="_blank" rel="noreferrer noopener">
                {' '}
                Linkedin{' '}
              </Link>{' '}
            </ListItemText>
          </ListItem>
        )}
        {email && (
          <ListItem disableGutters>
            <ListItemIcon>
              {' '}
              <EmailIcon />{' '}
            </ListItemIcon>
            <ListItemText primary={email} />
          </ListItem>
        )}
        {twitter_username && (
          <ListItem disableGutters>
            <ListItemIcon>
              {' '}
              <TwitterIcon />{' '}
            </ListItemIcon>
            <ListItemText>
              <Link
                href={`https://twitter.com/${twitter_username}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {twitter_username}
              </Link>
            </ListItemText>
          </ListItem>
        )}
      </Stack>
    </CardContent>
  </Card>
);

ProfileCard.propTypes = {
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  html_url: PropTypes.string,
  name: PropTypes.string,
  company: PropTypes.string,
  blog: PropTypes.string,
  location: PropTypes.string,
  email: PropTypes.string,
  bio: PropTypes.string,
  twitter_username: PropTypes.string,
  followers: PropTypes.number,
  following: PropTypes.number,
}

export default ProfileCard;
