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

export const units = ["Compass", "Popular", "Renaissance", "Spirits"];

export const couponTypes = ["MIR", "INS"];

export const offerTypes = ["AB", "NAB", "Dual AB/NAB", "Dual AB/AB"]

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

export const keyAccounts = [
  "ABC",
  "Ahold",
  "Albertsons National",
  "Albertson's NorCal",
  "Albertsons Shaws",
  "Albertsons SoCal",
  "Albertsons Southern",
  "Albertsons Southwest",
  "BJ's",
  "C Store",
  "CVS",
  "Dierbergs",
  "Dollar General",
  "Family Dollar",
  "Food Lion",
  "Fresh Market",
  "Fresh Thyme",
  "Giant Eagle",
  "Hannaford",
  "Harris Teeter",
  "HEB",
  "Hy Vee",
  "Jewel",
  "Kroger",
  "KVAT",
  "Lowes",
  "Meijer",
  "Military",
  "Publix",
  "Ralphs",
  "Rite Aid",
  "Roundys",
  "Sam's Club",
  "Southeastern Grocers",
  "Sprouts",
  "Target",
  "Total Wine",
  "Walgreens",
  "Walmart",
  "Whole Foods",
  "Winco",
];

export const roles = [
  "field1",
  "field2",
  "compliance",
  "finance",
  "supplier",
  "super",
];

export const brandBULookup = {
  Abandon: "Renaissance",
  Alamos: "Compass",
  "Amaro Montenegro": "Spirits",
  "Amelia Brut Rose": "Renaissance",
  Andre: "Popular",
  Apothic: "Compass",
  "Arbor Mist": "Popular",
  "Arch Rival": "Popular",
  Athena: "Compass",
  Ballatore: "Popular",
  Barefoot: "Popular",
  "Barefoot Bubbly": "Popular",
  "Barefoot Cellars Box": "Popular",
  "Barefoot Seltzer": "Popular",
  "Barefoot Spritzers": "Popular",
  "Bartles & Jaymes": "Popular",
  "Bear Flag": "Renaissance",
  "Bella Sera": "Popular",
  "Black Box": "Popular",
  "Black Box Spirits": "Spirits",
  Brancaia: "Renaissance",
  Bridlewood: "Compass",
  "Carlo Rossi": "Popular",
  "Carlo Rossi Box": "Popular",
  Carnivor: "Compass",
  "Chateau Souverain": "Compass",
  "Clos Du Bois": "Popular",
  Columbia: "Compass",
  Cooks: "Popular",
  "Covey Run": "Compass",
  "Da Vinci": "Renaissance",
  "Dancing Bull": "Compass",
  "Dark Horse": "Popular",
  "Dark Horse Box": "Popular",
  "Dark Horse Sparkling": "Popular",
  "Dark Horse Wine": "Popular",
  "Department 66": "Renaissance",
  Diplomatico: "Spirits",
  "Don Fulano": "Spirits",
  "Don Miguel Gascon": "Compass",
  "E&J Flavors": "Spirits",
  "E&J VS Brandy": "Spirits",
  "E&J VSOP Brandy": "Spirits",
  "E&J XO Brandy": "Spirits",
  "Ecco Domani": "Renaissance",
  "Edna Valley Vineyard": "Compass",
  Ember: "Compass",
  Estancia: "Popular",
  "Familia Camarena": "Spirits",
  "Fleur De Mer": "Renaissance",
  "Fleur de Mer": "Renaissance",
  Franciscan: "Popular",
  "Frei Brothers": "Renaissance",
  "Gallo Family Vineyards": "Popular",
  "Gallo Signature Series": "Renaissance",
  "Gather & Grace": "Compass",
  "Ghost Pines": "Renaissance",
  "High Noon Beverage": "Spirits",
  "High Noon": "Spirits",
  "J Vineyards & Winery": "Renaissance",
  "J Vineyards Sparkling": "Renaissance",
  Jayson: "Renaissance",
  "John Barr": "Spirits",
  Jura: "Spirits",
  Kingdom: "Popular",
  "La Marca": "Renaissance",
  Laguna: "Renaissance",
  "Las Rocas": "Renaissance",
  Leftie: "Popular",
  "Liberty Creek": "Popular",
  "Livingston Cellars": "Popular",
  Locations: "Renaissance",
  "Lo-Fi Aperitifs": "Spirits",
  "Louis M Martini": "Renaissance",
  "MacMurray Estate Vineyards": "Renaissance",
  "Madria Sangria": "Popular",
  "Maison No. 9": "Renaissance",
  "Mark West": "Popular",
  "Martin Codax": "Renaissance",
  "Maso Canali": "Renaissance",
  "Mia Dolcea": "Renaissance",
  Mirassou: "Compass",
  Mother: "Popular",
  "New Amsterdam": "Spirits",
  "New Amsterdam Gin": "Spirits",
  "New Amsterdam Vodka": "Spirits",
  "Orin Swift": "Renaissance",
  Pahlmeyer: "Renaissance",
  "Paul Masson Brandy": "Popular",
  "Paul Masson Dessrts": "Popular",
  "Paul Masson Table": "Popular",
  "Peter Vella": "Popular",
  "Popular Corporate": "Popular",
  "Premium Compass Corporate": "Compass",
  "Premium Compass Portfolio": "Compass",
  "Premium Renaissance Corporate": "Renaissance",
  "Premium Renaissance Portfolio": "Renaissance",
  Prophecy: "Compass",
  "Rancho Zabaco": "Compass",
  "Red Rock Winery": "Compass",
  "Redwood Creek": "Popular",
  RumHaven: "Spirits",
  "Saint Clair Family Estate": "Compass",
  "Select Aperitivo": "Spirits",
  Shackleton: "Spirits",
  "Spirits Corporate": "Spirits",
  Starborough: "Compass",
  Steamsmith: "Spirits",
  Storypoint: "Compass",
  Sunseeker: "Compass",
  "Talbott Vineyards": "Compass",
  "The Dalmore": "Spirits",
  "The Naked Grape": "Popular",
  "The Naked Grape Box": "Popular",
  Thrive: "Compass",
  Thunderbird: "Popular",
  Tisdale: "Popular",
  Totts: "Popular",
  "Turning Leaf": "Popular",
  "Vecchia Romagna Brandy": "Spirits",
  "Vin Vault": "Popular",
  "White Haven": "Compass",
  Whitehaven: "Compass",
  "William Hill": "Renaissance",
};
