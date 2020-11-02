import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { fetchSingleRFQ, sendBids } from "../redux/slices/rfqSlice";
import { fetchAllSuppliers } from "../redux/slices/supplierSlice";

import { setRetain } from "../redux/slices/filterSlice";

import Loading from "../components/Utility/Loading";
import CurrentRFQ from "../components/SupplierManagement/CurrentRFQ";
import RFQSupplierSentTable from "../components/SupplierManagement/RFQSupplierSentTable";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const mockSupplierData = [
  {
    name: "Imperial",
    quotedCost: "$5.99",
    note:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius hendrerit eros, non rhoncus ante.",
  },
  {
    name: "Sterling",
    quotedCost: "6.99",
    note:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius hendrerit eros, non rhoncus ante.",
  },
  {
    name: "Curtis",
    quotedCost: "5.50",
    note:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius hendrerit eros, non rhoncus ante.",
  },
];

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

  const isRFQLoading = useSelector((state) => state.rfq.isLoading);
  const currentRFQ = useSelector((state) => state.rfq.currentRFQ);
  const currentSuppliers = useSelector((state) => state.suppliers.supplierList);
  const isSuppliersLoading = useSelector((state) => state.suppliers.isLoading);

  const handleSendBids = () => {
    dispatch(sendBids(suppliersSelected, currentRFQ.id))
  }

  useRetainFiltersOnPopstate("/purchasing/rfqRollup", dispatch);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentSuppliers.length === 0) {
      dispatch(fetchAllSuppliers());
    }
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
  });

  if (isRFQLoading || !currentRFQ.id) {
    return <Loading />;
  }

  return (
    <Container className={classes.mainWrapper}>
      <div className={classes.titleBar}>
        {!isNew && (
          <div className={classes.titleImage}>
            <Tooltip title="Back to RFQ History" placement="bottom-start">
              <IconButton
                component={Link}
                to="/purchasing/rfqHistory"
                onClick={() => {
                  dispatch(setRetain({ value: true }));
                }}
              >
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
            <Typography
              className={classes.titleText}
            >{`RFQ #${currentRFQ.id}`}</Typography>
          </div>
        )}
        {isNew && (
          <Typography
            className={classes.titleText}
          >{`RFQ #${currentRFQ.id}`}</Typography>
        )}
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

        <RFQSupplierSentTable
          currentSuppliers={currentSuppliers}
          isLoading={isSuppliersLoading}
          suppliersSelected={suppliersSelected}
          setSuppliersSelected={setSuppliersSelected}
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

        {!window.location.hash.includes("new") && (
          <TableContainer
            className={classes.tableContainer}
            style={{ width: "75%", minWidth: "600px" }}
          >
            <Typography
              className={classes.titleText}
              style={{ marginLeft: "20px" }}
            >
              Current Bids:
            </Typography>
            <br />
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headerText} align="left">
                    Supplier
                  </TableCell>
                  <TableCell className={classes.headerText} align="left">
                    Quoted Cost
                  </TableCell>
                  <TableCell className={classes.headerText} align="left">
                    Note
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {mockSupplierData.map((sup) => (
                  <TableRow key={sup.name}>
                    <TableCell align="left">{sup.name}</TableCell>
                    <TableCell align="left">{sup.quotedCost}</TableCell>
                    <TableCell align="left">{sup.note}</TableCell>
                    <TableCell align="right">
                      <Button
                        className={classes.largeButton}
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: "20px" }}
                      >
                        AWARD
                      </Button>
                      <Button
                        className={classes.largeButton}
                        variant="contained"
                        color="secondary"
                      >
                        PO
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
