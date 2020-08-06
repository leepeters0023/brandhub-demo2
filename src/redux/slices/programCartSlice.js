import { createSlice } from "@reduxjs/toolkit";

let initialState = {};

const programCartSlice = createSlice({
  name: "programCart",
  initialState,
  reducers: {
    setGridItems(state, action) {
      const { items, distributors } = action.payload;
      let distributorValues = {};
      distributors.forEach((dist) => (distributorValues[dist.name] = 0));
      items.forEach((item) => {
        state[`${item.itemNumber}`] = { ...distributorValues };
      });
    },
    setGridItem(state, action) {
      const { itemNumber, distributor, value } = action.payload;
      state[`${itemNumber}`][`${distributor}`] = value;
    },
    removeGridItem(state, action) {
      const { itemNum } = action.payload;
      const { [`${itemNum}`]: value, ...rest} = state;
      console.log(rest)
      return rest
    },
  },
});

export const { setGridItems, setGridItem, removeGridItem } = programCartSlice.actions;

export default programCartSlice.reducer;
