import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  buttonGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
}));

const ComplianceModal = (props) => {
  const { id, handleClose } = props;
  let idString = id.split("-")[0];
  let sequenceString = id.split("-")[1];
  const classes = useStyles();

  return (
    <>
      <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
      <Typography className={classes.headerText}>
        {`Approval Id: ${idString}  POS Spirits`}
      </Typography>
      <Typography className={classes.headerText}>
        {`Compliance Attribute(s):   SequenceNumber: ${sequenceString}`}
      </Typography>
      <br />
      <br />
      <Grid container spacing={5} justify="space-around">
        <Grid item md={3} className={classes.preview}>
          <img
            src="https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg"
            alt="sample"
          />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item md={8}>
          <TableContainer className={classes.TableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left" className={classes.headerText}>
                    States
                  </TableCell>
                  <TableCell align="left" className={classes.headerText}>
                    Submitted
                  </TableCell>
                  <TableCell align="left" className={classes.headerText}>
                    Approved
                  </TableCell>
                  <TableCell align="left" className={classes.headerText}>
                    Declined
                  </TableCell>
                  <TableCell align="left" className={classes.headerText}>
                    Qty Pending
                  </TableCell>
                  <TableCell align="left" className={classes.headerText}>
                    Qty Ordered
                  </TableCell>
                  <TableCell align="left" className={classes.headerText}>
                    Notified Date
                  </TableCell>
                  <TableCell align="left" className={classes.headerText}>
                    Reset Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Select All:</TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">---</TableCell>
                  <TableCell align="center">---</TableCell>
                  <TableCell align="center">---</TableCell>
                  <TableCell align="center">---</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Indiana</TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">7/20/2020</TableCell>
                  <TableCell align="center">---</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>North Carolina</TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">300</TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">7/20/2020</TableCell>
                  <TableCell align="center">---</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Virginia</TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">7/20/2020</TableCell>
                  <TableCell align="center">---</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>West Virginia</TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox />
                  </TableCell>
                  <TableCell align="center">50</TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">7/20/2020</TableCell>
                  <TableCell align="center">---</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br/>
          <br/>
          <Grid container spacing={5} justify="space-around">
            <Grid item md={8}>
              <Typography className={classes.headerText}>Comments:</Typography>
              <br />
              <TextField
                multiline
                fullWidth
                variant="outlined"
                size="small"
                rows="5"
              />
            </Grid>
            <Grid item md={4} className={classes.buttonGrid}>
              <Button className={classes.largeButton} color="primary" variant="contained">
                SAVE
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ComplianceModal;
