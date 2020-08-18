import React from "react";
import PropTypes from "prop-types";

import OrderInStockTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";

//mockdata
import items from "../../assets/mockdata/Items";

const OrderItemViewControl = (props) => {
  const { type, currentView, handlePreview, currentProgram } = props;

  return (
    <>

      {currentView === "list" && (
        <OrderInStockTableView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
          currentProgram={currentProgram}
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
          currentProgram={currentProgram}
        />
      )}
    </>
  );
};

OrderItemViewControl.propTypes = {
  type: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  handlePreview: PropTypes.func.isRequired,
  currentProgram: PropTypes.object
};

export default OrderItemViewControl;
