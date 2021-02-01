import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@reach/router";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";
import { useReactToPrint } from "react-to-print";

import { setRetain } from "../redux/slices/filterSlice";
import { fetchTriggeredRulesByOrders } from "../redux/slices/complianceItemsSlice";
import { complianceCancelOrderItems } from "../redux/slices/patchOrderSlice";

import PendingComplianceTable from "../components/Compliance/PendingComplianceTable";
import AreYouSure from "../components/Utility/AreYouSure";
import Loading from "../components/Utility/Loading";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PendingCompliance = ({ handleFiltersClosed, orderIds }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const tableRef = useRef(null);

  const [confirmOpen, setConfirmOpen] = useCallback(useState(false));
  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });

  const currentOrderItems = useSelector(
    (state) => state.complianceItems.pendingOrderItems
  );
  const currentSelectedItems = useSelector(
    (state) => state.complianceItems.selectedItems
  );
  const currentUserRole = useSelector((state) => state.user.role);
  const isLoading = useSelector((state) => state.complianceItems.isLoading);

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleOpenConfirm = useCallback(() => {
    setConfirmOpen(true);
  }, [setConfirmOpen]);

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
  }, [setConfirmOpen]);

  const handleCancelOrders = useCallback(() => {
    dispatch(complianceCancelOrderItems(currentSelectedItems));
    setConfirmOpen(false);
  }, [setConfirmOpen, currentSelectedItems, dispatch]);

  useRetainFiltersOnPopstate("/purchasing/poRollup", dispatch);

  useEffect(() => {
    if (
      currentOrderItems.length > 0 &&
      currentCSV.data.length === 0 &&
      orderIds.split(",").length === currentOrderItems.length
    ) {
      let csvHeaders = [
        { label: "State", key: "state" },
        { label: "Person", key: "user" },
        { label: "Distributor", key: "distributor" },
        { label: "Total Items", key: "totalItems" },
        { label: "Rule", key: "rule" },
      ];
      let csvData = [];
      currentOrderItems.forEach((item) => {
        csvData.push({
          state: item.state,
          user: item.user,
          distributor: item.distributor,
          totalItems: item.isComplianceCanceled ? "Canceled" : item.totalItems,
          rule:
            item.triggeredRules.length > 0 &&
              item.triggeredPriorApprovalRules.length > 0
              ? item.triggerdRules.join(", ") +
              ", " +
              item.triggeredPriorApprovalRules.join(", ")
              : item.triggeredRules.length > 0
                ? item.triggeredRules.join(", ")
                : item.triggeredPriorApprovalRules.length > 0
                  ? item.triggeredPriorApprovalRules.join(", ")
                  : "---",
        });
      });
      setCurrentCSV({ data: csvData, headers: csvHeaders });
    }
  }, [currentOrderItems, currentCSV.data, orderIds]);

  useEffect(() => {
    if (currentUserRole.length > 0) {
      dispatch(fetchTriggeredRulesByOrders(orderIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet><title>RTA | Pending complianceCancelOrderItems</title></Helmet>
      <AreYouSure
        open={confirmOpen}
        handleClose={handleCloseConfirm}
        handleRemove={handleCancelOrders}
        itemNumber={["1", "2"]}
        type="pendingCompliance"
      />
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div style={{ display: "flex", alignItems: "center" }}>
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
            <Typography
              className={classes.titleText}
              style={{ marginTop: "5px" }}
            >
              {`Pending Compliance for Order Item ${window.location.hash}`}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              width: "350px",
              height: "48px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              disabled={currentSelectedItems.length === 0}
              style={{ marginRight: "20px" }}
              onClick={() => {
                handleOpenConfirm();
              }}
            >
              CANCEL ORDER
            </Button>
            <Tooltip title="Print Pending Compliance Items">
              <IconButton onClick={handlePrint}>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export File">
              <CSVLink
                data={currentCSV.data}
                headers={currentCSV.headers}
                style={{ textDecoration: "none" }}
              >
                <IconButton>
                  <GetAppIcon color="secondary" />
                </IconButton>
              </CSVLink>
            </Tooltip>
          </div>
        </div>
        <br />
        <br />
        {currentOrderItems.length > 0 && (
          <PendingComplianceTable
            items={currentOrderItems}
            itemsLoading={isLoading}
            tableRef={tableRef}
          />
        )}
        <br />
      </Container>
      <OrderPatchLoading />
    </>
  );
};

PendingCompliance.propTypes = {
  itemId: PropTypes.string,
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default PendingCompliance;
