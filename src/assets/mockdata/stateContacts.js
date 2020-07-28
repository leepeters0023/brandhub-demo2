const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

let stateContacts = states.map((state) => {
  return {
    state: state,
    name: "Contact Name",
    address: "123 Street St., City ST 05050",
    email: "email@email.com",
    phone: "999-999-9999 ext. 9999"
  }
})

let stateAb = states.map((state) => {
  return {
    state: state
  }
})

export const contacts = stateContacts;
export const stateList = stateAb;