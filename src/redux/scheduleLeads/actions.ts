import { LeadsActionTypes } from "./constants";

export const setScheduleLeadCount = (leadCount: any) => ({
  type: LeadsActionTypes.SET_SCHEDULE_LEAD_COUNT,
  payload: leadCount,
});

export const fetchScheduleLeadCount = (categories?: any[], date?: any) => ({
  type: LeadsActionTypes.FETCH_SCHEDULE_LEAD_COUNT,
  payload: { categories, date },
});



export const setScheduleLeads = (leads: any) => ({
  type: LeadsActionTypes.SET_SCHEDULE_LEAD,
  payload: leads,
});

export const fetchScheduleLeads = (categories?: any[], date?: any) => ({
  type: LeadsActionTypes.FETCH_SCHEDULE_LEAD,
  payload: { categories, date },
});


export const fetchScheduleLeadSuccess = () => ({
  type: LeadsActionTypes.FETCH_LEAD_SUCCESS,
});

export const fetchScheduleLeadFailure = (error: any) => ({
  type: LeadsActionTypes.FETCH_LEAD_FAILURE,
  payload: error,
});