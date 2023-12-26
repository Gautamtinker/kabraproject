import { createStore, combineReducers, applyMiddleware, compose } from "redux";

import thunk from "redux-thunk";

import { composeWithDevTools } from "@redux-devtools/extension";
import {
  productDetailsReducer,
  productReducer
} from "./reducer/productReducer";

import {
  userReducer,
  allUsersReducer,
  userDetailsReducer,
  profileReducer
} from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import {
  newOrderReducer,
  myOrdersReducer,
  orderDetailsReducer
} from "./reducer/orderReducer";

import { newProductReducer, productsReducer } from "./reducer/productReducer";
import { allOrdersReducer, orderReducer } from "./reducer/orderReducer";

const reducer = combineReducers({
  product: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  products: productsReducer,
  newProduct: newProductReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer
});

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {}
  }
};

const midilware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...midilware))
);

export default store;
