import { SearchOutlined } from '@ant-design/icons';
import { TABLET_BREAKPOINT } from '@/constants/magicNumbers';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearRecentSearch, removeSelectedRecent } from '@/redux/actions/filterActions';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const { filter, isLoading } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading
  }));
  const searchbarRef = useRef(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const isMobile = window.screen.width <= TABLET_BREAKPOINT;

  const onSearchChange = (e) => {
    const val = e.target.value.trimStart();
    setSearchInput(val);
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
      searchbarRef.current.classList.remove('is-open-recent-search');

      if (isMobile) {
        history.push('/');
      }

      history.push(`/search/${searchInput.trim().toLowerCase()}`);
    }
  };

  const recentSearchClickHandler = (e) => {
    const searchBar = e.target.closest('.searchbar');

    if (!searchBar) {
      searchbarRef.current.classList.remove('is-open-recent-search');
      document.removeEventListener('click', recentSearchClickHandler);
    }
  };

  const onFocusInput = (e) => {
    e.target.select();

    if (filter.recent.length !== 0) {
      searchbarRef.current.classList.add('is-open-recent-search');
      document.addEventListener('click', recentSearchClickHandler);
    }
  };

  const onClickRecentSearch = (keyword) => {
    searchbarRef.current.classList.remove('is-open-recent-search');
    history.push(`/search/${keyword.trim().toLowerCase()}`);
  };

  const onClearRecent = () => {
    dispatch(clearRecentSearch());
  };

  return (
    <>
      <div className="searchbar" ref={searchbarRef}>
        <SearchOutlined className="searchbar-icon" />
        <input
          className="search-input searchbar-input"
          onChange={onSearchChange}
          onKeyUp={onKeyUp}
          onFocus={onFocusInput}
          placeholder="Search product..."
          readOnly={isLoading}
          type="text"
          value={searchInput}
        />
        {filter.recent.length !== 0 && (
          <div className="searchbar-recent">
            <div className="searchbar-recent-header">
              <h5>Recent Search</h5>
              <button
                className="searchbar-recent-clear text-subtle"
                onClick={onClearRecent}
                type="button"
              >
                Clear
              </button>
            </div>
            {filter.recent.map((item, index) => (
              <div
                className="searchbar-recent-wrapper"
                key={`search-${item}-${index}`}
              >
                <button
                  className="searchbar-recent-keyword margin-0"
                  onClick={() => onClickRecentSearch(item)}
                  type="button"
                >
                  {item}
                </button>
                <button
                  className="searchbar-recent-button text-subtle"
                  onClick={() => dispatch(removeSelectedRecent(item))}
                  type="button"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
