import { createSlice } from "@reduxjs/toolkit";
import { fetchItems } from "../../api/itemApi";

let initialState = {
  isLoading: false,
  orderType: null,
  itemsPerPage: 20,
  totalPages: null,
  pagesLoaded: 0,
  nextLink: null,
  items: [],
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

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setTotalPages(state, action) {
      const { pageCount } = action.payload;
      state.totalPages = pageCount;
    },
    getItemsSuccess(state, action) {
      const { orderType, items, nextLink } = action.payload;
      let currentItems = [...state.items];
      let updatedItems = currentItems.concat(items);
      state.orderType = orderType;
      state.pagesLoaded += 1;
      state.nextLink = nextLink;
      state.items = updatedItems;
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setTotalPages,
  getItemsSuccess,
  setFailure,
} = itemSlice.actions;

export default itemSlice.reducer;

export const fetchFilteredItems = (orderType) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const items = await fetchItems();
    if (items.error) {
      throw items.error
    }
    let newItems = items.data.map((item) => ({
      id: item.id,
      itemNumber: item["item-number"],
      brand: item.brand.name,
      itemType: item.name,
      price: item.cost,
      qty: `${item["qty-per-pack"]} / Pack`,
      stock: Math.floor(Math.random()*25 + 26),
      imgUrl: item["img-url"],
    }));
    dispatch(
      getItemsSuccess({
        orderType: orderType,
        items: newItems,
        nextLink: "NEXT LINK HERE",
      })
    );
  } catch (err) {
    dispatch(setFailure(err.toString()));
  }
};
