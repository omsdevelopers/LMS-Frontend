import { LeadsActionTypes } from "./constants";

export const setLeadCount = (leadCount: any) => ({
  type: LeadsActionTypes.SET_LEAD_COUNT,
  payload: leadCount,
});

export const fetchLeadCount = (categories?: any[], date?: any, tags?: string[]) => ({
  type: LeadsActionTypes.FETCH_LEAD_COUNT,
  payload: { categories, date, tags },
});



export const setLeads = (leads: any) => ({
  type: LeadsActionTypes.SET_LEAD,
  payload: leads,
});

export const fetchLeads = (categories?: any[], date?: any,  tags?: string[]) => ({
  type: LeadsActionTypes.FETCH_LEAD,
  payload: { categories, date, tags },
});


export const fetchLeadSuccess = () => ({
  type: LeadsActionTypes.FETCH_LEAD_SUCCESS,
});

export const fetchLeadFailure = (error: any) => ({
  type: LeadsActionTypes.FETCH_LEAD_FAILURE,
  payload: error,
});