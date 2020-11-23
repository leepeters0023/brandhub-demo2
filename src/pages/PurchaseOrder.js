import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { setRetain } from "../redux/slices/filterSlice";
import { fetchSinglePO } from "../redux/slices/purchaseOrderSlice";

import CurrentPO from "../components/SupplierManagement/CurrentPO";
import Loading from "../components/Utility/Loading";
import ShippingParameterTable from "../components/SupplierManagement/ShippingParameterTable";

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
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

//mock data
import { shippingParams } from "../assets/mockdata/dataGenerator";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrder = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [shippingOption, setShippingOption] = useState("direct");
  const [isNew, setIsNew] = useState(false);

  const isPOLoading = useSelector((state) => state.purchaseOrder.isLoading);
  const currentPO = useSelector((state) => state.purchaseOrder.currentPO);

  const handleRadioChange = (event) => {
    setShippingOption(event.target.value);
    //TODO update in redux
  };

  useRetainFiltersOnPopstate("/purchasing/poRollup", dispatch);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPO.id && !isPOLoading && window.location.hash === "#new") {
      console.log("hash update");
      window.location.hash = currentPO.id;
      setIsNew(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPO.id]);

  useEffect(() => {
    if (!currentPO.id && window.location.hash !== "#new") {
      dispatch(fetchSinglePO(window.location.hash.slice(1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (currentPO.id && window.location.hash !== "#new" && currentPO.id !== window.location.hash.slice(1)) {
  //     dispatch(fetchSinglePO(window.location.hash.slice(1)));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (isPOLoading) {
    return <Loading />;
  }

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            {!isNew && (
              <Tooltip title="Back to PO History" placement="bottom-start">
                <IconButton
                  component={Link}
                  to="/purchasing/poHistory#current"
                  onClick={() => {
                    dispatch(setRetain({ value: true }));
                  }}
                >
                  <ArrowBackIcon fontSize="large" color="secondary" />
                </IconButton>
              </Tooltip>
            )}
            {isNew && (
              <Tooltip title="Back to PO Rollup" placement="bottom-start">
                <IconButton
                  component={Link}
                  to="/purchasing/poRollup"
                  onClick={() => {
                    dispatch(setRetain({ value: true }));
                  }}
                >
                  <ArrowBackIcon fontSize="large" color="secondary" />
                </IconButton>
              </Tooltip>
            )}
            <Typography className={classes.titleText}>
              {`Purchase Order #${currentPO.id}`}
            </Typography>
          </div>
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
          <CurrentPO currentPO={currentPO} />

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
            <ShippingParameterTable
              classes={classes}
              shippingInfo={shippingParams}
            />
            <br />
            <br />
          </div>
          {(window.location.hash.includes("new") ||
            currentPO.status === "draft") && (
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
            >
              SUBMIT PURCHASE ORDER
            </Button>
          )}
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
