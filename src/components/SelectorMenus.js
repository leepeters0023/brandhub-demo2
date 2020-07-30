import React, { useState } from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const SelectorMenus = ({ type }) => {
  //data would be pulled from store
  const regions = ["Region 1", "Region 2", "Region 3"];
  const fieldUsers = ["Field User 1", "Field User 2", "Field User 3", "Total Cart"];
  const budgets = ["Budget 1", "Budget 2", "Budget 3"];
  const programs = ["Program 1", "Program 2", "Program 3"];

  const [region, updateRegion] = useState(0);
  const [bdm, updateBdm] = useState(0);
  const [budget, updateBudget] = useState(0);
  const [program, updateProgram] = useState(0);

  const handleChangeSelect = (evt) => {
    if (evt.target.id === "regions") {
      updateRegion(evt.target.value);
    } else if (evt.target.id === "bdms") {
      updateBdm(evt.target.value);
    } else if (evt.target.id === "budgets") {
      updateBudget(evt.target.value);
    } else if (evt.target.id === "programs") {
      updateProgram(evt.target.value);
    }
  };

  if (type === "regions") {
    return (
      <>
        <FormControl variant="outlined" style={{ margin: "0 5px" }}>
          <InputLabel id="region-select">Region</InputLabel>
          <Select
            native
            labelId="region-select"
            id="regions"
            value={region}
            onChange={handleChangeSelect}
            label="Region"
          >
            {regions.map((region, index) => (
              <option value={index} key={index}>
                {region}
              </option>
            ))}
          </Select>
        </FormControl>
      </>
    );
  } else if (type === "cart") {
    return (
      <>
        <FormControl variant="outlined" style={{ margin: "0 5px" }}>
          <InputLabel id="cart-select">Cart</InputLabel>
          <Select
            native
            labelId="cart-select"
            id="cart"
            value={bdm}
            onChange={handleChangeSelect}
            label="Cart"
          >
            {fieldUsers.map((user, index) => (
              <option value={index} key={index}>
                {user}
              </option>
            ))}
          </Select>
        </FormControl>
      </>
    );
  } else if (type === "budgets") {
    return (
      <>
        <FormControl variant="outlined" style={{ margin: "0 5px" }}>
          <InputLabel id="budget-select">Budget</InputLabel>
          <Select
            native
            labelId="budget-select"
            id="budgets"
            value={budget}
            onChange={handleChangeSelect}
            label="budget"
          >
            {budgets.map((budget, index) => (
              <option value={index} key={index}>
                {budget}
              </option>
            ))}
          </Select>
        </FormControl>
      </>
    );
  } else if (type === "programs") {
    return (
      <>
        <FormControl variant="outlined" style={{ margin: "0 5px" }}>
          <InputLabel id="program-select">Program</InputLabel>
          <Select
            native
            labelId="program-select"
            id="programs"
            value={program}
            onChange={handleChangeSelect}
            label="program"
          >
            {programs.map((program, index) => (
              <option value={index} key={index}>
                {program}
              </option>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }
};

export default SelectorMenus;
