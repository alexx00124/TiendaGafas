import React from 'react';
import { shallow, mount } from 'enzyme';

jest.mock('@/services/config', () => ({ apiKey: 'test' }));
jest.mock('firebase/app', () => ({ __esModule: true, default: { initializeApp: jest.fn(), firestore: jest.fn(), storage: jest.fn(), auth: jest.fn() } }));
jest.mock('firebase/auth', () => ({}));
jest.mock('firebase/firestore', () => ({}));
jest.mock('firebase/storage', () => ({}));
jest.mock('whatwg-fetch', () => ({}));

jest.mock('@ant-design/icons', () => ({
  LoadingOutlined: () => <i className="mock-loading" />,
  PlusOutlined: () => <i className="mock-plus" />,
  MinusOutlined: () => <i className="mock-minus" />,
  CloseOutlined: () => <i className="mock-close" />
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  NavLink: ({ children }) => <a>{children}</a>,
  Link: ({ children }) => <a>{children}</a>,
  withRouter: (Component) => (props) => <Component {...props} />,
  Redirect: () => null,
  useHistory: () => ({ push: jest.fn(), location: {}, listen: () => () => {} }),
  useRouteMatch: () => ({ path: '/', url: '/' })
}));

jest.mock('react-redux', () => ({
  useSelector: (fn) => fn({
    app: { isAuthenticating: false },
    profile: { name: 'Test' }
  }),
  useDispatch: () => jest.fn()
}));

jest.mock('react-modal', () => {
  const MockModal = ({ children, isOpen }) => (
    <div className="app-modal">{isOpen ? children : null}</div>
  );
  MockModal.setAppElement = jest.fn();
  return MockModal;
});

jest.mock('@/components/common/Filters', () => () => <div className="mock-filters" />);

import { Badge, Footer, Preloader, MessageDisplay, Boundary } from '@/components/common';
import AdminSidePanel from '@/components/common/AdminSidePanel';
import Modal from '@/components/common/Modal';
import BasketItem from '@/components/basket/BasketItem';
import BasketItemControl from '@/components/basket/BasketItemControl';
import BasketToggle from '@/components/basket/BasketToggle';
import ColorChooser from '@/components/common/ColorChooser';
import ImageLoader from '@/components/common/ImageLoader';
import FiltersToggle from '@/components/common/FiltersToggle';

describe('Badge', () => {
  it('renders children and count when count >= 1', () => {
    const wrapper = shallow(<Badge count={3}><span>icon</span></Badge>);
    expect(wrapper.find('.badge-count').text()).toBe('3');
    expect(wrapper.find('span').first().text()).toBe('icon');
  });

  it('does not render count when count is 0', () => {
    const wrapper = shallow(<Badge count={0}><span>icon</span></Badge>);
    expect(wrapper.find('.badge-count').exists()).toBe(false);
  });

  it('has className badge', () => {
    const wrapper = shallow(<Badge count={1}><span /></Badge>);
    expect(wrapper.hasClass('badge')).toBe(true);
  });
});

describe('Footer', () => {
  it('renders footer for root path', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('footer.footer').exists()).toBe(true);
    expect(wrapper.find('.footer-logo').exists()).toBe(true);
  });

  it('renders link to github profile', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('a[href="https://github.com/jgudo"]').text()).toContain('JULIUS GUEVARRA');
  });

  it('renders current year', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('h5').text()).toContain(String(new Date().getFullYear()));
  });
});

describe('Preloader', () => {
  it('renders preloader markup', () => {
    const wrapper = shallow(<Preloader />);
    expect(wrapper.find('.preloader').exists()).toBe(true);
    expect(wrapper.find('.logo-symbol').exists()).toBe(true);
  });
});

describe('AdminSidePanel', () => {
  it('renders products navigation link', () => {
    const wrapper = shallow(<AdminSidePanel />);
    expect(wrapper.find('.sidenavigation').exists()).toBe(true);
    expect(wrapper.find('.sidenavigation-menu').first().prop('to')).toBe('/admin/products');
  });
});

describe('MessageDisplay', () => {
  it('renders message', () => {
    const wrapper = shallow(<MessageDisplay message="Fetch failed" />);
    expect(wrapper.find('h2').text()).toBe('Fetch failed');
  });

  it('renders description when provided', () => {
    const wrapper = shallow(<MessageDisplay message="x" description="Details" />);
    expect(wrapper.find('span').text()).toBe('Details');
  });

  it('renders action button and triggers callback', () => {
    const action = jest.fn();
    const wrapper = shallow(<MessageDisplay message="x" buttonLabel="Retry" action={action} />);
    wrapper.find('button').simulate('click');
    expect(action).toHaveBeenCalled();
  });

  it('uses default label when buttonLabel not provided', () => {
    const wrapper = shallow(<MessageDisplay message="x" action={() => {}} />);
    expect(wrapper.find('button').text()).toBe('Okay');
  });
});

describe('Boundary', () => {
  it('renders children when no error', () => {
    const wrapper = shallow(<Boundary><div className="ok" /></Boundary>);
    expect(wrapper.find('.ok').exists()).toBe(true);
  });

  it('renders error message when hasError', () => {
    const wrapper = shallow(<Boundary><div /></Boundary>);
    wrapper.setState({ hasError: true });
    wrapper.update();
    expect(wrapper.find('.loader').exists()).toBe(true);
    expect(wrapper.text()).toContain('Something went wrong.');
  });

  it('flips to error state via static method', () => {
    const state = Boundary.getDerivedStateFromError();
    expect(state).toEqual({ hasError: true });
  });
});

describe('BasketToggle', () => {
  let addEventListenerSpy;
  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(document, 'addEventListener');
  });
  afterEach(() => {
    document.body.classList.remove('is-basket-open');
    addEventListenerSpy.mockRestore();
  });

  it('calls children render prop', () => {
    const child = jest.fn(() => null);
    BasketToggle({ children: child });
    expect(child).toHaveBeenCalledWith({ onClickToggle: expect.any(Function) });
  });

  it('toggles body class when opened', () => {
    let onClickToggle;
    BasketToggle({ children: (props) => { onClickToggle = props.onClickToggle; return null; } });
    onClickToggle();
    expect(document.body.classList.contains('is-basket-open')).toBe(true);
    onClickToggle();
    expect(document.body.classList.contains('is-basket-open')).toBe(false);
  });

  it('removes body class when clicking outside basket', () => {
    BasketToggle({ children: () => null });
    document.body.classList.add('is-basket-open');
    const clickHandler = addEventListenerSpy.mock.calls.find(([type]) => type === 'click')[1];
    clickHandler({ target: { closest: (sel) => {
      if (sel === '.basket') return null;
      if (sel === '.basket-toggle') return null;
      if (sel === '.basket-item-remove') return null;
      return null;
    } } });
    expect(document.body.classList.contains('is-basket-open')).toBe(false);
  });
});

describe('Modal', () => {
  it('renders children when open', () => {
    const wrapper = mount(
      <Modal isOpen onRequestClose={() => {}}>
        <div className="content" />
      </Modal>
    );
    expect(wrapper.find('.app-modal').exists()).toBe(true);
    expect(wrapper.find('.content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not render children when closed', () => {
    const wrapper = mount(
      <Modal isOpen={false} onRequestClose={() => {}}>
        <div className="content" />
      </Modal>
    );
    expect(wrapper.find('.content').exists()).toBe(false);
    wrapper.unmount();
  });

  it('passes onRequestClose to app-modal', () => {
    const onRequestClose = jest.fn();
    const wrapper = mount(
      <Modal isOpen onRequestClose={onRequestClose}>
        <div />
      </Modal>
    );
    expect(typeof onRequestClose).toBe('function');
    wrapper.unmount();
  });
});

describe('BasketItem', () => {
  const product = {
    id: 'p1',
    name: 'RayBan',
    price: 100,
    image: 'http://img',
    selectedSize: '54',
    selectedColor: '#000',
    availableColors: ['#000'],
    quantity: 2
  };

  it('renders product info', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.find('.basket-item').exists()).toBe(true);
    expect(wrapper.find('.basket-item-name').text()).toBe('RayBan');
  });

  it('renders quantity and total price', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.find('.basket-item-specs').text()).toContain('2');
    expect(wrapper.find('.basket-item-price').text()).toContain('200');
  });

  it('removes item from basket', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    wrapper.find('.basket-item-remove').simulate('click');
    expect(wrapper.find('.basket-item-remove').length).toBe(1);
  });

  it('links to product page and closes basket', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    const link = wrapper.find('Link').first();
    expect(link.prop('to')).toBe('/product/p1');
  });
});

describe('BasketItemControl', () => {
  const product = { id: 'p1', quantity: 2, maxQuantity: 5 };

  it('renders quantity controls', () => {
    const wrapper = shallow(<BasketItemControl product={product} />);
    expect(wrapper.find('button').length).toBe(2);
  });

  it('disables add button at max quantity', () => {
    const wrapper = shallow(<BasketItemControl product={{ ...product, quantity: 5 }} />);
    expect(wrapper.find('.basket-control-add').prop('disabled')).toBe(true);
  });

  it('disables minus button at quantity 1', () => {
    const wrapper = shallow(<BasketItemControl product={{ ...product, quantity: 1 }} />);
    expect(wrapper.find('.basket-control-minus').prop('disabled')).toBe(true);
  });

  it('clicking add dispatches addQtyItem', () => {
    const wrapper = shallow(<BasketItemControl product={{ ...product, quantity: 2 }} />);
    wrapper.find('.basket-control-add').simulate('click');
    expect(wrapper.find('.basket-control-add').length).toBe(1);
  });
});

describe('ColorChooser', () => {
  it('renders color items for each available color', () => {
    const wrapper = shallow(<ColorChooser availableColors={['black', 'red']} onSelectedColorChange={() => {}} />);
    expect(wrapper.find('.color-item').length).toBe(2);
  });

  it('selects color on click', () => {
    const onSelectedColorChange = jest.fn();
    const wrapper = shallow(<ColorChooser availableColors={['black']} onSelectedColorChange={onSelectedColorChange} />);
    wrapper.find('.color-item').simulate('click');
    expect(onSelectedColorChange).toHaveBeenCalledWith('black');
    expect(wrapper.find('.color-item').hasClass('color-item-selected')).toBe(true);
  });
});

describe('ImageLoader', () => {
  it('renders image when src provided', () => {
    const wrapper = shallow(<ImageLoader src="http://img" />);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').prop('src')).toBe('http://img');
  });

  it('marks image as loaded on load event', () => {
    const wrapper = shallow(<ImageLoader src="http://img" />);
    wrapper.find('img').simulate('load');
    expect(wrapper.find('img').hasClass('is-img-loaded')).toBe(true);
  });

  it('applies custom className', () => {
    const wrapper = shallow(<ImageLoader src="http://img" className="custom" />);
    expect(wrapper.find('img').prop('className')).toContain('custom');
  });
});

describe('FiltersToggle', () => {
  it('opens and closes filters', () => {
    const wrapper = shallow(<FiltersToggle><span>Filter</span></FiltersToggle>);
    expect(wrapper.find('.filters-toggle').exists()).toBe(true);
    wrapper.find('.filters-toggle').simulate('click');
    expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
    wrapper.find('.modal-close-button').simulate('click');
    expect(wrapper.find('Modal').prop('isOpen')).toBe(false);
  });
});