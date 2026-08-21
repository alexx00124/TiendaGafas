import * as routes from '@/constants/routes';

describe('routes', () => {
  const expectedRoutes = {
    HOME: '/',
    SHOP: '/shop',
    FEATURED_PRODUCTS: '/featured',
    RECOMMENDED_PRODUCTS: '/recommended',
    ACCOUNT: '/account',
    ACCOUNT_EDIT: '/account/edit',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_USERS: '/admin/users',
    ADD_PRODUCT: '/admin/add',
    EDIT_PRODUCT: '/admin/edit',
    SEARCH: '/search/:searchKey',
    SIGNIN: '/signin',
    SIGNOUT: '/signout',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot_password',
    CHECKOUT_STEP_1: '/checkout/step1',
    CHECKOUT_STEP_2: '/checkout/step2',
    CHECKOUT_STEP_3: '/checkout/step3',
    VIEW_PRODUCT: '/product/:id'
  };

  it.each(Object.entries(expectedRoutes))(
    'should export %s with correct value',
    (key, value) => {
      expect(routes[key]).toBe(value);
    }
  );

  it('should have the correct number of route constants', () => {
    expect(Object.keys(routes)).toHaveLength(Object.keys(expectedRoutes).length);
  });
});
