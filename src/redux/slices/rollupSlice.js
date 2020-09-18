import { createSlice } from "@reduxjs/toolkit";
import { buildTableFromOrders } from "./programTableSlice";
import { fetchAllPreOrders, fetchNextPreOrders, fetchPreOrderById } from "../../api/orderApi";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  nextLink: null,
  preOrders: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startNextLoading = (state) => {
  state.isNextLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const rollupSlice = createSlice({
  name: "rollup",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getPreOrdersSuccess(state, action) {
      const { preOrders, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.preOrders = [...preOrders];
      state.isLoading = false;
      state.error = null;
    },
    getNextPreOrdersSuccess(state, action) {
      const { preOrders, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.preOrders = state.preOrders.concat(preOrders);
      state.isNextLoading = false;
      state.error = null;
    },
    resetPreOrderRollup(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.nextLink = null;
      state.preOrders = [];
      state.error = null;
    },
    getPreOrderDetailSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getPreOrdersSuccess,
  getNextPreOrdersSuccess,
  resetPreOrderRollup,
  getPreOrderDetailSuccess,
  setFailure,
} = rollupSlice.actions;

export default rollupSlice.reducer;
//TODO switch to fetchAllFilteredPreOrders
export const fetchFilteredPreOrders = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let preOrders = await fetchAllPreOrders();
    if (preOrders.error) {
      throw preOrders.error;
    }
    let mappedPreOrders = preOrders.data.preOrders.map((preOrder) => ({
      id: preOrder.id,
      user: preOrder.user.name,
      program: preOrder.program.name,
      state: preOrder["random-order-state"],
      totalItems: preOrder["total-quantity"],
      totalOrders: preOrder["order-count"],
      totalEstCost: preOrder["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: preOrder["submission-date"]
        ? preOrder["submission-date"]
        : "---",
      dueDate: preOrder["due-date"],
    }));
    dispatch(
      getPreOrdersSuccess({
        preOrders: mappedPreOrders,
        nextLink: preOrders.data.nextLink ? preOrders.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredPreOrders = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    let preOrders = await fetchNextPreOrders(url);
    if (preOrders.error) {
      throw preOrders.error;
    }
    let mappedPreOrders = preOrders.data.preOrders.map((preOrder) => ({
      id: preOrder.id,
      user: preOrder.user.name,
      program: preOrder.program.name,
      state: preOrder["random-order-state"],
      totalItems: preOrder["total-quantity"],
      totalOrders: preOrder["order-count"],
      totalEstCost: preOrder["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: preOrder["submission-date"]
        ? preOrder["submission-date"]
        : "---",
      dueDate: preOrder["due-date"],
    }));
    dispatch(
      getNextPreOrdersSuccess({
        preOrders: mappedPreOrders,
        nextLink: preOrders.data.nextLink ? preOrders.data.nextLink : null
      })
    )
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

export const fetchRollupProgram = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const currentOrders = await fetchPreOrderById(id);
    if (currentOrders.error) {
      throw currentOrders.error;
    }
    let currentItems = currentOrders.data["pre-order-items"].map((item) => ({
      id: item.id,
      complianceStatus: item.item["compliance-status"],
      itemNumber: item.item["item-number"],
      brand: item.item.brand.name,
      itemType: item.item.type,
      price: item.item.cost,
      qty: `${item.item["qty-per-pack"]} / pack`,
      imgUrl: item.item["img-url"],
      estTotal: 0,
      totalItems: 0,
    }));

    currentItems.sort((a, b) => {
      return parseInt(a.itemNumber) < parseInt(b.itemNumber)
        ? -1
        : parseInt(a.itemNumber) > parseInt(b.itemNumber)
        ? 1
        : 0;
    });

    let orders = currentOrders.data.orders.map((ord) => ({
      orderNumber: ord.id,
      distributorId: ord.distributor.id,
      distributorName: ord.distributor.name,
      distributorCity: ord.distributor.city,
      distributorState: ord.distributor.state,
      note: ord.notes ? ord.notes : "",
      attn: ord.attn ? ord.attn : "",
      type: "program",
      program: ord.program.id,
      items: ord["order-items"]
        .map((item) => ({
          id: item.id,
          complianceStatus: item.item["compliance-status"],
          itemNumber: item.item["item-number"],
          itemType: item.item.type,
          price: item.item.cost,
          estTotal: item.qty * item.item.cost,
          totalItems: item.qty,
        }))
        .sort((a, b) => {
          return parseInt(a.itemNumber) < parseInt(b.itemNumber)
            ? -1
            : parseInt(a.itemNumber) > parseInt(b.itemNumber)
            ? 1
            : 0;
        }),
      totalItems: ord["order-items"]
        .map((item) => item.qty)
        .reduce((a, b) => a + b),
      estTotal: ord["order-items"]
        .map((item) => item.qty * item.item.cost)
        .reduce((a, b) => a + b),
    }));

    orders.sort((a, b) => {
      return a.distributorName < b.distributorName
        ? -1
        : a.distributorName > b.distributorName
        ? 1
        : 0;
    });

    let preOrderId = currentOrders.data.id;
    let preOrderStatus = currentOrders.data.status;
    let territories =
      currentOrders.data["territory-names"].length === 0
        ? ["National"]
        : currentOrders.data["territory-names"].split(", ");
    let note = currentOrders.data.notes ? currentOrders.data.notes : ""

    dispatch(
      buildTableFromOrders({
        programId: null,
        orders: orders,
        items: currentItems,
        preOrderId: preOrderId,
        status: preOrderStatus,
        territories: territories,
        note: note
      })
    );
    dispatch(getPreOrderDetailSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
