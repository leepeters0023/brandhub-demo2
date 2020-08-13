import { createSlice } from "@reduxjs/toolkit";

/*
state: {
  programs: {
    programId: {
      items: { 
        itemNumber: {
          itemDetails: {
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
          distributors: {
            distributor: {
              orderNum: string || undefined(when being created)
              value: int,
            }
          }
        }
      },
      programDetails: {
        total: float,
        budget: string
      }
    }
  },
  distributors: [...distributor list, strings],
  details: {
    total: *total cart cost all programs, float,
    budgets: { *amount allocated to each budget, key(budget): value(float) }
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

const programTableSlice = createSlice({
  name: "programTable",
  initialState,
  reducers: {
    setTableData(state, action) {
      const { tableData } = action.payload;
      const currentPrograms = { ...tableData.programs };
      const currentDist = [...tableData.distributors];
      const currentDetails = { ...tableData.details };
      state.programs = currentPrograms;
      state.distributors = currentDist;
      state.details = currentDetails;
    },
    setInitialTableData(state, action) {
      const { programs, distributors } = action.payload;
      let initialPrograms = {};
      let initialDistributors = [];
      programs.forEach(
        (prog) =>
          (initialPrograms[`${prog.id}`] = {
            details: {
              id: prog.id,
              name: prog.name,
              focusMonth: prog.focusMonth,
            },
            items: {},
            orders: [],
            programDetails: { total: 0, budget: "" },
          })
      );
      distributors.forEach((dist) => initialDistributors.push(dist.name));
      state.programs = { ...initialPrograms };
      state.distributors = initialDistributors;
    },
    setOrders(state, action) {
      const { program, orders } = action.payload
      state.programs[`${program}`].orders = [...orders]
    },
    addItem(state, action) {
      const { program, item } = action.payload;
      let distributorValues = {};
      let currentDistributors = [...state.distributors];
      currentDistributors.forEach((dist) => (distributorValues[dist] = 0));
      let newItem = {
        itemDetails: {
          itemNumber: item.itemNumber,
          brand: item.brand,
          itemType: item.itemType,
          price: item.price,
          qty: item.qty,
          imgUrl: item.imgUrl,
          complianceStatus: "pending",
          totalItems: 0,
          estTotal: 0,
        },
        distributors: { ...distributorValues },
      };
      state.programs[`${program}`].items[`${item.itemNumber}`] = newItem;
    },
    addItems(state, action) {
      const { program, items } = action.payload;
      let distributorValues = {};
      let currentDistributors = [...state.distributors];
      currentDistributors.forEach((dist) => (distributorValues[dist] = 0));
      items.forEach((item) => {
        if (!state.programs[`${program}`].items[`${item.itemNumber}`]) {
          state.programs[`${program}`].items[`${item.itemNumber}`] = {
            itemDetails: {
              itemNumber: item.itemNumber,
              brand: item.brand,
              itemType: item.itemType,
              price: item.price,
              qty: item.qty,
              imgUrl: item.imgUrl,
              complianceStatus: "pending",
              totalItems: 0,
              estTotal: 0,
            },
            distributors: { ...distributorValues },
          };
        }
      });
    },
    setGridItem(state, action) {
      const { program, itemNumber, distributor, value } = action.payload;
      state.programs[`${program}`].items[`${itemNumber}`].distributors[
        `${distributor}`
      ] = value;
    },
    setItemTotal(state, action) {
      const { program, itemNumber } = action.payload;
      let initialTotal = state.programs[`${program}`].programDetails.total;
      let total = 0;
      for (let dist in state.programs[`${program}`].items[`${itemNumber}`]
        .distributors) {
        total +=
          parseInt(
            state.programs[`${program}`].items[`${itemNumber}`].distributors[
              dist
            ]
          ) || 0;
      }
      let totalCost =
        total *
        state.programs[`${program}`].items[`${itemNumber}`].itemDetails.price;
      state.programs[`${program}`].items[
        `${itemNumber}`
      ].itemDetails.totalItems = total;
      state.programs[`${program}`].items[
        `${itemNumber}`
      ].itemDetails.estTotal = totalCost;
      let totalProgramCost = 0;
      for (let item in state.programs[`${program}`].items) {
        totalProgramCost +=
          state.programs[`${program}`].items[item].itemDetails.estTotal;
      }
      state.programs[`${program}`].programDetails.total = totalProgramCost;
      state.details.total += totalProgramCost - initialTotal;
    },
    removeGridItem(state, action) {
      const { program, itemNum } = action.payload;
      state.programs[`${program}`].programDetails.total -=
        state.programs[`${program}`].items[`${itemNum}`].itemDetails.estTotal;
      state.details.total -=
        state.programs[`${program}`].items[`${itemNum}`].itemDetails.estTotal;
      delete state.programs[`${program}`].items[`${itemNum}`];
    },
  },
});

export const {
  setTableData,
  setInitialTableData,
  setOrders,
  addItem,
  addItems,
  setGridItem,
  setItemTotal,
  removeGridItem,
} = programTableSlice.actions;

export default programTableSlice.reducer;
