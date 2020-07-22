import React from "react";

import OrderInStockTableView from "./OrderInStockTableView";
import OrderPreGridView from "./OrderInStockgridView";

//mockdata
import items from "../assets/mockdata/Items";

const OrderInStock = (props) => {

  const { currentView, handlePreview } = props;

  //const [currentItems, setCurrentItems] = useState(items);

  return (
    <>
      {currentView === "list" && (
        <OrderInStockTableView
          currentItems={items}
          handlePreview={handlePreview}
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          currentItems={items}
          handlePreview={handlePreview}
        />
      )}
    </>
  );
};

export default OrderInStock;
