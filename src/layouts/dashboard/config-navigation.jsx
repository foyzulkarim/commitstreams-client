import { Box, Home, Users, Shield, Database, BarChart } from 'lucide-react';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Feed',
    path: '/',
    icon: <Home size={24} />,
  },
  {
    title: 'repositories',
    path: '/repositories',
    icon: <Database size={24} />,
  },
  {
    title: 'users',
    path: '/user',
    icon: <Users size={24} />,
  },
  {
    title: 'roles',
    path: '/role',
    icon: <Shield size={24} />,
  },
  {
    title: 'resources',
    path: '/resource',
    icon: <Box size={24} />,
  },
  {
    title: 'analytics',
    path: '/analytics',
    icon: <BarChart size={24} />,
  },
];

export default navConfig;
