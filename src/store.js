import { configureStore } from '@reduxjs/toolkit';
import jobSlice from './features/job/jobSlice';
import userSlice from './features/user/userSlice';
import allJobsSlice from './features/allJobs/allJobsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    job: jobSlice,
    allJobs: allJobsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['allJobs.jobs.createdAt'],
        ignoredActionPaths: ['meta.arg', 'payload.createdAt'],
        ignoredActions: ['allJobs/getJobs/fulfilled'],
      },
    }),
});
