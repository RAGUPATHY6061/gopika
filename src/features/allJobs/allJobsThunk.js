import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllJobsThunk = async (_, thunkAPI) => {
  const { page, search, searchStatus, searchType, sort } = thunkAPI.getState().allJobs;
  try {
    const jobsRef = collection(db, 'jobs');
    let q = query(jobsRef);

    if (searchStatus !== 'all') {
      q = query(q, where('status', '==', searchStatus));
    }
    if (searchType !== 'all') {
      q = query(q, where('jobType', '==', searchType));
    }
    if (search) {
      q = query(q, where('position', '>=', search), where('position', '<=', search + '\uf8ff'));
    }
    if (sort) {
      const sortOrder = sort === 'latest' ? 'desc' : 'asc';
      q = query(q, orderBy('createdAt', sortOrder));
    }

    q = query(q, limit(10));

    const querySnapshot = await getDocs(q);
    const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const totalJobsSnapshot = await getDocs(jobsRef);
    const totalJobs = totalJobsSnapshot.size;
    const numOfPages = Math.ceil(totalJobs / 10);

    return { jobs, totalJobs, numOfPages };
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const showStatsThunk = async (_, thunkAPI) => {
  try {
    // Your existing logic to fetch jobs data...
    const jobsQuery = query(collection(db, 'jobs'));
    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map(doc => doc.data());

    // Calculate stats...
    const stats = {
      pending: jobs.filter(job => job.status === 'pending').length,
      interview: jobs.filter(job => job.status === 'interview').length,
      declined: jobs.filter(job => job.status === 'declined').length,
    };

    // Calculate monthly applications...
    const monthlyApplications = jobs.reduce((acc, job) => {
      let createdAt;
      if (job.createdAt.toDate) {
        createdAt = job.createdAt.toDate();
      } else if (typeof job.createdAt === 'string') {
        createdAt = new Date(job.createdAt);
      } else if (job.createdAt instanceof Date) {
        createdAt = job.createdAt;
      } else {
        createdAt = new Date();
      }

      const monthYear = `${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += 1;
      return acc;
    }, {});

    const formattedMonthlyApplications = Object.keys(monthlyApplications).map(key => ({
      date: new Date(key.split('-')[1], key.split('-')[0] - 1),
      count: monthlyApplications[key]
    }));

    return { stats, monthlyApplications: formattedMonthlyApplications };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
};