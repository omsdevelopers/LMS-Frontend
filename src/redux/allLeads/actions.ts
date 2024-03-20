import { LeadsActionTypes } from "./constants";

export const setEveryLeadCount = (leadCount: any) => ({
  type: LeadsActionTypes.SET_EVERY_LEAD_COUNT,
  payload: leadCount,
});

export const fetchEveryLeadCount = (categories?: any[], date?: any, tags?: string[]) => ({
  type: LeadsActionTypes.FETCH_EVERY_LEAD_COUNT,
  payload: { categories, date, tags },
});



export const setEveryLeads = (leads: any) => ({
  type: LeadsActionTypes.SET_LEAD,
  payload: leads,
});

export const fetchEveryLeads = (categories?: any[], date?: any,  tags?: string[]) => ({
  type: LeadsActionTypes.FETCHEVERY_LEAD,
  payload: { categories, date, tags },
});


export const fetchEveryLeadSuccess = () => ({
  type: LeadsActionTypes.FETCH_LEAD_SUCCESS,
});

export const fetchEveryLeadFailure = (error: any) => ({
  type: LeadsActionTypes.FETCH_LEAD_FAILURE,
  payload: error,
});