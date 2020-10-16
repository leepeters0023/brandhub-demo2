import { createSlice } from "@reduxjs/toolkit";

let mockContacts = [
  {
    id: "11",
    state: "Indiana",
    brandGroup: "Malt",
    name: "Brian Stewart",
    email: "brstewart@atc.in.gov"
  },
  {
    id: "6",
    state: "Indiana",
    brandGroup: "Spirt",
    name: "Brian Stewart",
    email: "brstewart@atc.in.gov"
  },
  {
    id: "2",
    state: "Indiana",
    brandGroup: "Wine",
    name: "Brian Stewart",
    email: "brstewart@atc.in.gov"
  },
  {
    id: "12",
    state: "Maine",
    brandGroup: "Malt",
    name: "Lori Nolette",
    email: "lori.n.nolette@maine.gov"
  },
  {
    id: "33",
    state: "Maine",
    brandGroup: "Spirit",
    name: "Tracy Willett",
    email: "tracy.willett@maine.gov"
  },
  {
    id: "3",
    state: "Maine",
    brandGroup: "Wine",
    name: "Lori Nolette",
    email: "lori.n.nolette@maine.gov"
  },
  {
    id: "31",
    state: "New Hampshire",
    brandGroup: "Malt",
    name: "Lisa Lassonde",
    email: "lisa.lassonde@liquor.state.nh.us"
  },
  {
    id: "32",
    state: "New Hampshire",
    brandGroup: "Spirit",
    name: "Lisa Lassonde",
    email: "lisa.lassonde@liquor.state.nh.us"
  },
  {
    id: "30",
    state: "New Hampshire",
    brandGroup: "Wine",
    name: "Lisa Lassonde",
    email: "lisa.lassonde@liquor.state.nh.us"
  },
  {
    id: "7",
    state: "North Carolina",
    brandGroup: "Spirit",
    name: "Laurie Lee",
    email: "laurie.lee@abc.nc.gov"
  },
  {
    id: "13",
    state: "Vermont",
    brandGroup: "Malt",
    name: "Vermont DLC",
    email: "dlc.enflic@vermont.gov"
  },
  {
    id: "8",
    state: "Vermont",
    brandGroup: "Spirit",
    name: "Vermont DLC",
    email: "dlc.enflic@vermont.gov"
  },
  {
    id: "4",
    state: "Vermont",
    brandGroup: "Wine",
    name: "Vermont DLC",
    email: "dlc.enflic@vermont.gov"
  },
  {
    id: "9",
    state: "Virginia",
    brandGroup: "Spirit",
    name: "Robyn Tipton",
    email: "robyn.tipton@abc.virginia.gov"
  },
  {
    id: "14",
    state: "West Virginia",
    brandGroup: "Malt",
    name: "West Virginia Malt",
    email: "abcc.wine@wv.gov"
  },
  {
    id: "10",
    state: "West Virginia",
    brandGroup: "Spirit",
    name: "West Virginia DS",
    email: "abcc.pricing@wv.gov"
  },
  {
    id: "5",
    state: "West Virginia",
    brandGroup: "Wine",
    name: "West Virginia ABC",
    email: "abcc.wine@wv.gov"
  },
]

let initialState = {
  isLoading: false,
  contacts: mockContacts,
  error: null,
}

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const complianceContactSlice = createSlice({
  name: "complianceContacts",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getContactsSuccess(state, action) {
      const { contacts } = action.payload;
      state.contacts = contacts;
      state.isLoading = false;
      state.error = null;
    },
    updateContact(state, action) {
      const { id, name, email } = action.payload;
      let newContacts = state.contacts.map((contact) => {
        if (contact.id === id) {
          return {
            ...contact,
            name: name,
            email: email,
          }
        } else return contact;
      })
      state.contacts = newContacts;
      state.error = null; 
    },
    clearContacts(state) {
      state.isLoading = false;
      state.contacts = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  getContactsSuccess,
  updateContact,
  clearContacts,
  setFailure
} = complianceContactSlice.actions;

export default complianceContactSlice.reducer;