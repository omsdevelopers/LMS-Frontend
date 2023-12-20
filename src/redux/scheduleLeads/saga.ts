import { takeLatest, call, put } from "redux-saga/effects";
import { scheduledLeads } from "../../helpers/api/api";
import { setScheduleLeadCount, setScheduleLeads } from "./actions";
import LeadsActionTypes from "./constants";

function* fetchLeadCountSaga(action: {
  type: string;
  payload: { categories: any[]; date: any };
}): Generator<any, any> {
  try {
    const { categories, date } = action.payload;

    const leadCountResponse:any = yield call(scheduledLeads, categories, date);

    yield put(setScheduleLeadCount(leadCountResponse.sheduleddatecount));
  } catch (error) {
    console.error("Error fetching lead:", error);
    yield put({ type: LeadsActionTypes.FETCH_LEAD_FAILURE, payload: error }); 
  } finally {
    yield put({ type: LeadsActionTypes.FETCH_LEAD_SUCCESS }); 
  }
}

function* fetchLeadsSaga(action: {
  type: string;
  payload: { categories: any[]; date: any };
}): Generator<any, any> {
  try {
    const { categories, date } = action.payload;

    const leadReacords: any = yield call(scheduledLeads, categories, date);

    yield put(setScheduleLeads(leadReacords.sheduleduser));
  } catch (error) {
    console.error("Error fetching lead:", error);
    yield put({ type: LeadsActionTypes.FETCH_LEAD_FAILURE, payload: error }); 
  } finally {
    yield put({ type: LeadsActionTypes.FETCH_LEAD_SUCCESS });
  }
}

export function* watchFetchScheduleLeadCount() {
  yield takeLatest(LeadsActionTypes.FETCH_SCHEDULE_LEAD_COUNT, fetchLeadCountSaga);
}

export function* watchScheduleFetchLeads() {
  yield takeLatest(LeadsActionTypes.FETCH_SCHEDULE_LEAD, fetchLeadsSaga);
}

