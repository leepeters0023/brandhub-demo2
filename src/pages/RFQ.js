import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

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
import { makeStyles } from "@material-ui/core/styles";

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

const BidCreation = ({ handleFiltersClosed }) => {
  const classes = useStyles();

  /*
    TODO 
      * All bid details would be loaded and stored in bid slice
      * Loading state (<Loading /> component)
      * Editable fields will update bid state
  */
  const [suppliersSelected, setSuppliersSelected] = useCallback(useState([]));
  
  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className={classes.mainWrapper}>
      <div className={classes.titleBar}>
        <Typography className={classes.titleText}>RFQ #110012</Typography>
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
        <CurrentRFQ />
        <br />
        <br />
        <Divider style={{ width: "75%", minWidth: "600px" }} />
        <br />
        {window.location.hash.includes("new") && (
          <>
            <RFQSupplierSentTable
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
            >
              SEND RFQ
            </Button>
          </>
        )}
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

BidCreation.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default BidCreation;
