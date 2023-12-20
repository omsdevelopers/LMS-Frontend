import { all } from "redux-saga/effects";

import authSaga from "./auth/saga";
import layoutSaga from "./layout/saga";
import { watchFetchLeads, watchFetchLeadCount } from "./leads/saga";
import {
  watchFetchScheduleLeadCount,
  watchScheduleFetchLeads,
} from "./scheduleLeads/saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    layoutSaga(),
    watchFetchLeadCount(),
    watchFetchLeads(),
    watchFetchScheduleLeadCount(),
    watchScheduleFetchLeads()
  ]);
}
