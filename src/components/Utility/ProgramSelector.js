import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckIcon from "@material-ui/icons/Check";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ProgramSelector = ({ handler, currentProgram }) => {
  const classes = useStyles();

  const [program, updateProgram] = useState("");
  const currentPrograms = useSelector((state) => state.programs.programs);
  const handleChangeSelect = (evt) => {
    evt.stopPropagation();
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
      <FormControl
        aria-label="program-selector"
        style={{ margin: "0 5px", width: "400px" }}
        size="small"
      >
        <Select
          variant="outlined"
          name="programs"
          labelId="program-select"
          id="programs"
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
          value={program}
          onChange={handleChangeSelect}
          onFocus={(evt) => evt.stopPropagation()}
          onBlur={(evt) => evt.stopPropagation()}
          onClose={(evt) => evt.stopPropagation()}
        >
          {currentPrograms.map((program, index) => (
            <MenuItem value={program.id} key={index}>
              {program.status !== "inactive" ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    className={classes.headerText}
                    style={{ overflow: "hidden" }}
                  >
                    {`${program.brand.length === 1 ? program.brand[0] : "Multi Brand"} - ${program.name}`}
                  </Typography>
                  {(program.status === "submitted" || program.status === "approved") && (
                    <Tooltip title="Submitted">
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: "5px" }}
                      />
                    </Tooltip>
                  )}
                  {program.status === "complete" && (
                    <Tooltip title="Saved for Review">
                      <CheckIcon
                        color="secondary"
                        style={{ marginLeft: "5px" }}
                      />
                    </Tooltip>
                  )}
                  {program.status === "in-progress" && (
                    <Tooltip title="In Progress">
                      <MoreHorizIcon
                        color="secondary"
                        style={{ marginLeft: "5px" }}
                      />
                    </Tooltip>
                  )}
                </div>
              ) : (
                <Typography className={classes.headerText}>
                  {`${program.brand.length === 1 ? program.brand[0] : "Multi Brand"} - ${program.name}`}
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
  currentProgram: PropTypes.string,
};

export default React.memo(ProgramSelector);
