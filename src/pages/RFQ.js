import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { fetchSingleRFQ, sendBids } from "../redux/slices/rfqSlice";

import { setRetain } from "../redux/slices/filterSlice";

import Loading from "../components/Utility/Loading";
import CurrentRFQ from "../components/SupplierManagement/CurrentRFQ";
import RFQAcceptOrDecline from "../components/SupplierManagement/RFQAcceptOrDecline";
import RFQSupplierSentTable from "../components/SupplierManagement/RFQSupplierSentTable";
import RFQSupplierBidTable from "../components/SupplierManagement/RFQSupplierBidTable";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  controlGrid: {
    display: "flex",
  },
}));

const RFQ = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [suppliersSelected, setSuppliersSelected] = useCallback(useState([]));
  const [isNew, setIsNew] = useState(false);
  const role = useSelector((state) => state.user.role);
  const isRFQLoading = useSelector((state) => state.rfq.isLoading);
  const currentRFQ = useSelector((state) => state.rfq.currentRFQ);
  const currentSuppliers = useSelector((state) => state.suppliers.supplierList);
  const isSuppliersLoading = useSelector((state) => state.suppliers.isLoading);

  const handleSendBids = () => {
    dispatch(sendBids(suppliersSelected, currentRFQ.id));
    setSuppliersSelected([]);
  };

  const handleAwardBid = (id) => {
    //TODO tie into api when available
    console.log(id);
  };

  const handleBidPO = (id) => {
    //TODO tie into api when available
    console.log(id);
  };

  useRetainFiltersOnPopstate("/purchasing/rfqRollup", dispatch);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentRFQ.id && !isRFQLoading && window.location.hash === "#new") {
      window.location.hash = currentRFQ.id;
      setIsNew(true);
    }
  }, [currentRFQ.id, isRFQLoading]);

  useEffect(() => {
    if (!currentRFQ.id && window.location.hash !== "#new") {
      dispatch(fetchSingleRFQ(window.location.hash.slice(1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isRFQLoading || !currentRFQ.id) {
    return <Loading />;
  }

  return (
    <Container role={role} className={classes.mainWrapper}>
      <div className={classes.titleBar}>
        <div className={classes.titleImage}>
          {!isNew && (
            <Tooltip title="Back to RFQ History" placement="bottom-start">
              <IconButton
                component={Link}
                to="/purchasing/rfqHistory/current"
                onClick={() => {
                  dispatch(setRetain({ value: true }));
                }}
              >
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
          )}
          {isNew && (
            <Tooltip title="Back to RFQ Rollup" placement="bottom-start">
              <IconButton
                component={Link}
                to="/purchasing/rfqRollup"
                onClick={() => {
                  dispatch(setRetain({ value: true }));
                }}
              >
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            className={classes.titleText}
          >{`RFQ #${currentRFQ.id}`}</Typography>
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
        <CurrentRFQ currentRFQ={currentRFQ} />
        <br />
        <br />
        <Divider style={{ width: "75%", minWidth: "600px" }} />
        <br />
        {role !== "supplier" && (
          <>
            {currentRFQ.bids.length !== currentSuppliers.length && (
              <>
                <RFQSupplierSentTable
                  currentSuppliers={currentSuppliers}
                  isLoading={isSuppliersLoading}
                  suppliersSelected={suppliersSelected}
                  setSuppliersSelected={setSuppliersSelected}
                  currentBids={currentRFQ.bids}
                />
                <br />
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: "10px" }}
                  disabled={suppliersSelected.length === 0}
                  onClick={handleSendBids}
                >
                  SEND RFQ
                </Button>
                <br />
              </>
            )}
            {currentRFQ.bids.length > 0 && (
              <RFQSupplierBidTable
                classes={classes}
                bids={currentRFQ.bids}
                handleAward={handleAwardBid}
                handlePO={handleBidPO}
              />
            )}
          </>
        )}
        {role === "supplier" && (
          <RFQAcceptOrDecline />
        )}
        <br />
      </div>
      <br />
      <br />
    </Container>
  );
};

RFQ.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default RFQ;
