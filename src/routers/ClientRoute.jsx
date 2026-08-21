import { ADMIN_DASHBOARD, SIGNIN } from '@/constants/routes';
import PropType from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const ClientContent = ({ component: Component, ...props }) => {
  const { isAuth, role } = useSelector((state) => ({
    isAuth: !!state.auth,
    role: state.auth?.role || ''
  }));

  if (isAuth && role === 'USER') {
    return (
      <main className="content">
        <Component {...props} />
      </main>
    );
  }

  if (isAuth && role === 'ADMIN') {
    return <Redirect to={ADMIN_DASHBOARD} />;
  }

  return (
    <Redirect to={{
      pathname: SIGNIN,
      state: { from: props.location }
    }}
    />
  );
};

ClientContent.propTypes = {
  component: PropType.func.isRequired
};

function createClientRoute(WrappedComponent) {
  return function ClientRouteHandler(routeProps) {
    return <ClientContent component={WrappedComponent} {...routeProps} />;
  };
}

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
    component={createClientRoute(component)}
  />
);

PrivateRoute.propTypes = {
  component: PropType.func.isRequired
};

export default PrivateRoute;
