import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import { useSelector, useDispatch } from "react-redux";

import {
  updateItemSelection,
  fetchNextFilteredItems,
} from "../../redux/slices/itemSlice";

import BottomScrollListener from "react-bottom-scroll-listener";
import ImageWrapper from "../Utility/ImageWrapper";
import Loading from "../Utility/Loading";

import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.itemGrid,
}));

const OrderItemGridView = (props) => {
  const {
    currentItems,
    handlePreview,
    catalogType,
    isItemsLoading,
    type,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedItems = useSelector((state) => state.items.selectedItems);
  const nextLink = useSelector((state) => state.items.nextLink);
  const isNextLoading = useSelector((state) => state.items.isNextLoading);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      dispatch(fetchNextFilteredItems(nextLink));
    }
  };

  const handleClick = (_event, id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
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

    dispatch(updateItemSelection({ selectedItems: newSelected }));
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
                const isItemSelected = type === "new-program" ? null : isSelected(item.id);
                const labelId = type === "newProgram" ? null : `item-Checkbox-${index}`;
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
                        {type !== "new-program" && (
                          <Checkbox
                            className={classes.checkbox}
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            onClick={(event) => event.stopPropagation()}
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
                          handlClick={() => handlePreview(item.itemNumber)}
                        />
                      </div>
                      <br />
                      <Typography className={classes.headerText}>
                        {`${item.brand} ${item.itemType}`}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {`#${item.itemNumber}`}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {`Pack Size: ${item.packSize}`}
                      </Typography>
                      {catalogType === "inStock" && (
                        <Typography variant="body1" color="textSecondary">
                          {`Available: ${item.stock}`}
                        </Typography>
                      )}
                      <br />
                      <Typography className={classes.headerText}>
                        {`${formatMoney(item.estCost, false)}`}
                      </Typography>
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
  currentItems: PropTypes.array,
  handlePreview: PropTypes.func.isRequired,
};

export default OrderItemGridView;
