import { all } from 'redux-saga/effects';
import { watchGeneralRequest } from './general';
export default function* rootSaga() {
  yield all([watchGeneralRequest()]);
}
