jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistCombineReducers: (config, reducers) => {
      const { combineReducers } = jest.requireActual('redux');
      return combineReducers(reducers);
    },
    persistStore: jest.fn(() => ({ pause: jest.fn(), purge: jest.fn() }))
  };
});

jest.mock('redux-persist/lib/storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve())
}));

jest.mock('redux-saga', () => {
  const sagaMiddlewareInstance = (store) => (next) => (action) => next(action);
  sagaMiddlewareInstance.run = jest.fn();
  return jest.fn(() => sagaMiddlewareInstance);
});

import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistCombineReducers, persistStore } from 'redux-persist';
import { LOADING } from '@/constants/constants';
import configureStore from '@/redux/store/store';
import rootSaga from '@/redux/sagas/rootSaga';

describe('Store', () => {
  it('creates a store with correct initial state via createSagaMiddleware', () => {
    const sagaMiddleware = createSagaMiddleware();
    expect(sagaMiddleware).toBeDefined();
  });

  it('persistCombineReducers combines reducers', () => {
    const mockReducer = (state = { count: 0 }, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return { count: state.count + 1 };
        default:
          return state;
      }
    };

    const combined = persistCombineReducers(
      { key: 'root', storage: {} },
      { test: mockReducer }
    );
    expect(combined).toBeDefined();
    expect(typeof combined).toBe('function');
  });

  it('creates a functional store with a mock reducer', () => {
    const mockReducer = (state = { value: 0 }, action) => {
      switch (action.type) {
        case 'SET':
          return { value: action.payload };
        default:
          return state;
      }
    };

    const store = createStore(
      mockReducer,
      applyMiddleware(createSagaMiddleware())
    );

    expect(store.getState()).toEqual({ value: 0 });
    store.dispatch({ type: 'SET', payload: 42 });
    expect(store.getState()).toEqual({ value: 42 });
  });

  it('persistStore returns an object', () => {
    const mockStore = { dispatch: jest.fn(), getState: jest.fn(() => ({})) };
    const persistor = persistStore(mockStore);
    expect(persistor).toBeDefined();
  });
});

describe('Store factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a store and persistor wired with the saga middleware', () => {
    // createSagaMiddleware is mocked as a singleton factory, so this is the
    // exact middleware instance configureStore() receives internally.
    const sagaMiddleware = createSagaMiddleware();

    const { store, persistor } = configureStore();

    expect(store).toBeDefined();
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
    expect(persistor).toBeDefined();
    expect(sagaMiddleware.run).toHaveBeenCalledWith(rootSaga);
  });

  it('root reducer handles a sample action dispatched on the created store', () => {
    const { store } = configureStore();

    expect(store.getState().app.loading).toBe(false);

    store.dispatch({ type: LOADING, payload: true });

    expect(store.getState().app.loading).toBe(true);
  });

  it('notifies subscribers when an action is dispatched', () => {
    const { store } = configureStore();
    const subscriber = jest.fn();

    const unsubscribe = store.subscribe(subscriber);
    store.dispatch({ type: LOADING, payload: true });

    expect(subscriber).toHaveBeenCalled();

    unsubscribe();
    store.dispatch({ type: LOADING, payload: false });
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
});
