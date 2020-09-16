import { createSlice } from "@reduxjs/toolkit";
import { fetchOrderHistory } from "../../api/orderApi";

/*
* Data Format:
orders: {
  isLoading: bool,
  id: string,
  orderNumber: string,
  distributorName: string,
	distributorId: string,
  type: string,
	status: string,
	items: [...{ itemObj }],
	shipping: { shippingObj },
	budget: “string”,
	totalItems: int,
	totalEstCost: float,
	error: null || string
}

itemObj: {
	itemNumber: string,
	brand: string,
	itemType: string,
	price: float,
	qty: string,
	imgUrl: string,
  complianceStatus: string,
  totalItems: int,
  estTotal: float,
}

shippingObj: {
  handler: string,
  trackingNum: string,
  shippingStatus: string
}	
*/

let initialState = {
  isLoading: false,
  ordersPerPage: 20,
  nextPage: null,
  nextLink: null,
  orders: [],
  singleOrder: {
    id: null,
    orderNumber: null,
    distributorName: null,
    distributorId: null,
    type: null,
    status: null,
    shipping: {},
    budget: null,
    totalItems: 0,
    totalEstCost: 0,
  },
  error: null,
};

// let shippingState = {
//   handler: undefined,
//   trackingNum: undefined,
//   shippingStatus: undefined,
// };

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const orderHistorySlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getSingleOrderSuccess(state, action) {
      const { order, items } = action.payload;
      state.singleOrder.id = order.id;
      state.singleOrder.orderNumber = order.orderNumber;
      state.singleOrder.distributorName = order.distributorName;
      state.singleOrder.distributorId = order.distributorId;
      state.singleOrder.type = order.type;
      state.singleOrder.status = order.status;
      state.singleOrder.items = [...items];
      state.singleOrder.shipping = { ...order.shipping };
      state.singleOrder.budget = order.budget;
      state.singleOrder.totalItems = order.totalItems;
      state.singleOrder.totalEstCost = order.totalEstCost;
      state.isLoading = false;
      state.error = null;
    },
    getOrderHistorySuccess(state, action) {
      const { orders, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.orders = [...orders];
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getSingleOrderSuccess,
  getOrderHistorySuccess,
  setFailure,
} = orderHistorySlice.actions;

export default orderHistorySlice.reducer;

export const fetchFilteredOrderHistory = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let orders = await fetchOrderHistory(filterObject);
    if (orders.error) {
      throw orders.error
    }
    console.log(orders);
    let mappedOrders = orders.data.orders.map((order) => ({
      orderNum: order.id,
      distributor: order.distributor.name,
      state: order.distributor.state,
      program: order.program.name,
      orderDate: order["order-date"] ? order["order-date"] : "---",
      shipDate: order["ship-date"] ? order["ship-date"] : "---",
      trackingNum: order["tracking-number"] ? order["tracking-number"] : "---",
      totalItems: order["total-quantity"],
      estTotal: order["total-cost"],
      actTotal: "---",
      orderStatus: order.status === "submitted" ? "Pending" : order.status
    }))
    dispatch(getOrderHistorySuccess({orders: mappedOrders, nextLink: orders.data.nextLink ? orders.data.nextLink : null}))
  } catch (err) {
    dispatch(setFailure({error: err.toString()}))
  }
}
