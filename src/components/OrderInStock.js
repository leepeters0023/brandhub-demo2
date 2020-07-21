import React, { useState } from "react";

import OrderInStockTableView from "./OrderInStockTableView";
import OrderPreGridView from "./OrderInStockgridView";

//mockdata
import items from "../assets/mockdata/Items";

import { makeStyles } from "@material-ui/core/styles";

//import StarIcon from "@material-ui/icons/Star";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryForms: {
    float: "right",
  },
  formControl: {
    width: "150px",
    margin: "0 5px",
  },
  configButtons: {
    marginLeft: "70%",
  },
}));

const OrderInStock = (props) => {
  const classes = useStyles();

  const { currentView, handlePreview } = props;

  const [currentItems, setCurrentItems] = useState(items);

  return (
    <>
      {currentView === "list" && (
        <OrderInStockTableView
          currentItems={currentItems}
          handlePreview={handlePreview}
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          currentItems={currentItems}
          handlePreview={handlePreview}
        />
      )}
    </>
  );
};

export default OrderInStock;
