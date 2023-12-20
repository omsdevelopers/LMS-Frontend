import { LeadsActionTypes } from "./constants";

const initialState = {
  leads: [],
  leadsCount: 0,
  loading: false,
  error: null,
};

const leadsReducer = (
  state = initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case LeadsActionTypes.SET_LEAD_COUNT:
      return {
        ...state,
        leadsCount: action.payload,
      };

    case LeadsActionTypes.FETCH_LEAD_COUNT:
      return {
        ...state,
        loading: true,
      };

    case LeadsActionTypes.SET_LEAD:
      return {
        ...state,
        leads: action.payload,
      };

    case LeadsActionTypes.FETCH_LEAD:
      return {
        ...state,
        loading: true,
      };

    case LeadsActionTypes.FETCH_LEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null, // Reset error state on successful lead fetch
      };

    case LeadsActionTypes.FETCH_LEAD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default leadsReducer;
