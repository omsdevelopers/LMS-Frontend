import { takeLatest, call, put } from "redux-saga/effects";
import { everyLeads } from "../../helpers/api/api";
import { setEveryLeadCount, setEveryLeads } from "./actions";
import LeadsActionTypes from "./constants";

function* fetchEveryLeadCountSaga(action: {
  type: string;
  payload: { categories: any[]; date: any; tags:string[]  };
}): Generator<any, any> {
  try {
    const { categories, date, tags } = action.payload;

    const leadCountResponse: any = yield call(everyLeads, categories, date, tags);

    yield put(setEveryLeadCount(leadCountResponse.lead_count));
  } catch (error) {
    console.error("Error fetching lead:", error);
    yield put({ type: LeadsActionTypes.FETCH_LEAD_FAILURE, payload: error }); 
  } finally {
    yield put({ type: LeadsActionTypes.FETCH_LEAD_SUCCESS }); 
  }
}

function* fetchEveryLeadsSaga(action: {
  type: string;
  payload: { categories: any[]; date: any; tags:string[] };
}): Generator<any, any> {
  try {
    const { categories, date, tags } = action.payload;

    const leadReacords: any = yield call(everyLeads, categories, date,tags);

    yield put(setEveryLeadCount( leadReacords.lead_count));

    console.log('sa', leadReacords)

    yield put(setEveryLeads(leadReacords.leads));
  } catch (error) {
    console.error("Error fetching lead:", error);
    yield put({ type: LeadsActionTypes.FETCH_LEAD_FAILURE, payload: error }); 
  } finally {
    yield put({ type: LeadsActionTypes.FETCH_LEAD_SUCCESS });
  }
}

export function* watchFetchEveryLeadCount() {
  yield takeLatest(LeadsActionTypes.FETCH_EVERY_LEAD_COUNT, fetchEveryLeadCountSaga);
}

export function* watchFetchEveryLeads() {
  yield takeLatest(LeadsActionTypes.FETCHEVERY_LEAD, fetchEveryLeadsSaga);
}

export default watchFetchEveryLeadCount;
