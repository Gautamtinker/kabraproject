import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO
} from "../constants/cartConstant";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          )
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item]
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload)
      };

    case "CHANGE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map(i=> {
          if(i.product !== action.payload.id){
            return i;
          }

          return {
            ...i,
            quantity : action.payload.quantity
          }

        } )
      }

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload
      };

    default:
      return state;
  }
};
