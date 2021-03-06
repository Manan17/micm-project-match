import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { request, action } from 'Src/utils';
import { FORGOT_PASSWORD, SNACKBAR } from 'Src/constants/actionTypes';

function* forgotPasswordSubmit({ payload }) {
  if (
    !payload.email ||
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(payload.email)
  ) {
    yield put(action(SNACKBAR.DANGER, 'Invalid email'));
    yield delay(3000);
    yield put(action(SNACKBAR.CLEAR));
    return;
  } else if (!payload.captchaResponse) {
    yield put(action(SNACKBAR.DANGER, 'Please fill the captcha'));
  }
  const data = yield call(request, '/forgot-password', payload);
  if (data.success) yield put(action(FORGOT_PASSWORD.RECEIVE, data.data));
  else yield put(action(SNACKBAR.DANGER, data.message));
  yield delay(3000);
  yield put(action(SNACKBAR.CLEAR));
}

function* forgotPasswordFormSaga() {
  yield takeLatest(FORGOT_PASSWORD.REQUEST, forgotPasswordSubmit);
}

export default forgotPasswordFormSaga;
