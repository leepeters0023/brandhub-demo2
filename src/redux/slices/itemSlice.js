import { createSlice } from "@reduxjs/toolkit";
import { fetchItems } from "../../api/itemApi";

/*
* Item Model
notes: Items still in flux, will update when format is nailed down

*/

let initialState = {
  isLoading: false,
  orderType: null,
  itemsPerPage: 20,
  totalPages: null,
  pagesLoaded: 0,
  nextLink: null,
  items: [],
  selectedItems: [],
  error: null,
};

const typeMap = {
  "in-stock": "inStock",
  "on-demand": "onDemand",
  "pre-order": "pre-order",
  "all": "allItems",
}

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
      state.orderType = orderType;
      state.pagesLoaded += 1;
      state.nextLink = nextLink;
      state.items = [...items];
      state.isLoading = false;
      state.error = null;
    },
    getNextItemsSuccess(state, action) {
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
    updateItemSelection(state, action) {
      const { selectedItems } = action.payload;
      state.selectedItems = selectedItems;
    },
    clearItemSelection(state) {
      state.selectedItems = [];
    },
    resetItems(state) {
      state.isLoading = false;
      state.orderType = null;
      state.itemsPerPage = 20;
      state.totalPages = null;
      state.pageLoaded = 0;
      state.nextLink = null;
      state.items = [];
      state.selectedItems = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setTotalPages,
  getItemsSuccess,
  updateItemSelection,
  clearItemSelection,
  resetItems,
  setFailure,
} = itemSlice.actions;

export default itemSlice.reducer;

export const fetchFilteredItems = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const items = await fetchItems(filterObject);
    console.log(items);
    if (items.error) {
      throw items.error;
    }
    let newItems = items.data.map((item) => ({
      id: item.id,
      itemNumber: item["item-number"],
      brand: item.brands.map((brand) => brand.name).join(", "),
      program: item.programs ? item.programs.map((prog) => prog.name).join(", ") : "---",
      itemType: item.type,
      estCost: item["estimated-cost"],
      packSize: item["qty-per-pack"],
      stock: Math.floor(Math.random() * 25 + 26),
      imgUrl: item["img-url"],
    }));
    dispatch(
      getItemsSuccess({
        orderType: typeMap[filterObject.orderType],
        items: newItems,
        nextLink: "NEXT LINK HERE",
      })
    );
  } catch (err) {
    dispatch(setFailure({error: err.toString()}));
  }
};
