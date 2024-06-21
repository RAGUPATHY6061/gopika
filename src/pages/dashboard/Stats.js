import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showStats } from '../../features/allJobs/allJobsSlice';
import { StatsContainer, Loading, ChartsContainer } from '../../components';

const Stats = () => {
  const { isLoading, monthlyApplications, error } = useSelector(
    (store) => store.allJobs
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showStats());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <StatsContainer />
      {monthlyApplications && monthlyApplications.length > 0 ? (
        <ChartsContainer data={monthlyApplications} />
      ) : (
        <div>No monthly applications data available</div>
      )}
    </>
  );
};

export default Stats;
