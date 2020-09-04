import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const ProgramSelector = ({ handler, currentProgram }) => {

  const [program, updateProgram] = useState("");
  const currentPrograms = useSelector((state) => state.programs.programs);
  const handleChangeSelect = (evt) => {
      updateProgram(evt.target.value);
      handler(evt.target.value);
  };

  useEffect(() => {
    if (currentProgram) {
      updateProgram(currentProgram);
    }
  }, [currentProgram]);
  
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

};

ProgramSelector.propTypes = {
  handler: PropTypes.func.isRequired,
  currentProgram: PropTypes.string
};

export default React.memo(ProgramSelector);