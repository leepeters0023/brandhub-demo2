import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CurrentBid from "../components/SupplierManagement/CurrentBid";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
    price: "$5.99",
    note:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius hendrerit eros, non rhoncus ante.",
  },
  {
    name: "Sterling",
    price: "6.99",
    note:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius hendrerit eros, non rhoncus ante.",
  },
  {
    name: "Curtis",
    price: "5.50",
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

  const [checked, setChecked] = useState({
    imperial: false,
    sterling: false,
    curtis: false,
  });

  const handleSupplierCheck = (event) => {
    if (event.target.name !== "all") {
      setChecked({ ...checked, [event.target.name]: event.target.checked });
    } else {
      if (imperial && sterling && curtis) {
        setChecked({
          imperial: false,
          sterling: false,
          curtis: false,
        });
      } else {
        setChecked({
          imperial: true,
          sterling: true,
          curtis: true,
        });
      }
    }
  };

  const { imperial, sterling, curtis } = checked;

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
        <CurrentBid />
        <br />
        <br />
        <Divider style={{ width: "75%", minWidth: "600px" }} />
        <br />
        {window.location.hash.includes("new") && (
          <Grid
            container
            spacing={5}
            style={{ width: "75%", minWidth: "600px" }}
            alignItems="flex-end"
          >
            <Grid item sm={4} className={classes.controlGrid}>
              <FormControl component="fieldset">
                <FormLabel compent="legend" className={classes.headerText}>
                  Select Suppliers:
                </FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={imperial}
                        onChange={handleSupplierCheck}
                        name="imperial"
                      />
                    }
                    label="Imperial"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sterling}
                        onChange={handleSupplierCheck}
                        name="sterling"
                      />
                    }
                    label="Sterling"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={curtis}
                        onChange={handleSupplierCheck}
                        name="curtis"
                      />
                    }
                    label="Curtis"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={curtis && sterling && imperial}
                        onChange={handleSupplierCheck}
                        name="all"
                      />
                    }
                    label="All"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid
              item
              sm={4}
              className={classes.controlGrid}
              style={{ justifyContent: "center" }}
            >
              <TextField
                size="small"
                variant="outlined"
                label="Price"
                style={{ width: "150px" }}
              />
            </Grid>
            <Grid
              item
              sm={4}
              className={classes.controlGrid}
              style={{ justifyContent: "flex-end" }}
            >
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                style={{ marginRight: "10px" }}
              >
                SEND RFQ
              </Button>
            </Grid>
          </Grid>
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
                    Price
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
                    <TableCell align="left">{sup.price}</TableCell>
                    <TableCell align="left">{sup.note}</TableCell>
                    <TableCell align="right">
                      <Button
                        className={classes.largeButton}
                        variant="contained"
                        color="secondary"
                      >
                        AWARD
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
