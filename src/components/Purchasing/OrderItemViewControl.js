import React from "react";
import PropTypes from "prop-types";

import OrderInStockTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";

//mockdata
import items from "../../assets/mockdata/Items";

const OrderItemViewControl = (props) => {
  const { type, currentView, handlePreview, handleAddProgramItem, handleAddAllProgramItems } = props;

  return (
    <>

      {currentView === "list" && (
        <OrderInStockTableView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
          handleAddProgramItem={handleAddProgramItem}
          handleAddAllProgramItems={handleAddAllProgramItems}
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
          handleAddProgramItem={handleAddProgramItem}
          handleAddAllProgramItems={handleAddAllProgramItems}
        />
      )}
    </>
  );
};

OrderItemViewControl.propTypes = {
  type: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleAddProgramItem: PropTypes.func.isRequired,
  handleAddAllProgramItems: PropTypes.func.isRequired,
};

export default OrderItemViewControl;
