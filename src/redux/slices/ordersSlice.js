import { createSlice } from "@reduxjs/toolkit";

/*
* Data Format
orders: {
	isLoading: bool,
	orders: [...{ orderObj }],
	programs: {...program: total(float)},
	programTotal: float,
	error: null || string
}

orderObj: {
	distributor: string,
  type: string,
  program: null || [...string(programIds)],
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

const getOrderNum = () => {
  //this would fetch current order number and increment it, produces random number currently
  return Math.floor(Math.random() * 10000 + 12300000000).toString();
};

let initialState = {
  isLoading: false,
  orders: [],
  programTotal: 0,
  error: null,
};

let shippingState = {
  handler: undefined,
  trackingNum: undefined,
  shippingStatus: undefined,
};

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
      const { orders } = action.payload;
      state.orders = [...orders];
      state.isLoading = false;
      state.error = null;
    },
    addNewOrder(state, action) {
      const {
        distributor,
        type,
        program,
        items,
        budget,
        totalItems,
        totalEstCost,
        status = "draft",
        shipping = shippingState,
      } = action.payload;
      const newOrder = {
        id: getOrderNum(),
        distributor: distributor,
        type: type,
        program: program,
        items: items,
        budget: budget,
        totalItems: totalItems,
        totalEstCost: totalEstCost,
        status: status,
        shipping: shipping,
      };
      let newOrders = state.orders.splice();
      newOrders.push(newOrder);
      state.orders = newOrders;
    },
    updateOrder(state, action) {
      const { orderId, items, budget, status, shipping } = action.payload;
      let currentOrder = state.orders.find((ord) => ord.id === orderId);
      let index = state.orders.indexOf(currentOrder);
      let ordersArray = state.orders.splice();
      let totalItems = 0;
      let totalEstCost = 0;

      items.forEach((i) => {
        totalItems += i.totalItems;
        totalEstCost += i.estTotal;
      });

      currentOrder.items = [...items];
      currentOrder.budget = budget;
      currentOrder.totalItems = totalItems;
      currentOrder.totalEstCost = totalEstCost;
      currentOrder.status = status;
      currentOrder.shipping = { ...shipping };

      ordersArray.splice(index, 1, currentOrder);

      state.orders = ordersArray;
    },
    updateOrders(state, action) {
      const { orders } = action.payload;

      const ordersArray = state.orders.map((ord, index) => {
        let totalItems = 0;
        let totalEstCost = 0;

        orders[index].items.forEach((i) => {
          totalItems += i.totalItems;
          totalEstCost += i.estTotal;
        });

        return {
          id: ord.id,
          distributor: ord.distributor,
          type: ord.type,
          program: ord.program,
          items: [...orders[index].items],
          budget: orders[index].budget,
          totalItems: totalItems,
          totalEstCost: totalEstCost,
          status: ord.status,
          shipping: { ...ord.shipping },
        };
      });

      state.orders = ordersArray;
    },
    removeOrder(state, action) {
      const { orderId } = action.payload;
      const ordersArray = state.orders.filter((order) => order.id !== orderId);

      state.orders = ordersArray;
    },
    setFailure: loadingFailed
  },
});

export const {
  setIsLoading,
  addNewOrder,
  updateOrder,
  updateOrders,
  removeOrder,
  setFailure,
} = ordersSlice.actions

export default ordersSlice.reducer
