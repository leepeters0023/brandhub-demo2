import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  items: {},
  cartDetails: {
    total: 0,
    budget: ""
  }
};

const programCartSlice = createSlice({
  name: "programCart",
  initialState,
  reducers: {
    setGridItems(state, action) {
      const { items, distributors } = action.payload;
      let distributorValues = {};
      distributors.forEach((dist) => (distributorValues[dist.name] = 0));
      items.forEach((item) => {
        state.items[`${item.itemNumber}`] = { 
          itemDetails: {
            itemNumber: item.itemNumber,
            brand: item.brand,
            itemType: item.itemType,
            price: item.price,
            qty: item.qty,
            imgUrl: item.imgUrl,
            totalItems: 0,
            estTotal: 0
          },
          distributors: {...distributorValues},
         };
      });
    },
    setGridItem(state, action) {
      const { itemNumber, distributor, value } = action.payload;
      state.items[`${itemNumber}`].distributors[`${distributor}`] = value;
    },
    setItemTotal(state, action) {
      const { itemNumber } = action.payload
      let total = 0;
      for (let dist in state.items[`${itemNumber}`].distributors) {
        total += parseInt(state.items[`${itemNumber}`].distributors[dist]) || 0
      }
      let totalCost = total * state.items[`${itemNumber}`].itemDetails.price
      state.items[`${itemNumber}`].itemDetails.totalItems = total
      state.items[`${itemNumber}`].itemDetails.estTotal = totalCost
    },
    removeGridItem(state, action) {
      const { itemNum } = action.payload;
      delete state.items[`${itemNum}`];
    },
  },
});

export const { setGridItems, setGridItem, setItemTotal, removeGridItem } = programCartSlice.actions;

export default programCartSlice.reducer;
