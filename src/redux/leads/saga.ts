import { takeLatest, call, put } from "redux-saga/effects";
import { leadCount, listLeads } from "../../helpers/api/api";
import { setLeadCount, setLeads } from "./actions";
import LeadsActionTypes from "./constants";

function* fetchLeadCountSaga(action: {
  type: string;
  payload: { categories: any[]; date: any; tags:string[]  };
}): Generator<any, any> {
  try {
    const { categories, date, tags } = action.payload;

    const leadCountResponse = yield call(leadCount, categories, date, tags);

    yield put(setLeadCount(leadCountResponse));
  } catch (error) {
    console.error("Error fetching lead:", error);
    yield put({ type: LeadsActionTypes.FETCH_LEAD_FAILURE, payload: error }); 
  } finally {
    yield put({ type: LeadsActionTypes.FETCH_LEAD_SUCCESS }); 
  }
}

function* fetchLeadsSaga(action: {
  type: string;
  payload: { categories: any[]; date: any; tags:string[] };
}): Generator<any, any> {
  try {
    const { categories, date, tags } = action.payload;

    const leadReacords: any = yield call(listLeads, categories, date,tags);

    yield put(setLeads(leadReacords.leads));
  } catch (error) {
    console.error("Error fetching lead:", error);
    yield put({ type: LeadsActionTypes.FETCH_LEAD_FAILURE, payload: error }); 
  } finally {
    yield put({ type: LeadsActionTypes.FETCH_LEAD_SUCCESS });
  }
}

export function* watchFetchLeadCount() {
  yield takeLatest(LeadsActionTypes.FETCH_LEAD_COUNT, fetchLeadCountSaga);
}

export function* watchFetchLeads() {
  yield takeLatest(LeadsActionTypes.FETCH_LEAD, fetchLeadsSaga);
}

export default watchFetchLeadCount;
