import {
  LOGIN_USER,
  LOGOUT_USER,
  RECEIVE_ERROR,
  RESET_ERROR,
  FETCH_LOCATIONS,
  GET_PREDICTION
} from "../actions/actionUtils";

const initialState = {
  token: null,
  email: "",
  msg: "",
  warehouses: null,
  zones: null,
  index: 13,
  warehouse: 0
};

function reducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case LOGIN_USER:
      const obj = {
        ...state,
        token: action.token,
        email: action.email,
        msg: "",
      };
      return obj;

    case LOGOUT_USER:
      return initialState;

    case RECEIVE_ERROR:
      return {
        ...state,
        msg: action.msg,
      };

    case RESET_ERROR:
      return {
        ...state,
        msg: "",
      };

    case FETCH_LOCATIONS:
      return {
        ...state,
        warehouses: action.warehouses,
        zones: action.zones,
      };

    case GET_PREDICTION:
      return {
        ...state,
        index: action.index,
        warehouse: action.warehouse,
      };

    default:
      return state;
  }
}

export default reducer;
