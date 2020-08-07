import { createSlice } from "@reduxjs/toolkit";

/*
programId: {
  items: {},
  cartDetails: {
    total: 0,
    budget: ""
  }
}
*/

let initialState = {
  programs: {},
  distributors: [],
  details: {
    total: 0,
    budgets: {},
  },
};

const programCartSlice = createSlice({
  name: "programCart",
  initialState,
  reducers: {
    setCart(state, action) {
      state = { ...action.payload.cart };
    },
    setInitialCart(state, action) {
      const { programs, distributors } = action.payload;
      let initialPrograms = {};
      let initialDistributors = [];
      programs.forEach(
        (prog) =>
          (initialPrograms[`${prog.id}`] = {
            details: {
              id: prog.id,
              name: prog.name,
              brand: prog.brand,
              unit: prog.unit,
              desc: prog.desc,
              goals: prog.goals,
              strategies: prog.strategies,
              focusMonth: prog.focusMonth,
              imgUrl: prog.imgUrl
            },
            items: {},
            cartDetails: { total: 0, budget: "" },
          })
      );
      distributors.forEach((dist) => initialDistributors.push(dist.name));
      state.programs = { ...initialPrograms };
      state.distributors = initialDistributors;
    },
    addItem(state, action) {
      const { program, item } = action.payload;
      let distributorValues = {};
      state.distributors.forEach((dist) => (distributorValues[dist.name] = 0));
      let newItem = {
        itemDetails: {
          itemNumber: item.itemNumber,
          brand: item.brand,
          itemType: item.itemType,
          price: item.price,
          qty: item.qty,
          imgUrl: item.imgUrl,
          totalItems: 0,
          estTotal: 0,
        },
        distributors: { ...distributorValues },
      };
      state[`${program}`].items[`${item.itemNumber}`] = newItem;
    },
    addItems(state, action) {
      const { program, items } = action.payload;
      let distributorValues = {};
      state.distributors.forEach((dist) => (distributorValues[dist.name] = 0));
      items.forEach((item) => {
        state[`${program}`].items[`${item.itemNumber}`] = {
          itemDetails: {
            itemNumber: item.itemNumber,
            brand: item.brand,
            itemType: item.itemType,
            price: item.price,
            qty: item.qty,
            imgUrl: item.imgUrl,
            totalItems: 0,
            estTotal: 0,
          },
          distributors: { ...distributorValues },
        };
      });
    },
    setGridItem(state, action) {
      const { program, itemNumber, distributor, value } = action.payload;
      state[`${program}`].items[`${itemNumber}`].distributors[
        `${distributor}`
      ] = value;
    },
    setItemTotal(state, action) {
      const { program, itemNumber } = action.payload;
      let total = 0;
      for (let dist in state[`${program}`].items[`${itemNumber}`]
        .distributors) {
        total +=
          parseInt(
            state[`${program}`].items[`${itemNumber}`].distributors[dist]
          ) || 0;
      }
      let totalCost = total * state.items[`${itemNumber}`].itemDetails.price;
      state[`${program}`].items[`${itemNumber}`].itemDetails.totalItems = total;
      state[`${program}`].items[
        `${itemNumber}`
      ].itemDetails.estTotal = totalCost;
    },
    removeGridItem(state, action) {
      const { program, itemNum } = action.payload;
      delete state[`${program}`].items[`${itemNum}`];
    },
  },
});

export const {
  setCart,
  setInitialCart,
  addItem,
  addItems,
  setGridItem,
  setItemTotal,
  removeGridItem,
} = programCartSlice.actions;

export default programCartSlice.reducer;
