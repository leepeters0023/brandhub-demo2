const generateData = (dataPoints) => {
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
  let data = [];
  for (let i = 0; i < dataPoints; i++) {
    let currentProgram = programs[Math.floor(Math.random() * programs.length)];
    let currentItemType =
      itemTypes[Math.floor(Math.random() * itemTypes.length)];
    let sequenceNumber = (1110000010 + i).toString();
    let totalItems = Math.floor(Math.random() * 1000) + 500;
    let totalNotCompliant =
      Math.floor(totalItems / 12 - (Math.floor(Math.random() * (totalItems / 12))));
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
      dueDate: "10/30/2020"
    });
  }
  return data;
};

export const currentPOItems = generateData(20);
export const currentBidItems = generateData(20);
export const singlePO = generateData(3);
