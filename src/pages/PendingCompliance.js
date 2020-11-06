import React, { useEffect, useState, useCallback } from "react";
import { Link } from "@reach/router";
//import { CSVLink } from "react-csv";
import PropTypes from "prop-types";

import { /*useSelector, */useDispatch } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { setRetain } from "../redux/slices/filterSlice";

import PendingComplianceTable from "../components/Compliance/PendingComplianceTable";
import AreYouSure from "../components/Utility/AreYouSure";
//import Loading from "../components/Utility/Loading";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

//mockdata
import { pendingComplianceItems } from "../assets/mockdata/dataGenerator";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PendingCompliance = ({ handleFiltersClosed, itemId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [itemSelected, setItemSelected] = useCallback(useState(false));
  const [confirmOpen, setConfirmOpen] = useCallback(useState(false));

  const handleOpenConfirm = useCallback(() => {
    //TODO
    setConfirmOpen(true)
  }, [setConfirmOpen])

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
  }, [setConfirmOpen])

  const handleCancelOrders = useCallback(() => {
    //TODO
    setConfirmOpen(false);
    console.log("cancelling!")
  }, [setConfirmOpen])

  //const currentOrderItems = useSelector((state) => state.complianceItems.orderItems);
  //const currentOrderItemId = useSelector((state) => state.complicanceItems.orderItemId);
  //const currentSelectedOrderItems = useSelector((state) => state.complianceItems.selectedOrderItems);
  //const currentUserRole = useSelector((state) => state.user.role);
  //const isLoading = useSelector((state) => state.complianceItems.isLoading);

  // const handleSort = (sortObject) => {
  //   dispatch(
  //     updateMultipleFilters({
  //       filterObject: {
  //         sortOrder: sortObject.order,
  //         sortOrderBy: sortObject.orderBy,
  //       },
  //     })
  //   );
  //   dispatch(setSorted());
  // };

  useRetainFiltersOnPopstate("/purchasing/poRollup", dispatch)

  // useEffect(() => {
  //   if ((currentOrderItems.length === 0 || currentOrderItemId !== itemId) && currentUserRole.length > 0) {
  //     dispatch(fetchPendingComplianceItems(itemId))
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (isLoading || !currentOrderItemId) {
  //   return <Loading />;
  // }

  return (
    <>
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
                  dispatch(setRetain({value: true}));
                }}
              >
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
            <Typography
              className={classes.titleText}
              style={{ marginTop: "5px" }}
            >
              {`Order Item ${window.location.hash}`}
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
              disabled={!itemSelected}
              style={{ marginRight: "20px" }}
              onClick={() => {
                handleOpenConfirm()
              }}
            >
              CANCEL ORDER
            </Button>
            <Tooltip title="Print Order">
              <IconButton>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
              <IconButton>
                <GetAppIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <br />
        <br />
        <PendingComplianceTable
          items={pendingComplianceItems}
          itemsLoading={false}
          //handleSort={handleSort}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
        />
        <br />
      </Container>
    </>
  )
}

PendingCompliance.propTypes = {
  itemId: PropTypes.string,
  handleFiltersClosed: PropTypes.func.isRequired
}

export default PendingCompliance;
