import axios from "axios";
import {
  loginUser,
  receiveError,
  resetError,
  fetchedLocations,
} from "./actionUtils";

export const login = (user) => {
  return async (dispatch) => {
    try {
      dispatch(resetError());
      const response = await axios.post("api/user/login", user);
      const { token, email } = response.data;
      return dispatch(loginUser(token, email));
    } catch (err) {
      return dispatch(receiveError(err.response.data.msg));
    }
  };
};

export const fetchLocations = (token) => {
  return async (dispatch) => {
    try {
      dispatch(resetError());
      const response = await axios.get("api/fetch", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const { warehouses, zones } = response.data;
      return dispatch(fetchedLocations(warehouses, zones));
    } catch (err) {
      return dispatch(receiveError(err.response.data.msg));
    }
  };
};
