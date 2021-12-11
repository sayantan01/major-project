export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const CREATE_CLASSROOM = "CREATE_CLASSROOM";
export const RECEIVE_ERROR = "RECEIVE_ERROR";
export const RESET_ERROR = "RESET_ERROR";
export const FETCH_LOCATIONS = "FETCH_LOCATIONS";
export const GET_PREDICTION = "GET_PREDICTION";

export const loginUser = (token, email, isTeacher, classrooms) => {
  return {
    type: LOGIN_USER,
    token,
    email,
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};

export const receiveError = (msg) => {
  return {
    type: RECEIVE_ERROR,
    msg,
  };
};

export const resetError = () => {
  return {
    type: RESET_ERROR,
  };
};

export const fetchedLocations = (warehouses, zones) => {
  return {
    type: FETCH_LOCATIONS,
    warehouses,
    zones,
  };
};

export const getPrediction = (index, warehouse) => {
  return {
    type: GET_PREDICTION,
    index,
    warehouse,
  };
};
