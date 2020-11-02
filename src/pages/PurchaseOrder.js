import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import CurrentPO from "../components/SupplierManagement/CurrentPO";
import ShippingParameter from "../components/SupplierManagement/ShippingParameter";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";

import PublishIcon from "@material-ui/icons/Publish";

//mock data
import { singlePO, shippingParams } from "../assets/mockdata/dataGenerator";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrder = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [shippingOption, setShippingOption] = useState("direct");

  const handleRadioChange = (event) => {
    setShippingOption(event.target.value);
    //TODO update in redux
  };

  /*
    TODO 
      * All purchase order details would be loaded and stored in purchase order slice
      * Loading state (<Loading /> component)
      * Editable fields will update purchase order state
  */

  useRetainFiltersOnPopstate("/purchasing/poRollup", dispatch);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Purchase Order #110012
          </Typography>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              <Tooltip title="Upload File">
                <IconButton>
                  <PublishIcon fontSize="large" color="inherit" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <br />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CurrentPO purchaseOrderItems={singlePO} />
          {window.location.hash.includes("new") && (
            <div>
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
              >
                SUBMIT PURCHASE ORDER
              </Button>
            </div>
          )}
          <br />
          <br />
          <div
            style={{
              width: "75%",
              minWidth: "1000px",
              padding: "10px 20px",
            }}
          >
            <div className={classes.titleBar}>
              <Typography className={classes.titleText}>
                Shipping Info
              </Typography>
              <div className={classes.configButtons}>
                <div className={classes.innerConfigDiv}>
                  <RadioGroup
                    aria-label="shipping-options"
                    name="shipping-options"
                    value={shippingOption}
                    onChange={handleRadioChange}
                    row
                  >
                    <FormControlLabel
                      value="direct"
                      control={<Radio />}
                      label="Direct Ship"
                    />
                    <FormControlLabel
                      value="cdc"
                      control={<Radio />}
                      label="Ship to CDC"
                    />
                  </RadioGroup>
                </div>
              </div>
            </div>
            <br />
            <br />
            {shippingParams.map((param) => (
              <div key={param.id}>
                <ShippingParameter classes={classes} shippingInfo={param} />
                <br />
                <br />
              </div>
            ))}
          </div>
          <br />
          <Button
            className={classes.largeButton}
            variant="contained"
            color="secondary"
          >
            SUBMIT SHIPPING PARAMS
          </Button>
        </div>
        <br />
        <br />
      </Container>
    </>
  );
};

PurchaseOrder.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default PurchaseOrder;
