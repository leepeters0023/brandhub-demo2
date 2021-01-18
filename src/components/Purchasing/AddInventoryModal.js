import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";
import { useNumberOnlyInput } from "../../hooks/InputHooks";

import { roundUp } from "../../utility/utilityFunctions";

import { createInventoryPO } from "../../redux/slices/purchaseOrderSlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const AddInventoryModal = ({ itemId, handleClose, open }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentWarehouse, setCurrentWarehouse] = useState("rapid");

  const currentItem = useSelector((state) =>
    state.items.items.find((item) => item.id === itemId)
  );

  const currentItemSupplier = useSelector((state) =>
    state.suppliers.supplierList.find(
      (sup) => sup.id === currentItem.supplierId
    )
  );

  const {
    value: qty,
    bind: bindQty,
    setValue: setQty,
    reset: resetQty,
  } = useNumberOnlyInput("0");

  //TODO add RFQ flow when items show up with correct supplier
  const handleAddInventory = () => {
    console.log(currentItem);
    dispatch(createInventoryPO(itemId, qty, currentWarehouse, currentItem.programIds[0]));
    resetQty();
    navigate("/purchasing/purchaseOrder#new");
  };

  useEffect(() => {
    if (currentItem.warehouse && currentItem.warehouse !== currentWarehouse) {
      setCurrentWarehouse(currentItem.warehouse);
    }
  }, [currentItem, currentWarehouse]);

  if (!itemId) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: "15000" }}
      >
        <DialogContent>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography className={classes.headerText}>
              {`${
                currentItemSupplier.name === "Select Print Buyer"
                  ? "Creating Request for Quote"
                  : "Creating Purchase Order "
              } for Item #${currentItem.itemNumber}`}
            </Typography>
            <br />
            {currentItem.warehouse ? (
              <Typography className={classes.bodyText}>{`Ship To: ${
                currentItem.warehouse === "rapid" ? "Rapid" : "Champion"
              }`}</Typography>
            ) : (
              <>
                <Typography className={classes.bodyText}>Ship To:</Typography>
                <ButtonGroup
                  orientation="horizontal"
                  fullWidth
                  color="secondary"
                  aria-label="warehouse-group"
                  disabled={currentItem.warehouse}
                >
                  <Button
                    className={
                      currentWarehouse === "rapid"
                        ? classes.largeButton
                        : classes.selectedButton
                    }
                    variant={
                      currentWarehouse === "rapid" ? "contained" : "outlined"
                    }
                    onClick={() => {
                      setCurrentWarehouse("rapid");
                    }}
                  >
                    RAPID
                  </Button>
                  <Button
                    className={
                      currentWarehouse === "champion"
                        ? classes.largeButton
                        : classes.selectedButton
                    }
                    variant={
                      currentWarehouse === "champion" ? "contained" : "outlined"
                    }
                    onClick={() => {
                      setCurrentWarehouse("champion");
                    }}
                  >
                    CHAMPION
                  </Button>
                </ButtonGroup>
              </>
            )}
            <br />
            <TextField
              fullWidth
              variant="outlined"
              color="secondary"
              name="qty"
              type="text"
              label="Quantity"
              {...bindQty}
              onBlur={(evt) => {
                if (
                  parseInt(evt.target.value) !== 0 &&
                  parseInt(evt.target.value) % currentItem.packSize !== 0
                ) {
                  let rounded = roundUp(
                    parseInt(evt.target.value),
                    currentItem.packSize
                  );
                  setQty(`${rounded}`);
                }
              }}
            />
            <br />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.largeButton}
              onClick={handleAddInventory}
            >
              SUBMIT
            </Button>
          </div>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

AddInventoryModal.propTypes = {
  itemId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default React.memo(AddInventoryModal);
