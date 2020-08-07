import React, { useState } from "react";
import PropTypes from "prop-types";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const SelectorMenus = ({ type, programs, handler }) => {
  //data would be pulled from store
  const regions = ["Region 1", "Region 2", "Region 3"];
  const fieldUsers = [
    "Field User 1",
    "Field User 2",
    "Field User 3",
    "Total Cart",
  ];
  const budgets = ["Budget 1", "Budget 2", "Budget 3"];

  const [region, updateRegion] = useState(0);
  const [cart, updateCart] = useState(0);
  const [budget, updateBudget] = useState(0);
  const [program, updateProgram] = useState("1");

  const handleChangeSelect = (evt) => {
    if (evt.target.id === "regions") {
      updateRegion(evt.target.value);
    } else if (evt.target.id === "cart") {
      updateCart(evt.target.value);
    } else if (evt.target.id === "budgets") {
      updateBudget(evt.target.value);
    } else if (evt.target.name === "programs") {
      console.log(evt.target.value)
      updateProgram(evt.target.value);
      handler(evt.target.value)
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
            value={cart}
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
            name="programs"
            labelId="program-select"
            id="programs"
            value={program}
            onChange={handleChangeSelect}
            
          >
            {programs.map((program, index) => (
              <MenuItem value={program.id} key={index}>
                {`${program.name}-${program.focusMonth}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }
};

SelectorMenus.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SelectorMenus;
