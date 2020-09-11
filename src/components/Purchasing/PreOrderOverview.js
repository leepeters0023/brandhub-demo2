import React from 'react'

import { useSelector, useDispatch } from "react-redux";

import { setProgStatus } from "../../redux/slices/patchOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import PreOrderConfirmationTable from "./PreOrderConfirmationTable";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PreOrderOverview = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const preOrder = useSelector((state) => state.programTable);

  const handleEditOrder = () => {
    dispatch(setProgStatus(preOrder.programId, "in-progress", preOrder.preOrderId))
  }

  return (
    <>
      <Grid container spacing={5}>
          <Grid item lg={9} sm={12} xs={12}>
            <Typography className={classes.headerText}>
              Pre-Order Overview:
            </Typography>
            <Divider />
            <br />
            <PreOrderConfirmationTable orders={preOrder.orders} items={preOrder.items} />
          </Grid>
          <Grid item lg={3} sm={12} xs={12}>
            <Typography className={classes.headerText}>
              Pre-Order Summary:
            </Typography>
            <Divider />
            <br />
            <div
            style={{
              display: "flex",
              width: "100px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print Order">
              <IconButton>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export PDF">
              <IconButton>
                <PictureAsPdfIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </div>
          <br />
            <Typography className={classes.headerText}>
              {`Total Items: ${preOrder.items
                .map((item) => item.totalItems)
                .reduce((a, b) => a + b)}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Cost: ${formatMoney(preOrder.programTotal)}`}
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              {`Order Notes: ${preOrder.preOrderNote}`}
            </Typography>
            <br />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEditOrder}
            >
              EDIT ORDER
            </Button>
            <br />
          </Grid>
        </Grid>
    </>
  )
}

export default PreOrderOverview;
