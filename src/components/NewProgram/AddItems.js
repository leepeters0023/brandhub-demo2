import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";

import { updateItems } from "../../redux/slices/newProgramSlice";
import {
  clearItemSelection,
  fetchNextFilteredItems,
} from "../../redux/slices/itemSlice";

import OrderItemViewControl from "../Purchasing/OrderItemViewControl";
import FilterChipList from "../Filtering/FilterChipList";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const AddItems = ({
  classes,
  itemsLoading,
  itemList,
  handlePreview,
  handleFilterDrawer,
  filtersOpen,
}) => {
  const dispatch = useDispatch();

  const [currentView, setView] = useCallback(useState("list"));

  const currentItems = useSelector((state) => state.newProgram.items);
  const selectedItems = useSelector((state) => state.items.selectedItems);
  const nextLink = useSelector((state) => state.items.nextLink);
  const isNextLoading = useSelector((state) => state.items.isNextLoading);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredItems(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const handleAddItems = useCallback(() => {
    let newItems = [];
    selectedItems.forEach((item) => {
      let currentItem = itemList.find((i) => i.id === item);
      newItems.push(currentItem);
    });
    let items;
    if (currentItems.length === 0) {
      items = newItems;
    } else {
      items = [...currentItems];
      newItems.forEach((item) => {
        if (!items.includes(item)) {
          items.push(item);
        }
      });
    }
    dispatch(updateItems({ items: items }));
    dispatch(clearItemSelection());
  }, [currentItems, selectedItems, dispatch, itemList]);

  const handleChipClick = useCallback(
    (item) => {
      let currentItemList = currentItems.filter((i) => i !== item);
      dispatch(updateItems({ items: currentItemList }));
    },
    [currentItems, dispatch]
  );

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}
      >
        <Typography className={classes.headerText}>Current Items</Typography>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {currentItems.length > 0 ? (
          <>
            {currentItems.map((item, index) => (
              <Chip
                style={{ margin: "auto 2.5px" }}
                color="primary"
                key={index}
                label={`${item.itemNumber} - ${item.itemType}`}
                onDelete={() => handleChipClick(item)}
              />
            ))}
            <br />
            <br />
            <Divider />
            <br />
          </>
        ) : (
          <>
            <Typography className={classes.bodyText}>
              You have not added any items to this program yet ...
            </Typography>
            <br />
            <Divider />
            <br />
          </>
        )}
      </div>
      <br />
      <Divider />
      <br />
      <div className={classes.titleBar} style={{ width: "100%" }}>
        <Typography className={classes.headerText}>Available Items</Typography>
        <div className={classes.configButtons}>
          <div className={classes.innerConfigDiv}>
            <>
              <Button
                className={classes.largeButton}
                style={{ marginRight: "10px" }}
                variant="contained"
                color="secondary"
                disabled={selectedItems.length === 0}
                onClick={handleAddItems}
              >
                ADD TO PROGRAM
              </Button>
              <Tooltip title="View List">
                <IconButton
                  onClick={() => {
                    setView("list");
                  }}
                >
                  <ViewStreamIcon
                    fontSize="large"
                    color={currentView === "list" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Grid">
                <IconButton
                  onClick={() => {
                    setView("grid");
                  }}
                >
                  <ViewModuleIcon
                    fontSize="large"
                    color={currentView === "grid" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
            </>
          </div>
        </div>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "32px",
          width: "100%",
        }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.hoverText}
          style={{ marginRight: "20px" }}
          onClick={() => {
            handleFilterDrawer(!filtersOpen);
          }}
        >
          Filters
        </Typography>
        <FilterChipList classes={classes} />
      </div>
      <br />
      <OrderItemViewControl
        type={"catalog"}
        currentView={currentView}
        handlePreview={handlePreview}
        items={itemList}
        isItemsLoading={itemsLoading}
        scrollRef={scrollRef}
      />
      {isNextLoading && (
        <div style={{ width: "100%" }}>
          <LinearProgress />
        </div>
      )}
      {!isNextLoading && <div style={{ width: "100%", height: "4px" }}></div>}
    </>
  );
};

AddItems.propTypes = {
  classes: PropTypes.object.isRequired,
  itemsLoading: PropTypes.bool.isRequired,
  itemList: PropTypes.array.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default React.memo(AddItems);
