import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import leadsReducer from './leads/reducers';
import leadsScheduleReducer from './scheduleLeads/reducers';

export default combineReducers({
    Auth,
    Layout,
    leadsReducer,
    leadsScheduleReducer
});
