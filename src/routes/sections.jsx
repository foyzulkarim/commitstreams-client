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
export const ProductsPage = lazy(() => import('src/pages/products'));
export const FeedPage = lazy(() => import('src/pages/feed'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const ProtectedComponent = ({ children }) => {
  const { isAuthenticated, clearAuthState } = useContext(AuthContext);
  console.log('ProtectedComponent children:', { children, isAuthenticated });

  if (!isAuthenticated) {
    console.log('ProtectedComponent: not authenticated')
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
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'feed', element: <FeedPage /> },
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
  ]);

  return routes;
}
