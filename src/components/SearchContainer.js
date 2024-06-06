
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleChange, clearFilters, getAllJobs } from '../features/allJobs/allJobsSlice';
import { FormRow, FormRowSelect } from '../components';
import Wrapper from '../assets/wrappers/SearchContainer';

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('');

  const { isLoading, search, searchStatus, searchType, sort, sortOptions } =
    useSelector((store) => store.allJobs);
  const { jobTypeOptions, statusOptions } = useSelector((store) => store.job);

  const dispatch = useDispatch();

  const handleSearch = (e) => {
    dispatch(handleChange({ name: e.target.name, value: e.target.value }));
  };

  const debounce = () => {
    let timeoutID;
    return (e) => {
      setLocalSearch(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        const searchValue = e.target.value || '';
        dispatch(handleChange({ name: e.target.name, value: searchValue }));
      }, 1000);
    };
  };
  const optimizedDebounce = useMemo(() => debounce(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSearch('');
    dispatch(clearFilters());
  };

  useEffect(() => {
    dispatch(getAllJobs());
  }, [search, searchStatus, searchType, sort, dispatch]);

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h4>Search Form</h4>
        <div className='form-center'>
          {/* Search Position */}
          <FormRow
            type='text'
            name='search'
            value={localSearch}
            handleChange={optimizedDebounce}
          />
          {/* Search by Status */}
          <FormRowSelect
            labelText='Status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          />
          {/* Search by Type */}
          <FormRowSelect
            labelText='Type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...jobTypeOptions]}
          />
          {/* Sort */}
          <FormRowSelect
            labelText='Sort'
            name='sort'
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
