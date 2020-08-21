import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const SelectorMenus = ({ type, handler, currentProgram }) => {
  //data would be pulled from store
  const regions = useSelector((state) => state.user.territories);
  const fieldUsers = [
    "Field User 1",
    "Field User 2",
    "Field User 3",
  ];
  const budgets = ["Budget 1", "Budget 2", "Budget 3"];

  const [region, updateRegion] = useState(regions[0] || "");
  const [user, updateUser] = useState(fieldUsers[0]);
  const [budget, updateBudget] = useState(0);
  const [program, updateProgram] = useState("");
  const currentPrograms = useSelector((state) => state.programs.programs);
  const handleChangeSelect = (evt) => {
    if (evt.target.name === "regions") {
      updateRegion(evt.target.value);
    } else if (evt.target.name === "user") {
      updateUser(evt.target.value);
    } else if (evt.target.id === "budgets") {
      updateBudget(evt.target.value);
    } else if (evt.target.name === "programs") {
      updateProgram(evt.target.value);
      handler(evt.target.value);
    }
  };

  useEffect(() => {
    if (currentProgram) {
      updateProgram(currentProgram);
    }
  }, [currentProgram]);

  if (type === "regions") {
    return (
      <>
        <FormControl
          variant="outlined"
          size="small"
          style={{ margin: "0 5px" }}
        >
          <Select
            name="regions"
            labelId="region-select"
            id="regions"
            value={region}
            onChange={handleChangeSelect}
          >
            {regions.map((region, index) => (
              <MenuItem value={region} key={index}>
                <Typography variant="body2">{region}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  } else if (type === "cart") {
    return (
      <>
        <FormControl variant="outlined" size="small" style={{ margin: "0 5px" }}>
          <Select
            name="user"
            labelId="user-select"
            id="user"
            value={user}
            onChange={handleChangeSelect}
          >
            {fieldUsers.map((user, index) => (
              <MenuItem value={user} key={index}>
                <Typography variant="body2">{user}</Typography>
              </MenuItem>
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
        <FormControl style={{ margin: "0 5px" }}>
          <InputLabel id="program-select">Program</InputLabel>
          <Select
            name="programs"
            labelId="program-select"
            id="programs"
            value={program}
            onChange={handleChangeSelect}
          >
            {currentPrograms.map((program, index) => (
              <MenuItem value={program.id} key={index}>
                {program.isComplete ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" style={{ overflow: "hidden" }}>
                      {`${program.name}-${program.focusMonth}`}
                    </Typography>
                    <CheckCircleIcon
                      color="secondary"
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                ) : (
                  <Typography variant="body2">
                    {`${program.name}-${program.focusMonth}`}
                  </Typography>
                )}
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

export default React.memo(SelectorMenus, (prev, next) => {
  if (prev.programs && prev.currentProgram) {
    return (
      prev.programs.length === next.programs.length &&
      prev.type === next.type &&
      prev.currentProgram === next.currentProgram
    );
  } else {
    return prev.type === next.type;
  }
});
