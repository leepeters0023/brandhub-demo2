import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { addItem, addItems } from "../../redux/slices/programTableSlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const AddItemConfirmation = (props) => {
  const classes = useStyles();
  const { itemArray, program, confirmOpen, handleConfirmClose } = props;
  const dispatch = useDispatch();

  const [processing, setProcessing] = useState(true);
  const [itemsToAdd, setItemsToAdd] = useState([]);
  const [noItems, setNoItems] = useState(false);

  const currentItems = useSelector(
    (state) => state.programTable.programs[`${program}`].items
  );

  useEffect(() => {
    if (confirmOpen) {
      const newItemArray = [...itemArray];
      if (Object.keys(currentItems).length > 0) {
        let currentItemNums = Object.keys(currentItems);
        let filteredItems = [];
        newItemArray.forEach((item) => {
          if (!currentItemNums.includes(item.itemNumber)) {
            filteredItems.push(item);
          }
        });

        filteredItems.length > 1
      ? dispatch(addItems({ program, items: filteredItems }))
      : filteredItems.length === 1
      ? dispatch(addItem({ program, item: filteredItems[0] }))
      : setNoItems(true);

        setItemsToAdd(filteredItems);
      } else {
        newItemArray.length > 1
      ? dispatch(addItems({ program, items: newItemArray }))
      : newItemArray.length === 1
      ? dispatch(addItem({ program, item: newItemArray[0] }))
      : setNoItems(true);

        setItemsToAdd([...newItemArray]);
      }
      
      setProcessing(false);
      return () => setNoItems(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmOpen]);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        fullWidth
        maxWidth="sm"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DialogContent>
          <IconButton
            className={classes.closeButton}
            onClick={handleConfirmClose}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <br />
          {processing && <CircularProgress />}
          {noItems && (
            <>
              <Typography className={classes.headerText}>
                You've already added this to your order.
              </Typography>
            </>
          )}
          {!noItems && (
            <>
              <Typography className={classes.headerText}>
                {itemsToAdd.length > 1
                  ? "Items successfully added to your order"
                  : "Item successfully added to your order"}
              </Typography>
            </>
          )}
          <br />
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

AddItemConfirmation.propTypes = {
  itemArray: PropTypes.array.isRequired,
  program: PropTypes.string.isRequired,
  confirmOpen: PropTypes.bool.isRequired,
  handleConfirmClose: PropTypes.func.isRequired,
};

export default React.memo(AddItemConfirmation, (prev, next) => {
  return (
    prev.itemArray.length === next.itemArray.length &&
    prev.program === next.program &&
    prev.confirmOpen === next.confirmOpen
  );
});
