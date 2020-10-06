import React, { useEffect } from "react";

import CurrentPO from "../components/SupplierManagement/CurrentPO";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrder = ({ handleFiltersClosed }) => {
  const classes = useStyles();

  /*
    TODO 
      * All purchase order details would be loaded and stored in purchase order slice
      * Loading state (<Loading /> component)
      * Editable fields will update purchase order state
  */

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Purchase Order #110012
          </Typography>
          <div
            style={{
              display: "flex",
              width: "250px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print Purchase Order">
              <IconButton>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </div>
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
          <CurrentPO />
          <br />
          <div>
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              style={{ marginRight: "10px" }}
            >
              SUBMIT
            </Button>
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              style={{ marginRight: "10px" }}
            >
              VOID
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PurchaseOrder;
