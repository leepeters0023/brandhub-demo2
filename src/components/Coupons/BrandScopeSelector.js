import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { updateCouponValue } from "../../redux/slices/couponSlice";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const BrandScopeSelector = ({ classes }) => {
  const dispatch = useDispatch();
  const [currentScope, setCurrentScope] = useState("single");

  return (
    <ButtonGroup fullWidth color="secondary" aria-label="brand-scope-selector">
      <Button
        className={
          currentScope === "single"
            ? classes.largeButton
            : classes.selectedButton
        }
        variant={currentScope === "single" ? "contained" : "outlined"}
        onClick={() => {
          setCurrentScope("single");
          dispatch(updateCouponValue({ key: "brandScope", value: "single" }));
        }}
      >
        SINGLE-BRAND
      </Button>
      <Button
        className={
          currentScope === "multi"
            ? classes.largeButton
            : classes.selectedButton
        }
        variant={currentScope === "multi" ? "contained" : "outlined"}
        onClick={() => {
          setCurrentScope("multi");
          dispatch(updateCouponValue({ key: "brandScope", value: "multi" }));
        }}
      >
        MULTI-BRAND
      </Button>
      <Button
        className={
          currentScope === "promotional"
            ? classes.largeButton
            : classes.selectedButton
        }
        variant={currentScope === "promotional" ? "contained" : "outlined"}
        onClick={() => {
          setCurrentScope("promotional");
          dispatch(
            updateCouponValue({ key: "brandScope", value: "promotional" })
          );
        }}
      >
        PROMOTIONAL
      </Button>
    </ButtonGroup>
  );
};

BrandScopeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default React.memo(BrandScopeSelector);
