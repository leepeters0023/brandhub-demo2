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
  orders: [],
  activePrograms: [],
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
    setActivePrograms(state, action) {
      const { programs } = action.payload;
      let programList = programs.map(prog => ({[`${prog.id}`]: 0}))
      state.activePrograms = [...programList]
    },
    addNewOrder(state, action) {
      const {
        id,
        distributorId,
        distributorName,
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
        id: id,
        distributorId: distributorId,
        distributorName: distributorName,
        type: type,
        program: program,
        items: items,
        budget: budget,
        totalItems: totalItems,
        totalEstCost: totalEstCost,
        status: status,
        shipping: shipping,
      };
      let newOrders = [...state.orders];
      newOrders.push(newOrder);
      state.orders = newOrders;
    },
    updateOrder(state, action) {
      const { orderId, items, budget, totalItems, totalEstCost, status } = action.payload;
      let currentOrder = state.orders.find((ord) => ord.id === orderId);
      let index = state.orders.indexOf(currentOrder);
      let ordersArray = [...state.orders]

      currentOrder.items = [...items];
      currentOrder.budget = budget;
      currentOrder.totalItems = totalItems;
      currentOrder.totalEstCost = totalEstCost;
      currentOrder.status = status;

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
          distributorId: ord.distributorId,
          distributorName: ord.distributorName,
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
    removeProgramOrders(state,action) {
      const { program } = action.payload;
      const currentOrders = state.orders.map(order => ({...order}))
      const programsArray = currentOrders.filter((order) => order.type==="program")
      const otherOrdersArray = currentOrders.filter((order) => order.type !== "program")
      const filteredProgramOrders = programsArray.filter((order) => order.program.id !== program)
      state.orders = otherOrdersArray.concat(filteredProgramOrders)
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
  setActivePrograms,
  addNewOrder,
  updateOrder,
  updateOrders,
  removeProgramOrders,
  removeOrder,
  setFailure,
} = ordersSlice.actions

export default ordersSlice.reducer
