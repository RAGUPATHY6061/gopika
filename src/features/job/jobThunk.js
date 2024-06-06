import { doc, setDoc, deleteDoc, updateDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import { clearValues } from "./jobSlice";
import { getAllJobs } from '../allJobs/allJobsSlice';

export const createJobThunk = async (job, thunkAPI) => {
  try {
    const jobId = job.id || doc(collection(db, "jobs")).id;
    const newJobRef = doc(db, "jobs", jobId);

    const jobData = {
      ...job,
      id: jobId,
      createdAt: new Date().toISOString(),
    };

    await setDoc(newJobRef, jobData);
    thunkAPI.dispatch(clearValues());
    return "Job Created";
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
};

export const deleteJobThunk = async (jobId, thunkAPI) => {
  try {
    if (!jobId) throw new Error("Job ID is required to delete a job");
    await deleteDoc(doc(db, "jobs", jobId));
    thunkAPI.dispatch(getAllJobs());
    return "Job Deleted";
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
};

export const editJobThunk = async ({ jobId, job }, thunkAPI) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const updatedJob = { ...job, createdAt: job.createdAt || new Date().toISOString() };
    await updateDoc(jobRef, updatedJob);
    thunkAPI.dispatch(clearValues());
    return "Job Modified";
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
};

export const getAllJobsThunk = async (thunkAPI) => {
  try {
    const jobsQuery = query(collection(db, "jobs"));
    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
    }));
    return { jobs };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
};
