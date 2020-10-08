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
    let totalDistributors = Math.floor(Math.random() * 25) + 20;
    let estCost = (Math.floor(Math.random() * 20) + 5) * 100 - 1;
    let estTotal = totalItems * estCost;
    data.push({
      id: (i + 1).toString(),
      sequenceNum: sequenceNumber,
      program: currentProgram,
      itemType: currentItemType,
      totalItems: totalItems,
      totalNotCompliant: totalNotCompliant,
      totalDistributors: totalDistributors,
      estCost: estCost,
      estTotal: estTotal,
      dueDate: "10/30/2020",
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
  let suppliers = ["Imperial", "Curtis", "Sterling"];

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
      shipDate: new Date().toLocaleDateString(),
    });
  }
  return data;
};

const generateComplianceRules = (dataPoints) => {
  let data = [];
  for (let i = 0; i < dataPoints; i++) {
    let ranNum = Math.floor(Math.random() * 3 + 1)
    let ruleType = ruleTypes[Math.floor(Math.random() * ruleTypes.length)];
    let ruleTags = [];
    for (let j = 0; j < ranNum; j++) {
      ruleTags.push(tags[Math.floor(Math.random() * tags.length)]);
    }
    let description =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius hendrerit eros, non rhoncus ante.";
    data.push({
      ruleType: ruleType,
      tags: ruleTags,
      desc: description,
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

export const currentPOItems = generatePOItems(20);
export const currentBidItems = generatePOItems(20);
export const singlePO = generatePOItems(3);
export const bidItem = generatePOItems(1);
export const rfqCurrent = generateRFQs(20, "current");
export const rfqAll = generateRFQs(20, "all");
export const poCurrent = generatePOs(20, "current");
export const poAll = generatePOs(20, "all");
export const rules = generateComplianceRules(20);
export const complianceItems = generateComplianceItems(20);
