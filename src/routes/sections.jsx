/* eslint-disable import/no-unresolved */
import PropTypes from 'prop-types';
import { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthContext } from 'src/contexts/AuthContext';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const LoginSuccess = lazy(() => import('src/pages/login-success'));
export const AddRepositoryView = lazy(() => import('src/pages/add-repository'));
export const RepositoriesView = lazy(() => import('src/pages/repositories'));
export const FeedPage = lazy(() => import('src/pages/feed'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const RolePage = lazy(() => import('src/pages/role'));
export const ResourcePage = lazy(() => import('src/pages/resource')); // Add this line

// ----------------------------------------------------------------------

const ProtectedComponent = ({ children }) => {
  const { isAuthenticated, clearAuthState } = useContext(AuthContext);

  if (!isAuthenticated) {
    clearAuthState();
  };

  return children;
};

ProtectedComponent.propTypes = {
  children: PropTypes.node,
};

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <ProtectedComponent>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedComponent>
      ),
      children: [
        { path: 'user', element: <UserPage /> },
        { path: 'add-repository', element: <AddRepositoryView /> },
        { path: 'repositories', element: <RepositoriesView /> },
        { path: 'analytics', element: <IndexPage /> },
        { element: <FeedPage />, index: true },
        { path: 'role', element: <RolePage /> },
        { path: 'resource', element: <ResourcePage /> }, // Add this line
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'login-success',
      element: <LoginSuccess />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
  ]);

  return routes;
}
