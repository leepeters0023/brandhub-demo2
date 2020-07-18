import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  previewImg: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    objectFit: "cover",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const OrderPreTableView = (props) => {
  const { currentItems, handlePreview } = props;
  const classes = useStyles();
  return (
    <div>
      <TableContainer className={classes.tableContainer}>
        <br />
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Monthly Pre Order
          </Typography>
        </div>
        <br />
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText}></TableCell>
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item Name
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Brand
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty / Item
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Cost
              </TableCell>
              <TableCell className={classes.headerText}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((row) => (
              <TableRow key={row.itemNumber} hover>
                <TableCell component="th" scope="row">
                  <IconButton>
                    <StarBorderIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="left">
                  <img
                    id={row.itemNumber}
                    className={classes.previewImg}
                    src={row.imgUrl}
                    alt={row.itemType}
                    onClick={handlePreview}
                  />
                </TableCell>
                <TableCell align="left">{`${row.brand} ${row.itemType}`}</TableCell>
                <TableCell align="left">{row.itemNumber}</TableCell>
                <TableCell align="left">{row.brand}</TableCell>
                <TableCell align="left">{row.qty}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    id={`${row.itemNumber}`}
                  >
                    <Tooltip title="Add to Cart">
                      <AddShoppingCartIcon color="secondary" />
                    </Tooltip>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderPreTableView;
