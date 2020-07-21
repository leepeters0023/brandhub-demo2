import React, { useState } from "react";

import ItemPreviewModal from "../components/ItemPreviewModal";
import OrderPreTableView from "../components/OrderPreTableView";
import OrderPreGridView from "../components/OrderPreGridView";

//mockdata
import items from "../assets/mockdata/Items";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
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


const OrderPre = (props) => {
  const classes = useStyles();

  const { currentView } = props
  const [modal, handleModal] = useState(false);
  const [currentItem, handleCurrentItem] = useState({});
  const [currentItems, setCurrentItems] = useState(items);

  const handlePreview = (evt) => {
    let item = items.find(
      (item) => item.itemNumber === parseInt(evt.target.id)
    );
    handleCurrentItem(item);
    handleModal(true);
  };

  const handleModalClose = () => {
    handleModal(false);
  };

  return (
    <>
      <Dialog open={modal} onClose={handleModalClose} fullWidth maxWidth="lg">
        <DialogContent>
          <ItemPreviewModal
            currentItem={currentItem}
            handleClose={handleModalClose}
          />
        </DialogContent>
      </Dialog>

      {currentView === "list" && (
        <OrderPreTableView
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

export default OrderPre;
