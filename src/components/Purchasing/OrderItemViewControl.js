import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import {
  addNewOrderItem,
  createNewOrder,
  clearItemSelections,
} from "../../redux/slices/currentOrderSlice";

import OrderItemTableView from "./OrderItemTableView";
import OrderItemGridView from "./OrderItemGridView";
import AddItemConfirmation from "../Utility/AddItemConfirmation";
import ItemCatalogTable from "./ItemCatalogTable";
import ItemCatalogGrid from "./ItemCatalogGrid";

const OrderItemViewControl = (props) => {
  const {
    type,
    currentView,
    handlePreview,
    handleAddInvOpen,
    items,
    catalogType,
    isItemsLoading,
    scrollRef,
    addPreOrderItem,
  } = props;
  const dispatch = useDispatch();

  const [currentItemAdded, setCurrentItemAdded] = useCallback(useState(null));

  const currentOrderId = useSelector((state) => state.currentOrder.orderId);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const currentChannel = useSelector((state) => state.user.currentChannel);

  const handleAddItem = useCallback(
    (item, remove) => {
      let newItem = {
        brand: item.brand,
        itemType: item.itemType,
      };

      dispatch(clearItemSelections());

      setCurrentItemAdded(newItem);
      if (!currentOrderId) {
        let channel = currentChannel === "On Premise" ? "on_premise" : "retail";
        dispatch(createNewOrder(type, item.id, territoryId, channel));
      } else {
        dispatch(addNewOrderItem(currentOrderId, item.id, type));
      }
    },
    [
      dispatch,
      setCurrentItemAdded,
      currentOrderId,
      type,
      territoryId,
      currentChannel,
    ]
  );

  return (
    <>
      {currentView === "list" && type === "catalog" && (
        <ItemCatalogTable
          currentItems={items}
          handlePreview={handlePreview}
          catalogType={catalogType}
          isItemsLoading={isItemsLoading}
          scrollRef={scrollRef}
          addPreOrderItem={addPreOrderItem}
        />
      )}
      {((currentView === "grid" && type === "catalog") ||
        (currentView === "grid" && type === "new-program")) && (
        <ItemCatalogGrid
          currentItems={items}
          handlePreview={handlePreview}
          catalogType={catalogType}
          isItemsLoading={isItemsLoading}
          type={type}
          addPreOrderItem={addPreOrderItem}
        />
      )}
      {currentView === "list" && type !== "catalog" && (
        <OrderItemTableView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
          handleAddInvOpen={handleAddInvOpen}
          handleAddItem={handleAddItem}
          setCurrentItemAdded={setCurrentItemAdded}
          isItemsLoading={isItemsLoading}
          scrollRef={scrollRef}
        />
      )}
      {currentView === "grid" &&
        type !== "catalog" &&
        type !== "new-program" && (
          <OrderItemGridView
            type={type}
            currentItems={items}
            handlePreview={handlePreview}
            handleAddItem={handleAddItem}
            setCurrentItemAdded={setCurrentItemAdded}
            isItemsLoading={isItemsLoading}
          />
        )}
      {type !== "program" && type !== "catalog" && type !== "new-program" && (
        <AddItemConfirmation type={type} item={currentItemAdded} />
      )}
    </>
  );
};

OrderItemViewControl.propTypes = {
  type: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleAddInvOpen: PropTypes.func,
  items: PropTypes.array,
  isItemsLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
};

export default React.memo(OrderItemViewControl, (prev, next) => {
  return (
    prev.type === next.type &&
    prev.currentView === next.currentView &&
    prev.items.length === next.items.length &&
    prev.isItemsLoading === next.isItemsLoading
  );
});
