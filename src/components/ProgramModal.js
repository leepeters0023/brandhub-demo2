import React from "react";

import ItemOptions from "./ItemOptions";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

//mockData
import distributors from "../assets/mockdata/distributors";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  programImage: {
    width: "90%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "50%",
  },
  dialogGrid: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  cartButton: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  headerCell: {
    padding: "0",
    height: "200px",
    width: "150px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
  },
}));

const ProgramModal = (props) => {
  const classes = useStyles();
  const {
    program: { name, imgUrl, desc, goals, timeframe },
    items,
    handleClose,
  } = props;

  return (
    <>
      <Grid container spacing={5} className={classes.dialogGrid}>
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        <Grid item md={3} style={{ textAlign: "center" }}>
          <img src={imgUrl} className={classes.programImage} alt={name} />
          <Typography className={classes.bodyText}>{timeframe}</Typography>
        </Grid>
        <Grid item md={9}>
          <Typography className={classes.headerText}>Description</Typography>
          <Typography className={classes.bodyText}>{desc}</Typography>
          <br />
          <Typography className={classes.headerText}>Goals</Typography>
          <Typography className={classes.bodyText}>{goals}</Typography>
        </Grid>
      </Grid>
      <br />
      <Divider />
      <br />
      <TableContainer className={classes.cartContainer}>
        <Table stickyHeader={true} size="small" aria-label="pre-order-table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.borderRight}>
                <div className={classes.colTitle}>
                  <Typography className={classes.headerText}>
                    Brand / Item
                  </Typography>
                </div>
              </TableCell>
              {items.map((item) => (
                <TableCell key={item.itemNumber}>
                  <div className={classes.headerCell}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography className={classes.headerText}>
                        {item.brand}
                      </Typography>
                      <ItemOptions />
                    </div>
                    <img
                      id={item.itemNumber}
                      className={classes.previewImg}
                      src={item.imgUrl}
                      alt={item.itemType}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {`${item.itemType} | ${item.itemNumber}`}
                    </Typography>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {distributors.map((dist) => (
              <TableRow key={dist.id}>
                <TableCell className={classes.borderRight}>
                  <div className={classes.colTitle}>
                    <Typography className={classes.headerText}>
                      {dist.name}
                    </Typography>
                  </div>
                </TableCell>
                {items.map((item) => (
                  <TableCell key={`${dist.name}-${item.itemNumber}`}>
                    <TextField
                      variant="outlined"
                      size="small"
                      id={`${dist.name}-${item.itemNumber}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <div className={classes.cartButton}>
        <Button
          className={classes.largeButton}
          color="primary"
          variant="contained"
        >
          ADD TO CART
        </Button>
      </div>
      <br />
      <br />
    </>
  );
};

export default ProgramModal;
