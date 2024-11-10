import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Feed',
    path: '/',
    icon: icon('ic_feed'),
  },
  {
    title: 'repositories',
    path: '/repositories',
    icon: icon('ic_repository'),
  },
  {
    title: 'users',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'roles',
    path: '/role',
    icon: icon('ic_role'),
  },
  {
    title: 'analytics',
    path: '/analytics',
    icon: icon('ic_analytics'),
  },
];

export default navConfig;
