import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import { useSelector, useDispatch } from "react-redux";

import {
  updateSelection,
  updateCurrentWarehouse,
} from "../../redux/slices/currentOrderSlice";
import { fetchNextFilteredItems } from "../../redux/slices/itemSlice";

import BottomScrollListener from "react-bottom-scroll-listener";
import ImageWrapper from "../Utility/ImageWrapper";
import Loading from "../Utility/Loading";

import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.itemGrid,
}));

const OrderItemGridView = (props) => {
  const {
    type,
    currentItems,
    handlePreview,
    setCurrentItemAdded,
    isItemsLoading,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const formattedType = `selected${type[0].toUpperCase() + type.slice(1)}Items`;

  const selectedItems = useSelector(
    (state) => state.currentOrder[formattedType]
  );
  const currentOrderItems = useSelector(
    (state) => state.currentOrder[`${type}OrderItems`]
  );
  const currentWarehouse = useSelector(
    (state) => state.currentOrder.currentWarehouse
  );
  const inStockOrderItems = useSelector(
    (state) => state.currentOrder.inStockOrderItems
  );
  const nextLink = useSelector((state) => state.items.nextLink);
  const isNextLoading = useSelector((state) => state.items.isNextLoading);
  const currentUserRole = useSelector((state) => state.user.role);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      dispatch(fetchNextFilteredItems(nextLink));
    }
  };

  const handleClick = (_event, id, warehouse) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
      if (
        !currentWarehouse &&
        type === "inStock" &&
        inStockOrderItems.length === 0
      ) {
        dispatch(updateCurrentWarehouse({ warehouse: warehouse }));
      }
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      );
    }
    if (
      newSelected.length === 0 &&
      type === "inStock" &&
      inStockOrderItems.length === 0
    ) {
      dispatch(updateCurrentWarehouse({ warehouse: null }));
    }
    dispatch(
      updateSelection({ type: formattedType, selectedItems: newSelected })
    );
  };

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  if (isItemsLoading) {
    return <Loading />;
  }

  return (
    <BottomScrollListener
      onBottom={handleBottomScroll}
      offset={100}
      debounce={0}
    >
      {(gridRef) => (
        <Container className={classes.mainWrapper}>
          <br />
          <Grid
            container
            spacing={10}
            className={classes.itemGridContainer}
            style={{
              height: "Calc(100% + 50px)",
              maxHeight: "Calc(100vh - 250px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            ref={gridRef}
          >
            {currentItems.length === 0 && (
              <Typography className={classes.headerText}>
                {`There are no items that match the current search criteria..`}
              </Typography>
            )}
            {currentItems.length > 0 &&
              currentItems.map((item, index) => {
                const isItemSelected =
                  currentUserRole !== "read-only" ? isSelected(item.id) : null;
                const labelId = `item-Checkbox-${index}`;

                return (
                  <Grid
                    className={classes.singleItem}
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    key={item.id}
                  >
                    <Paper className={classes.paperWrapper}>
                      <div className={classes.singleItemWrapper}>
                        {currentUserRole !== "read-only" && (
                          <Checkbox
                            className={classes.checkbox}
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            onClick={(event) => event.stopPropagation()}
                            disabled={
                              currentOrderItems.filter(
                                (i) => i.itemNumber === item.itemNumber
                              ).length !== 0 ||
                              (type === "inStock" &&
                                currentWarehouse &&
                                item.warehouse &&
                                item.warehouse !== currentWarehouse)
                            }
                            onChange={(event) => {
                              handleClick(event, item.id);
                              event.stopPropagation();
                            }}
                          />
                        )}
                        <ImageWrapper
                          id={item.itemNumber}
                          imgClass={classes.previewImg}
                          alt={item.itemType}
                          imgUrl={item.imgUrlThumb}
                          handleClick={() => {
                            handlePreview(item.itemNumber);
                            setCurrentItemAdded(null);
                          }}
                        />
                      </div>
                      <br />
                      {item.brand.length > 1 ? (
                        <Tooltip placement="left" title={`${item.brand.join(", ")}`}>
                          <Typography className={classes.headerText}>{`${item.brand[0]} ${item.itemType}`}</Typography>
                          <MoreHorizIcon
                            fontSize="small"
                            color="inherit"
                            style={{ float: "right" }}
                          />
                        </Tooltip>
                      ) : (
                          <Typography className={classes.headerText}>{item.brand[0]}</Typography>
                        )}
                      {item.program.length > 1 ? (
                        <Tooltip placement="left" title={`${item.program.join(", ")}`}>
                          <Typography>{item.program[0]}</Typography>
                          <MoreHorizIcon
                            fontSize="small"
                            color="inherit"
                            style={{ float: "right" }}
                          />
                        </Tooltip>
                      ) : (
                          <Typography>{item.program[0]}</Typography>
                        )}
                      <Typography variant="body1" color="textSecondary">
                        {`#${item.itemNumber} | ${item.packSize}`}
                      </Typography>
                      {type === "inStock" && (
                        <Typography variant="body1" color="textSecondary">
                          {`Available: ${item.stock}`}
                        </Typography>
                      )}
                      <Typography variant="body1" color="textSecondary">
                        {`${formatMoney(item.estCost, false)}`}
                      </Typography>
                      <br />
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>
        </Container>
      )}
    </BottomScrollListener>
  );
};

OrderItemGridView.propTypes = {
  type: PropTypes.string.isRequired,
  currentItems: PropTypes.array.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  setCurrentItemAdded: PropTypes.func.isRequired,
};

export default OrderItemGridView;
