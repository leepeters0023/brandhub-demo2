/*
Everything in this file is subject to change, and mostly handles "slow moving
data" that doesn't exist in the api yet.  Plan to eventually remove the majority
of this and rely soley on the api for information.
*/

export const couponTypeList = [
  {
    id: "021",
    categoryCode: "COU",
    name: "Coupon Necker",
    packSize: 50,
  },
  {
    id: "024",
    categoryCode: "COU",
    name: "Gallo Coupon Pamphlet",
    packSize: 50,
  },
  {
    id: "025",
    categoryCode: "COU",
    name: "Gallo Coupon Tearpad",
    packSize: 1,
  },
  {
    id: "007",
    categoryCode: "COU",
    name: "Post-It Tear Pad",
    packSize: 1,
  },
  {
    id: "018",
    categoryCode: "ADV",
    name: "Tear Pad",
    packSize: 1,
  },
];

export const ruleTypes = ["Prior Approval", "Item Type", "Material", "Pricing"];

export const units = [
  { id: "1", name: "Compass" },
  { id: "2", name: "Renaissance" },
  { id: "3", name: "Popular" },
  { id: "4", name: "Spirits" },
];

export const couponTypes = ["MIR", "INS"];

export const offerTypes = ["AB", "NAB", "Dual AB/NAB", "Dual AB/AB"];

export const regions = [
  {
    id: "1",
    code: "ALL",
    name: "National",
  },
  {
    id: "2",
    code: "ATL",
    name: "Atlantic",
  },
  {
    id: "3",
    code: "CAL",
    name: "California",
  },
  {
    id: "4",
    code: "CEN",
    name: "Central",
  },
  {
    id: "5",
    code: "CON",
    name: "Control",
  },
  {
    id: "6",
    code: "EAS",
    name: "East",
  },
  {
    id: "7",
    code: "MEG",
    name: "Mega",
  },
  {
    id: "8",
    code: "MIW",
    name: "Midwest",
  },
  {
    id: "9",
    code: "NOE",
    name: "Northeast",
  },
  {
    id: "10",
    code: "SOE",
    name: "Southeast",
  },
  {
    id: "11",
    code: "SOU",
    name: "Southern",
  },
  {
    id: "12",
    code: "WES",
    name: "Western",
  },
];

export const roles = [
  "field1",
  "field2",
  "compliance",
  "finance",
  "supplier",
  "super",
];


export const brandLogoMap = {
  Barefoot:
    "https://res.cloudinary.com/joshdowns-dev/image/upload/v1600105144/Select/BF_logo_11JULY2017_1_t2lb61.png",
  Prophecy:
    "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607522171/Select/prophecy_gkam9k.png",
  Leftie:
    "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607522171/Select/leftie_afgnvk.png",
  Alamos:
    "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607522171/Select/alamos_wsadwo.png",
  "High Noon Beverage":
    "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607522171/Select/high-noon_uorahu.png",
  "Chateau Souverain":
    "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607524577/Select/chateau-souverain_dcodtv.png",
};
