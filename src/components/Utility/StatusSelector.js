import React from "react";
import PropTypes from "prop-types";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const StatusSelector = ({
  handleStatus,
  status,
  setStatus,
  classes,
  filterType,
}) => {
  const statusList = [
    { status: "inactive", label: "Not Started" },
    { status: "in-progress", label: "In Progress" },
    { status: "submitted", label: "Submitted" },
    { status: "all", label: "All Orders" },
  ];

  const handleChangeSelect = (evt) => {
    setStatus(evt.target.value);
    handleStatus(evt.target.value, "status", filterType);
  };

  return (
    <>
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        className={classes.queryField}
      >
        <InputLabel id="status-select">Order Status</InputLabel>
        <Select
          label="Order Status"
          name="status"
          labelId="status-select"
          id="status"
          value={status}
          onChange={handleChangeSelect}
        >
          {statusList.map((status, index) => (
            <MenuItem value={status.status} key={index}>
              <Typography variant="body2">{status.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

StatusSelector.propTypes = {
  handleStatus: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default StatusSelector;
