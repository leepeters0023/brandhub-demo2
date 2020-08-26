import { createSlice } from "@reduxjs/toolkit";

/*
* Data Format:
inStockOrder: {
  isLoading: bool,
  orderNumber: string,
  distributor: string,
  type: string
  program: null || [...string(programIds)],
  status: string,
  items: [... {itemObj} sorted by itemNumber],
  shipping: { shippingObj },
  budget: string,
  totalItems: int,
  totalCost: float,
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
*/

let initialState = {
  isLoading: false,
  orderNumber: null,
  distributorId: null,
  distributorName: null,
  type: null,
  program: null,
  status: null,
  items: [],
  shipping: {},
  budget: null,
  totalItems: 0,
  totalCost: 0,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const onDemandOrderSlice = createSlice({
  name: "onDemandOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getCurrentOnDemandOrderSuccess(state, action) {
      const {
        orderNumber,
        distributorId,
        distributorName,
        type,
        program,
        status,
        items,
        shipping,
        budget,
        totalItems,
        totalCost,
      } = action.payload;
      state.isLoading = false;
      state.orderNumber = orderNumber;
      state.distributorId = distributorId;
      state.distributorName = distributorName;
      state.type = type;
      state.program = program ? [ ...program] : null;
      state.status = status;
      state.items = [...items];
      state.shipping = {...shipping};
      state.budget = budget;
      state.totalItems = totalItems;
      state.totalCost = totalCost;
      state.error = null;
    },
    addOnDemandItem(state, action) {
      const { item } = action.payload;
      let items = [...state.items];
      items.push(item);
      state.items = items;
      state.totalItems += item.totalItems;
      state.totalCost += item.estTotal;
    },
    updateOnDemandOrder(state, action) {
      const { item, totalItems } = action.payload;
      let items = [...state.items];
      let currentItem = items.find((i) => i.itemNumber === item.itemNumber);
      let tempOrderTotalItems = state.totalItems - currentItem.totalItems;
      let tempOrderTotalCost = state.totalCost - currentItem.estTotal;
      currentItem.totalItems = totalItems;
      tempOrderTotalItems += totalItems;
      currentItem.estTotal = totalItems * currentItem.price;
      tempOrderTotalCost += totalItems * currentItem.price;
      items.splice(items.indexOf(currentItem), 1, currentItem)
      state.items = items;
      state.totalItems = tempOrderTotalItems;
      state.totalCost = tempOrderTotalCost;
    },
    removeOnDemandItem(state, action) {
      const { item } = action.payload;
      let items = [...state.items];
      let currentItem = items.find((i) => i.itemNumber === item.itemNumber);
      state.totalItems -= currentItem.totalItems;
      state.totalCost -= currentItem.estTotal;
      state.items = items.filter((i) => i.itemNumber !== item.itemNumber)
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getCurrentOnDemandOrderSuccess,
  addOnDemandItem,
  updateOnDemandOrder,
  removeOnDemandItem,
  setFailure,
} = onDemandOrderSlice.actions;

export default onDemandOrderSlice.reducer;

//async thunks for fetching orders and updating orders here!
