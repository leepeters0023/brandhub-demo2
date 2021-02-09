import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const RuleTypeSelector = ({
  handleRuleType,
  ruleType,
  setType,
  classes,
  filterType,
}) => {
  const ruleTypes = [
    { id: "all", label: "All" },
    { id: "prior-approval", label: "Prior Approval" },
    { id: "coupon-prior-approval", label: "Coupon Prior Approval" },
    { id: "internal-approval", label: "Internal Approval" },
    { id: "item-type", label: "Item Type" },
    { id: "metal-wood", label: "Metal / Wood" },
    { id: "price", label: "Pricing" },
    { id: "coupon-offer-type", label: "Coupon Offer Type" },
    { id: "coupon-item-type", label: "Coupon Item Type" },
    { id: "coupon-face-value", label: "Coupon Face Value" },
  ];

  const currentRuleType = useSelector((state) => state.filters.ruleType);

  const handleChangeSelect = (evt) => {
    setType(evt.target.value);
    handleRuleType(evt.target.value, "ruleType", filterType);
  };

  useEffect(() => {
    if (ruleType !== currentRuleType) {
      setType(currentRuleType);
    }
  });

  return (
    <>
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        className={classes.queryField}
      >
        <InputLabel id="ruleType-select">Rule Type</InputLabel>
        <Select
          label={"Rule Type"}
          name="ruleType"
          labelId="ruleType-select"
          id="ruleType"
          value={ruleType}
          onChange={handleChangeSelect}
          MenuProps={{
            style: { zIndex: "2500" },
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
          {ruleTypes.map((ruleType, index) => (
            <MenuItem value={ruleType.id} key={index}>
              <Typography variant="body2">{ruleType.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

RuleTypeSelector.propTypes = {
  handleRuleType: PropTypes.func.isRequired,
  ruleType: PropTypes.string.isRequired,
  setType: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default RuleTypeSelector;
