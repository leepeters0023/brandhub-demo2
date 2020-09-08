import { createSlice } from "@reduxjs/toolkit";
 
/*
* Data Format:
orders: {
	isLoading: bool,
	orders: [...{ orderObj }],
	programs: {...program: total(float)},
	programTotal: float,
	error: null || string
}

orderObj: {
	distributorId: string,
  type: string,
  program: null || [...{id: total}],
	status: string,
	items: [...{ itemObj }],
	shipping: { shippingObj },
	budget: “string”,
	totalItems: int,
	totalEstCost: float,
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
  id: null,
  orderNumber: null,
  distributorName: null,
  distributorId: null,
  type: null,
	status: null,
	items: [],
	shipping: {},
	budget: null,
	totalItems: 0,
	totalEstCost: 0,
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

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getOrdersSuccess(state, action) {
      const { order, items } = action.payload;
      state.id = order.id;
      state.orderNumber = order.orderNumber;
      state.distributorName = order.distributorName;
      state.distributorId = order.distributorId;
      state.type = order.type;
      state.status = order.status;
      state.items = [...items];
      state.shipping = {...order.shipping}
      state.budget = order.budget;
      state.totalItems = order.totalItems;
      state.totalEstCost = order.totalEstCost;
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed
  },
});

export const {
  setIsLoading,
  getOrdersSuccess,
  setFailure,
} = ordersSlice.actions

export default ordersSlice.reducer

