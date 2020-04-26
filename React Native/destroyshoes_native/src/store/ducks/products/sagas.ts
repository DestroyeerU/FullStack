import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import { Alert } from 'react-native';
import {
  addToCartRequest,
  addToCartSuccess,
  updateAmountRequest,
  updateAmountSuccess,
} from './actions';
import { ADD_TO_CART_REQUEST, UPDATE_AMOUNT_REQUEST, Product } from './types';
import { formatPrice } from '~/utils/format';
import { ApplicationState } from '~/store';
import api from '~/services/api';
import { StockApi } from '~/services/api/types';

interface ApiResponse {
  data: StockApi;
}

function* addToCart({ payload }: ReturnType<typeof addToCartRequest>) {
  const { products }: ApplicationState = yield select();
  const productState = products.data.find((p) => p.id === payload.id);

  if (productState) {
    yield put(updateAmountRequest({ id: payload.id, amount: 1 }));
  } else {
    const product = {
      ...payload,
      amount: 1,
      subtotal: payload.price,
      subtotalFormatted: formatPrice(payload.price),
    };

    yield put(addToCartSuccess(product));
  }
}

function* updateAmount({ payload }: ReturnType<typeof updateAmountRequest>) {
  const { products }: ApplicationState = yield select();
  const productState = products.data.find((p) => p.id === payload.id);

  const { data }: ApiResponse = yield call(api.get, `stock/${payload.id}`);

  if (productState) {
    const amount = productState.amount + payload.amount;

    if (data.amount >= amount) {
      yield put(updateAmountSuccess({ id: payload.id, amount }));
    } else {
      Alert.alert('Quantidade solicitada fora do estoque.');
    }
  }
}

export default all([
  takeLatest(ADD_TO_CART_REQUEST, addToCart),
  takeLatest(UPDATE_AMOUNT_REQUEST, updateAmount),
]);
