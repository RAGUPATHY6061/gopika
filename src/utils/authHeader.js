const authHeader = (thunkAPI) => {
  const token = thunkAPI.getState().user?.user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default authHeader;
