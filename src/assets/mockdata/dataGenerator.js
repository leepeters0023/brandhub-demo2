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
let ruleTypes = ["Prior Approval", "Item Type", "Material", "Pricing"];
let tags = [
  "VT",
  "UT",
  "MA",
  "MN",
  "Necker",
  "Glorifier",
  "Mass Display",
  "Wood",
  "Plastic",
  "Cardboard",
];
let suppliers = ["Imperial", "Curtis", "Sterling", "Willey"];
let territories = ["Western", "Southern", "North East", "Mega", "California", "Walmart", "Kroger", "Multi Territory"]

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
    let territory = territories[Math.floor(Math.random()*territories.length)];
    
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

const generateComplianceItems = (dataPoints) => {
  let stats = ["Approved", "Denied", "Pending"];
  let data = [];

  for (let i = 0; i < dataPoints; i++) {
    let ranNum = Math.floor(Math.random() * 3 + 1)
    let sequenceNumber = (1110000010 + i).toString();
    let currentItemType =
      itemTypes[Math.floor(Math.random() * itemTypes.length)];
    let currentProgram = programs[Math.floor(Math.random() * programs.length)];
    let ruleType = ruleTypes[Math.floor(Math.random() * ruleTypes.length)];
    let ruleTags = [];
    for (let j = 0; j < ranNum; j++) {
      ruleTags.push(tags[Math.floor(Math.random() * tags.length)]);
    }
    let status = stats[Math.floor(Math.random() * stats.length)];
    let emailSent = ruleType === "Prior Approval" ? new Date().toLocaleDateString() : "N/A";
    let note =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius hendrerit eros, non rhoncus ante.";
    data.push({
      sequenceNum: sequenceNumber,
      itemType: currentItemType,
      program: currentProgram,
      ruleType: ruleType,
      tags: ruleTags,
      status: status,
      emailSent: emailSent,
      note: note
    })
  }
  return data;
};

const generateYearToDateBudgets = (dataPoints) => {
  let people = ["Sally Field", "John Doe", "Josh Downs", "Carlton Dunn"]
  let brands = ["Apothic", "Orin Swift", "Barefoot", "E & J", "New Amsterdam", "High Noon", "La Marca"];
  let data = []

  for (let i = 0; i < dataPoints; i ++) {
    let user = people[Math.floor(Math.random()*people.length)];
    let brand = brands[Math.floor(Math.random()*brands.length)];
    let territory = territories[Math.floor(Math.random()*(territories.length - 1))]
    let budget = Math.floor(Math.random() * 1000000 + 1000000)
    let onHold = Math.floor(budget * ((Math.floor(Math.random() * 10 + 5)) / 100))
    let committed = Math.floor(budget * ((Math.floor(Math.random() * 15 + 5)) / 100))
    let spent = Math.floor(budget * ((Math.floor(Math.random() * 60 + 5)) / 100))
    let remaining = budget - committed - onHold - spent;

    data.push({
      user: user,
      brand: brand,
      territory: territory,
      budget: budget,
      onHold: onHold,
      committed: committed,
      spent: spent,
      remaining: remaining
    })
  }

  return data;
}

export const rules = [
  {
    ruleType: "Item Type",
    tags: ["Wine", "Spirit", "Malt", "UT"],
    desc: "No Neckers Allowed for Wine, Spirits or Malt product",
    contact: null,
    email: null,
  },
  {
    ruleType: "Item Type",
    tags: ["Wine", "Spirit", "Malt", "VA"],
    desc: "No Floor Decals Allowed for Wine, Spirit or Malt",
    contact: null,
    email: null,
  },
  {
    ruleType: "Pricing",
    tags: ["Structure", "Wine", "Spirit", "Malt", ">", "150", "MD"],
    desc: "If Product = Structure, and Brand = Wine Spirit or Malt, Price cannot be greater than $150",
    contact: null,
    email: null,
  },
  {
    ruleType: "Pricing",
    tags: ["Structure", "Spirit", ">", "25", "WV"],
    desc: "Structure cannot exceed $25 if Spirit",
    contact: null,
    email: null,
  },
  {
    ruleType: "Pricing",
    tags: ["Structure", "Wine", "Spirit", "Malt", ">", "250", "SD"],
    desc: "Structure cannot exceed $250 if Wine, Spirit or Malt,",
    contact: null,
    email: null,
  },
  {
    ruleType: "Pricing",
    tags: ["Structure", "Wine", "Spirit", "Malt", ">", "40", "VA"],
    desc: "Structure cannot Exceed $40 if Wine, Spirit or Malt",
    contact: null,
    email: null,
  },
  {
    ruleType: "Prior Approval",
    tags: ["POS", "Wine", "Malt", "IN", "ME", "VT", "WV"],
    desc: "Prior Approval Required if Product is POS, Wine, and Malt",
    contact: "John Doe",
    email: "email@email.com",
  },
  {
    ruleType: "Prior Approval",
    tags: ["Structure", "Wine", "Malt", "IN", "ME", "MN", "VT", "WV"],
    desc: "Prior Approval Required if Product is Structure Wine and Malt",
    contact: "John Doe",
    email: "email@email.com",
  },
  {
    ruleType: "Prior Approval",
    tags: ["POS", "Spirit", "IN", "NC", "VA", "WV"],
    desc: "Prior Approval Required if Product is POS, Spirits",
    contact: "John Doe",
    email: "email@email.com",
  },
  {
    ruleType: "Prior Approval",
    tags: ["Structure", "Spirit", "IN", "MN", "WV"],
    desc: "Prior Approval Required if Product is Structure, Spirits",
    contact: "John Doe",
    email: "email@email.com",
  }
]

export const currentPOItems = generatePOItems(20);
export const currentBidItems = generatePOItems(20);
export const singlePO = generatePOItems(3);
export const bidItem = generatePOItems(1);
export const rfqCurrent = generateRFQs(20, "current");
export const rfqAll = generateRFQs(20, "all");
export const poCurrent = generatePOs(20, "current");
export const poAll = generatePOs(20, "all");
export const complianceItems = generateComplianceItems(20);
export const yearToDateBudgets = generateYearToDateBudgets(20);
