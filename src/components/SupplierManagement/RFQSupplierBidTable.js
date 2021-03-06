import React from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import { formatMoney } from "../../utility/utilityFunctions";

import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

const RFQSupplierBidTable = ({ bids, classes, handleAward }) => {
  const currrentSuppliers = useSelector(
    (state) => state.suppliers.supplierList
  );
  const rfqStatus = useSelector((state) => state.rfq.currentRFQ.stats);

  if (currrentSuppliers.length === 0) {
    return <CircularProgress />;
  }

  return (
    <TableContainer
      className={classes.tableContainer}
      style={{ width: "75%", minWidth: "600px" }}
    >
      <Typography className={classes.titleText} style={{ marginLeft: "20px" }}>
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
          {bids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell align="left">
                {
                  currrentSuppliers.find((sup) => sup.id === bid.supplierId)
                    .name
                }
              </TableCell>
              {bid.status === "sent" && (
                <TableCell align="right" colSpan={3}>
                  Waiting for response
                </TableCell>
              )}
              {bid.status === "declined" && (
                <TableCell align="right" colSpan={3}>
                  Declined to place a bid
                </TableCell>
              )}
              {bid.status === "awarded" && (
                <>
                <TableCell align="left">
                  {bid.price && bid.price !== "---" ? formatMoney(bid.price, true) : "---"}
                </TableCell>
                <TableCell align="left">
                  {bid.note ? bid.note : "---"}
                </TableCell>
                <TableCell align="right">
                  AWARDED
                </TableCell>
              </>
              )}
              {bid.status === "accepted" && (
                <>
                  <TableCell align="left">
                    {bid.price && bid.price !== "---" ? formatMoney(bid.price, true) : "---"}
                  </TableCell>
                  <TableCell align="left">
                    {bid.note ? bid.note : "---"}
                  </TableCell>
                  <TableCell align="right">
                    <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "flex-end" }}>
                      <Button
                        className={classes.largeButton}
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: "20px" }}
                        onClick={() => handleAward(bid.id)}
                        disabled={rfqStatus === "awarded"}
                      >
                        AWARD
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

RFQSupplierBidTable.propTypes = {
  bids: PropTypes.array,
  handleAward: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default React.memo(RFQSupplierBidTable);