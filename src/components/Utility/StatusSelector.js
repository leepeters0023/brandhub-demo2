import React, {useEffect} from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

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
  const historyStatusList = [
    { status: "inactive", label: "Not Started" },
    { status: "in-progress", label: "In Progress" },
    { status: "submitted", label: "Submitted" },
    { status: "all", label: "All Orders" },
  ];
  const complianceStatusList = [
    { status: "approved", label: "Approved" },
    { status: "denied", label: "Denied" },
    { status: "pending", label: "Pending" },
    { status: "all", label: "All Status" },
  ];
  const rfqStatusList = [
    { status: "awarded", label: "Awarded" },
    { status: "ready", label: "Ready for Review" },
    { status: "pending", label: "Waiting for Resp." },
    { status: "all", label: "All Status" },
  ];
  const poStatusList = [
    { status: "in-progress", label: "In Progress" },
    { status: "complete", label: "Complete" },
    { status: "canceled", label: "Canceled" },
    { status: "all", label: "All Status" },
  ];

  const lableMap = {
    history: "Order Status",
    compliance: "Item Status",
    rfq: "RFQ Status",
    po: "PO Status",
  };

  const currentStatus = useSelector((state) => state.filters.status);

  const handleChangeSelect = (evt) => {
    setStatus(evt.target.value);
    handleStatus(evt.target.value, "status", filterType);
  };

  useEffect(() => {
    if (currentStatus !== status) {
      setStatus(currentStatus);
    }
  })

  return (
    <>
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        className={classes.queryField}
      >
        <InputLabel id="status-select">{lableMap[filterType]}</InputLabel>
        <Select
          label={lableMap[filterType]}
          name="status"
          labelId="status-select"
          id="status"
          value={status}
          onChange={handleChangeSelect}
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
        >
          {filterType === "history" &&
            historyStatusList.map((status, index) => (
              <MenuItem value={status.status} key={index}>
                <Typography variant="body2">{status.label}</Typography>
              </MenuItem>
            ))}
          {filterType === "compliance" &&
            complianceStatusList.map((status, index) => (
              <MenuItem value={status.status} key={index}>
                <Typography variant="body2">{status.label}</Typography>
              </MenuItem>
            ))}
          {filterType === "rfq" &&
            rfqStatusList.map((status, index) => (
              <MenuItem value={status.status} key={index}>
                <Typography variant="body2">{status.label}</Typography>
              </MenuItem>
            ))}
          {filterType === "po" &&
            poStatusList.map((status, index) => (
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
