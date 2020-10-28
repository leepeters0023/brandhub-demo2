import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import clsx from "clsx";

import ItemAllocationTable from "./ItemAllocationTable";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const ShippingParameter = ({ classes, shippingInfo }) => {
  return (
    <Grid
      container
      spacing={3}
      style={{ width: "100%", minWidth: "1000px", backgroundColor: "#f2f2f2", margin: "0px"}}
    >
      <Grid item sm={6}>
        <div className={classes.fullHeightGridItem}>
          <Typography className={classes.titleText}>Ship To:</Typography>
          <br />
          <div>
            <Typography className={clsx(classes.headerText, classes.POText)}>
              Attention:
            </Typography>
            <Typography className={clsx(classes.headerText, classes.POText)}>
              Address:
            </Typography>
            <br />
            <TextField
              label="Label"
              color="secondary"
              multiline
              fullWidth
              variant="outlined"
              size="small"
              rows="4"
            />
          </div>
        </div>
      </Grid>
      <Grid item sm={6}>
        <div className={classes.fullHeightGridItem}>
          <Typography className={classes.titleText}>
            Shipping Detail:
          </Typography>
          <br />
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                color="secondary"
                className={classes.dateField}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id={`actualShip-${shippingInfo.id}`}
                label="Actual Ship"
                value={format(new Date(), "MM/dd/yyyy")}
                //onChange={(value) => handleFilters(value, "toDate")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <br />
            <Typography className={clsx(classes.headerText, classes.POText)}>
              Carrier:
            </Typography>
            <Typography className={clsx(classes.headerText, classes.POText)}>
              Method:
            </Typography>
          </div>
        </div>
      </Grid>
      <Grid item sm={12}>
        <ItemAllocationTable
          classes={classes}
          allocations={shippingInfo.items}
        />
      </Grid>
    </Grid>
  );
};

ShippingParameter.propTypes = {
  classes: PropTypes.object.isRequired,
  shippingInfo: PropTypes.object.isRequired,
};

export default React.memo(ShippingParameter);
