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
let distributors = [
  {
    name: "ABC Storage",
    state: "WY",
  },
  {
    name: "Albertson's LLC Intermtn Div",
    state: "ID",
  },
  {
    name: "Breakthru Bev",
    state: "IL",
  },
  {
    name: "Clatsop Dist",
    state: "OR",
  },
  {
    name: "Dayton Heidelberg",
    state: "OH",
  },
];
let people = ["Sally Field", "John Doe", "Josh Downs", "Carlton Dunn"];

const generateYearToDateBudgets = (dataPoints) => {
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
    let state = distributors[Math.floor(Math.random() * distributors.length)].state;
    let budget = Math.floor(Math.random() * 1000000 + 1000000);
    let inProcess = Math.floor(
      budget * (Math.floor(Math.random() * 10 + 5) / 100)
    );
    let shipped = Math.floor(
      budget * (Math.floor(Math.random() * 15 + 5) / 100)
    );
    let remaining = budget - shipped - inProcess;

    data.push({
      user: user,
      brand: brand,
      territory: territory,
      state: state,
      budget: budget,
      inProcess: inProcess,
      shipped: shipped,
      remaining: remaining,
    });
  }

  return data;
};

export const generatePendingComplianceItems = (dataPoints) => {
  let data = [];
  for (let i = 0; i < dataPoints; i++) {
    let territory = territories[Math.floor(Math.random() * territories.length)];
    let user = people[Math.floor(Math.random() * people.length)];
    let distributor =
      distributors[Math.floor(Math.random() * distributors.length)];
    let totalItems = Math.floor(Math.random() * 1000) + 500;
    data.push({
      id: i + 1,
      territory: territory,
      user: user,
      distributorName: distributor.name,
      distributorState: distributor.state,
      totalItems: totalItems,
      rule:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida cursus purus, sit amet luctus.",
    });
  }
  return data;
};

export const pendingComplianceItems = generatePendingComplianceItems(6);
export const yearToDateBudgets = generateYearToDateBudgets(20);
