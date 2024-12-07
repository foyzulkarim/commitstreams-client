import { Box, Home, Users, Shield, Database, BarChart } from 'lucide-react';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Feed',
    path: '/',
    identifier: 'sidebar-feed',
    icon: <Home size={24} />,
  },
  {
    title: 'repositories',
    path: '/repositories',
    identifier: 'sidebar-repositories',
    icon: <Database size={24} />,
  },
  {
    title: 'users',
    path: '/user',
    identifier: 'sidebar-users',
    icon: <Users size={24} />,
  },
  {
    title: 'roles',
    path: '/role',
    identifier: 'sidebar-roles',
    icon: <Shield size={24} />,
  },
  {
    title: 'resources',
    path: '/resource',
    identifier: 'sidebar-resources',
    icon: <Box size={24} />,
  },
  {
    title: 'analytics',
    path: '/analytics',
    identifier: 'sidebar-analytics',
    icon: <BarChart size={24} />,
  },
];

export default navConfig;
