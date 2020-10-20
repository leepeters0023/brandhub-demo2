let programs = [
  "Apothic Fall 20201",
  "Barefoot June Focus 2021",
  "La Marca Winter 2021",
  "New Amsterdam Christmas",
  "Orin Swift January 2021",
  "Whitehaven Summer Splash",
  "High Noon Spring 2021",
];
let itemTypes = [
  "Shelf Talker",
  "Carton Rider",
  "Mass Display",
  "Necker",
  "Glorifier",
];
let suppliers = ["Imperial", "Curtis", "Sterling", "Willey"];
let territories = [
  "Western",
  "Southern",
  "North East",
  "Mega",
  "California",
  "Walmart",
  "Kroger",
  "Multi Territory",
];

const generatePOItems = (dataPoints) => {
  let data = [];
  for (let i = 0; i < dataPoints; i++) {
    let currentProgram = programs[Math.floor(Math.random() * programs.length)];
    let currentItemType =
      itemTypes[Math.floor(Math.random() * itemTypes.length)];
    let sequenceNumber = (1110000010 + i).toString();
    let totalItems = Math.floor(Math.random() * 1000) + 500;
    let totalNotCompliant = Math.floor(
      totalItems / 12 - Math.floor(Math.random() * (totalItems / 12))
    );
    let estCost = (Math.floor(Math.random() * 20) + 5) * 100 - 1;
    let estTotal = totalItems * estCost;
    let supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    let territory = territories[Math.floor(Math.random() * territories.length)];

    data.push({
      id: (i + 1).toString(),
      sequenceNum: sequenceNumber,
      territory: territory,
      program: currentProgram,
      itemType: currentItemType,
      totalItems: totalItems,
      totalNotCompliant: totalNotCompliant,
      estCost: estCost,
      estTotal: estTotal,
      dueDate: "10/30/2020",
      supplier: supplier,
    });
  }
  return data;
};

const generateRFQs = (dataPoints, stat) => {
  let statusAll = [
    "Awaiting Resp 0/3",
    "Awaiting Resp 1/3",
    "Awaiting Resp 2/3",
    "Awarded",
    "Ready for Review",
  ];
  let data = [];
  for (let i = 0; i < dataPoints; i++) {
    let currentProgram = programs[Math.floor(Math.random() * programs.length)];
    let currentItemType =
      itemTypes[Math.floor(Math.random() * itemTypes.length)];
    let rfqNumber = (543000120 + i).toString();
    let sequenceNumber = (1110000010 + i).toString();
    let totalItems = Math.floor(Math.random() * 1000) + 500;
    let estCost = (Math.floor(Math.random() * 20) + 5) * 100 - 1;
    let estTotal = totalItems * estCost;
    let status =
      stat === "all"
        ? statusAll[Math.floor(Math.random() * statusAll.length)]
        : "Ready for Review";
    data.push({
      id: (i + 1).toString(),
      rfqNum: rfqNumber,
      sequenceNum: sequenceNumber,
      program: currentProgram,
      itemType: currentItemType,
      totalItems: totalItems,
      estCost: estCost,
      estTotal: estTotal,
      status: status,
    });
  }
  return data;
};

const generatePOs = (dataPoints, stat) => {
  let statusAll = ["In Progress", "Complete", "Canceled"];

  let data = [];
  for (let i = 0; i < dataPoints; i++) {
    let poNumber = (543000120 + i).toString();
    let supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    let totalItems = Math.floor(Math.random() * 1000) + 500;
    let estCost = (Math.floor(Math.random() * 20) + 5) * 100 - 1;
    let estTotal = totalItems * estCost;
    let status =
      stat === "all"
        ? statusAll[Math.floor(Math.random() * statusAll.length)]
        : "In Progress";
    data.push({
      id: (i + 1).toString(),
      poNum: poNumber,
      supplier: supplier,
      totalItems: totalItems,
      estTotal: estTotal,
      actTotal: estTotal,
      status: status,
      dueDate: new Date().toLocaleDateString(),
    });
  }
  return data;
};

const generateYearToDateBudgets = (dataPoints) => {
  let people = ["Sally Field", "John Doe", "Josh Downs", "Carlton Dunn"];
  let brands = [
    "Apothic",
    "Orin Swift",
    "Barefoot",
    "E & J",
    "New Amsterdam",
    "High Noon",
    "La Marca",
  ];
  let data = [];

  for (let i = 0; i < dataPoints; i++) {
    let user = people[Math.floor(Math.random() * people.length)];
    let brand = brands[Math.floor(Math.random() * brands.length)];
    let territory =
      territories[Math.floor(Math.random() * (territories.length - 1))];
    let budget = Math.floor(Math.random() * 1000000 + 1000000);
    let onHold = Math.floor(
      budget * (Math.floor(Math.random() * 10 + 5) / 100)
    );
    let committed = Math.floor(
      budget * (Math.floor(Math.random() * 15 + 5) / 100)
    );
    let spent = Math.floor(budget * (Math.floor(Math.random() * 60 + 5) / 100));
    let remaining = budget - committed - onHold - spent;

    data.push({
      user: user,
      brand: brand,
      territory: territory,
      budget: budget,
      onHold: onHold,
      committed: committed,
      spent: spent,
      remaining: remaining,
    });
  }

  return data;
};

export const rules = [
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Wine", "POS"],
    desc: "All Items that are POS, and Wine branded must have prior approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["ME", "Wine", "POS"],
    desc: "All Items that are POS, and Wine branded must have prior approval",
    contact: "Lori Nolette",
    email: "lori.n.nolette@maine.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VT", "Wine", "POS"],
    desc: "All Items that are POS, and Wine branded must have prior approval",
    contact: "Vermont DLC",
    email: "dlc.enflic@vermont.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Wine", "POS"],
    desc: "All Items that are POS, and Wine branded must have prior approval",
    contact: "West Virginia ABC",
    email: "abcc.wine@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Malt", "POS"],
    desc: "All Items that are POS, and Malt branded must have prior approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["ME", "Malt", "POS"],
    desc: "All Items that are POS, and Malt branded must have prior approval",
    contact: "Lori Nolette",
    email: "lori.n.nolette@maine.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VT", "Malt", "POS"],
    desc: "All Items that are POS, and Malt branded must have prior approval",
    contact: "Vermont DLC",
    email: "dlc.enflic@vermont.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Malt", "POS"],
    desc: "All Items that are POS, and Malt branded must have prior approval",
    contact: "West Virginia Malt",
    email: "abcc.wine@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Spirits", "POS"],
    desc:
      "All Items that are POS, and Spirits branded must have prior approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["NC", "Spirits", "POS"],
    desc:
      "All Items that are POS, and Spirits branded must have prior approval",
    contact: "Laurie Lee",
    email: "laurie.lee@abc.nc.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VA", "Spirits", "POS"],
    desc:
      "All Items that are POS, and Spirits branded must have prior approval",
    contact: "Robyn Tipton",
    email: "robyn.tipton@abc.virginia.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Spirits", "POS"],
    desc:
      "All Items that are POS, and Spirits branded must have prior approval",
    contact: "West Virginia DS",
    email: "abcc.pricing@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Wine", "Structure"],
    desc:
      "All Items that are Structure, and Wine Branded must have prior Approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["ME", "Wine", "Structure"],
    desc:
      "All Items that are Structure, and Wine Branded must have prior Approval",
    contact: "Lori Nolette",
    email: "lori.n.nolette@maine.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["MN", "Wine", "Structure"],
    desc:
      "All Items that are Structure, and Wine Branded must have prior Approval",
    contact: "Minnesota Contact",
    email: "email@mn.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VT", "Wine", "Structure"],
    desc:
      "All Items that are Structure, and Wine Branded must have prior Approval",
    contact: "Vermont DLC",
    email: "dlc.enflic@vermont.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Wine", "Structure"],
    desc:
      "All Items that are Structure, and Wine Branded must have prior Approval",
    contact: "West Virginia ABC",
    email: "abcc.wine@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Malt", "Structure"],
    desc:
      "All Items that are Structure, and Malt Branded must have prior Approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["ME", "Malt", "Structure"],
    desc:
      "All Items that are Structure, and Malt Branded must have prior Approval",
    contact: "Lori Nolette",
    email: "lori.n.nolette@maine.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["MN", "Malt", "Structure"],
    desc:
      "All Items that are Structure, and Malt Branded must have prior Approval",
    contact: "Minnesota Contact",
    email: "email@mn.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VT", "Malt", "Structure"],
    desc:
      "All Items that are Structure, and Malt Branded must have prior Approval",
    contact: "Vermont DLC",
    email: "dlc.enflic@vermont.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Malt", "Structure"],
    desc:
      "All Items that are Structure, and Malt Branded must have prior Approval",
    contact: "West Virginia Malt",
    email: "abcc.wine@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Spirits", "Structure"],
    desc:
      "All Items that are Structure, and Spirits Branded must have prior Approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["MN", "Spirits", "Structure"],
    desc:
      "All Items that are Structure, and Spirits Branded must have prior Approval",
    contact: "Minnesota Contact",
    email: "email@mn.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Spirits", "Structure"],
    desc:
      "All Items that are Structure, and Spirits Branded must have prior Approval",
    contact: "West Virginia DS",
    email: "abcc.pricing@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Wine", "CAS"],
    desc: "All Items that are CAS, and Wine Branded must have prior Approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["MN", "Wine", "CAS"],
    desc: "All Items that are CAS, and Wine Branded must have prior Approval",
    contact: "Minnesota Contact",
    email: "email@mn.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["NC", "Wine", "CAS"],
    desc: "All Items that are CAS, and Wine Branded must have prior Approval",
    contact: "Laurie Lee",
    email: "laurie.lee@abc.nc.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VT", "Wine", "CAS"],
    desc: "All Items that are CAS, and Wine Branded must have prior Approval",
    contact: "Vermont DLC",
    email: "dlc.enflic@vermont.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Wine", "CAS"],
    desc: "All Items that are CAS, and Wine Branded must have prior Approval",
    contact: "West Virginia ABC",
    email: "abcc.wine@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Malt", "CAS"],
    desc: "All Items that are CAS, and Malt Branded must have prior Approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["MN", "Malt", "CAS"],
    desc: "All Items that are CAS, and Malt Branded must have prior Approval",
    contact: "Minnesota Contact",
    email: "email@mn.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["NC", "Malt", "CAS"],
    desc: "All Items that are CAS, and Malt Branded must have prior Approval",
    contact: "Laurie Lee",
    email: "laurie.lee@abc.nc.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["PA", "Malt", "CAS"],
    desc: "All Items that are CAS, and Malt Branded must have prior Approval",
    contact: "Penn. Contact",
    email: "email@pa.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VT", "Malt", "CAS"],
    desc: "All Items that are CAS, and Malt Branded must have prior Approval",
    contact: "Vermont DLC",
    email: "dlc.enflic@vermont.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Malt", "CAS"],
    desc: "All Items that are CAS, and Malt Branded must have prior Approval",
    contact: "West Virginia Malt",
    email: "abcc.wine@wv.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["IN", "Spirits", "CAS"],
    desc:
      "All Items that are CAS, and Spirits Branded must have prior Approval",
    contact: "Brian Stewart",
    email: "brstewart@atc.in.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["MN", "Spirits", "CAS"],
    desc:
      "All Items that are CAS, and Spirits Branded must have prior Approval",
    contact: "Minnesota Contact",
    email: "email@mn.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["NC", "Spirits", "CAS"],
    desc:
      "All Items that are CAS, and Spirits Branded must have prior Approval",
    contact: "Laurie Lee",
    email: "laurie.lee@abc.nc.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["PA", "Spirits", "CAS"],
    desc:
      "All Items that are CAS, and Spirits Branded must have prior Approval",
    contact: "Penn. Contact",
    email: "email@pa.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VA", "Spirits", "CAS"],
    desc:
      "All Items that are CAS, and Spirits Branded must have prior Approval",
    contact: "Robyn Tipton",
    email: "robyn.tipton@abc.virginia.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["VT", "Spirits", "CAS"],
    desc:
      "All Items that are CAS, and Spirits Branded must have prior Approval",
    contact: "Vermont DLC",
    email: "dlc.enflic@vermont.gov",
  },
  {
    ruleType: "Prior Approval",
    tags: ["WV", "Spirits", "CAS"],
    desc:
      "All Items that are CAS, and Spirits Branded must have prior Approval",
    contact: "West Virginia DS",
    email: "abcc.pricing@wv.gov",
  },
  {
    ruleType: "Price",
    tags: ["PA", "Wine", "Malt", "Spirits", "Sign", "$300"],
    desc: "All Brands, Signs must cost less than $300.",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["WV", "Spirits", "Structure", "$25"],
    desc: "Spirits Brands, All Structure Items must cost less than $25.",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["MD", "Spirits", "Wine", "Malt", "Structure", "$150"],
    desc:
      "For Wine, Malt, and Spirits, Structure Items must cost less than $150",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["SD", "Spirits", "Wine", "Malt", "Structure", "$250"],
    desc:
      "For Wine, Malt, and Spirits, Structure Items must cost less than $250",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["VA", "Spirits", "Wine", "Malt", "Structure", "$40"],
    desc:
      "For Wine, Malt, and Spirits, Structure Items must cost less than $40",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["AZ", "Spirits", "Wine", "Malt", "CAS", "$5"],
    desc: "For Wine, Malt, and Spirits, CAS Items must cost less than $5",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["OH", "Wine", "CAS", "$3"],
    desc: "For Wine, CAS Items must cost less than $3",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["OH", "CA", "Malt", "CAS", "$3"],
    desc: "For Malt, CAS Items must cost less than $3",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["OH", "Spirits", "CAS", "$3"],
    desc: "For Spirits, CAS Items must cost less than $3",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["CA", "Wine", "CAS", "$1"],
    desc: "For Wine, CAS Items must cost less than $1",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["TX", "Malt", "CAS", "$1"],
    desc: "For Malt, CAS Items must cost less than $1",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["PA", "Wine", "CAS", "$15"],
    desc: "For Wine, CAS Items must cost less than $15",
    contact: null,
    email: null,
  },
  {
    ruleType: "Price",
    tags: ["LA", "Spirits", "Wine", "Malt", "Structure", "$155"],
    desc: "For Wine, Malt, and Spirits, Structure Items must cost less than $155",
    contact: null,
    email: null,
  },
  {
    ruleType: "Item Type",
    tags: ["UT", "Spirits", "Wine", "Malt", "Necker"],
    desc: "All Brands, Neckers are not permitted.",
    contact: null,
    email: null,
  },
  {
    ruleType: "Item Type",
    tags: ["VA", "Spirits", "Wine", "Malt", "Floor Stickers"],
    desc: "Floor Stickers not permitted in VA for Spirits, Malt or Wine. ",
    contact: null,
    email: null,
  },
  {
    ruleType: "Item Type",
    tags: ["VA", "Spirits", "Wine", "Malt", "Illuminated Signs"],
    desc: "Illuminated Signs not permitted in VA for Spirits, Malt or Wine.",
    contact: null,
    email: null,
  },
  {
    ruleType: "Item Type",
    tags: ["AL", "GA", "OR", "SC", "SD", "VA", "WA", "Wine", "CAS"],
    desc: "CAS with Wine Branding Not Permitted.",
    contact: null,
    email: null,
  },
  {
    ruleType: "Item Type",
    tags: ["AL", "GA", "KY", "OR", "SC", "SD", "VA", "WA", "Malt", "CAS"],
    desc: "CAS with Malt Branding Not Permitted.",
    contact: null,
    email: null,
  },
  {
    ruleType: "Item Type",
    tags: ["AL", "GA", "OR", "SC", "SD", "VA", "WA", "Spirits", "CAS"],
    desc: "CAS with Spirits Branding Not Permitted.",
    contact: null,
    email: null,
  },
  {
    ruleType: "Product",
    tags: ["VA", "Spirits", "Malt", "Wine", "Structure", "Wood"],
    desc: "For Wine, Malt, and Spirits, Structure Items cannot be made of wood or metal.",
    contact: null,
    email: null,
  }
];

export const complianceItems = [
  {
    id: "1",
    active: false,
    sequenceNum: "110000010",
    itemType: "Shelf Talker",
    program: "New Amsterdam Holiday",
    ruleType: "Prior Approval",
    tags: ["POS", "VT"],
    status: "Denied",
    emailSent: "N/A",
  },
  {
    id: "2",
    active: true,
    sequenceNum: "110000011",
    itemType: "Carton Rider",
    program: "Barefoot June Focs 2021",
    ruleType: "Prior Approval",
    tags: ["POS", "ME"],
    status: "Pending",
    emailSent: new Date().toLocaleDateString(),
  },
  {
    id: "3",
    active: true,
    sequenceNum: "110000012",
    itemType: "Structure",
    program: "Whitehaven Summer Splash",
    ruleType: "Price",
    tags: ["Product Display", "$25", "WV"],
    status: "Pending",
    emailSent:"N/A",
  },
  {
    id: "4",
    active: true,
    sequenceNum: "110000013",
    itemType: "Shelf Talker",
    program: "La Marca Winter 2021",
    ruleType: "Item Type",
    tags: ["Wine", "Necker", "UT"],
    status: "Non-Compliant",
    emailSent: "N/A",
  },
  {
    id: "5",
    active: true,
    sequenceNum: "110000014",
    itemType: "Structure",
    program: "Whitehaven Summer Splash",
    ruleType: "Price",
    tags: ["Product Display", "$150", "MD"],
    status: "Pending",
    emailSent: "N/A",
  },
  {
    id: "6",
    active: true,
    sequenceNum: "110000015",
    itemType: "Shelf Talker",
    program: "Whitehaven Summer Splash",
    ruleType: "Prior Approval",
    tags: ["POS", "IN"],
    status: "Approved",
    emailSent: "N/A",
  },
  {
    id: "7",
    active: true,
    sequenceNum: "110000016",
    itemType: "Drinkware",
    program: "New Amsterdam Holiday",
    ruleType: "Item Type",
    tags: ["CAS", "Spirits", "AL"],
    status: "Non-Compliant",
    emailSent: "N/A",
  },
  {
    id: "8",
    active: true,
    sequenceNum: "110000017",
    itemType: "Drinkware",
    program: "New Amsterdam Holiday",
    ruleType: "Price",
    tags: ["CAS", "Spirits", "$3", "OH"],
    status: "Pending",
    emailSent: "N/A",
  },
]

export const currentPOItems = generatePOItems(20);
export const currentBidItems = generatePOItems(20);
export const singlePO = generatePOItems(3);
export const bidItem = generatePOItems(1);
export const rfqCurrent = generateRFQs(20, "current");
export const rfqAll = generateRFQs(20, "all");
export const poCurrent = generatePOs(20, "current");
export const poAll = generatePOs(20, "all");
export const yearToDateBudgets = generateYearToDateBudgets(20);
