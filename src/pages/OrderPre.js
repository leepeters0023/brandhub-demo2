import React, { useState } from "react";

import ItemPreviewModal from "../components/ItemPreviewModal";
import OrderPreTableView from "../components/OrderPreTableView";
import OrderPreGridView from "../components/OrderPreGridView";

import GalloLogo from "../assets/gallologo.png";

//mockdata
import items from "../assets/mockdata/Items";

import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

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

let brands = items.map((item) => item.brand);
let itemTypes = items.map((item) => item.itemType);

const OrderPre = () => {
  const classes = useStyles();
  const [unit, updateUnit] = useState("");
  const [brand, updateBrand] = useState("");
  const [itemType, updateItemType] = useState("");
  const [modal, handleModal] = useState(false);
  const [currentItem, handleCurrentItem] = useState({});
  const [currentItems, setCurrentItems] = useState(items);
  const [filters, setFilters] = useState({ brand: "", itemType: "" });
  const [currentView, setView] = useState("list");

  const handleChangeUnit = (evt) => {
    updateUnit(evt.target.value);
  };

  const handleChangeBrand = (evt) => {
    updateBrand(evt.target.value);
    setFilters({ ...filters, brand: evt.target.value });
    evt.target.value === "" && filters.itemType === ""
      ? setCurrentItems(items)
      : setCurrentItems(
          items.filter((item) => item.brand === evt.target.value)
        );
  };

  const handleChangeItemType = (evt) => {
    updateItemType(evt.target.value);
    setFilters({ ...filters, itemType: evt.target.value });
    evt.target.value === "" && filters.brand === ""
      ? setCurrentItems(items)
      : setCurrentItems(
          items.filter((item) => item.itemType === evt.target.value)
        );
  };

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
    <div>
      <Dialog open={modal} onClose={handleModalClose} fullWidth maxWidth="lg">
        <DialogContent>
          <ItemPreviewModal
            currentItem={currentItem}
            handleClose={handleModalClose}
          />
        </DialogContent>
      </Dialog>
      <Paper className={classes.paperContainer}>
        <div className={classes.queryForms}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="business-unit">Business Unit</InputLabel>
            <Select
              native
              value={unit}
              onChange={handleChangeUnit}
              label="Business Unit"
              inputProps={{
                name: "Business Unit",
                id: "business-unit",
              }}
            >
              <option value={""} aria-label="Business Unit" />
              <option value={1}>Unit 1</option>
              <option value={2}>Unit 2</option>
              <option value={3}>Unit 3</option>
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="brand">Brand</InputLabel>
            <Select
              native
              value={brand}
              onChange={handleChangeBrand}
              label="Brand"
              inputProps={{
                name: "Brand",
                id: "brand",
              }}
            >
              <option value={""} aria-label="Brand" />
              {brands.map((brand, index) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="item-type">Item Type</InputLabel>
            <Select
              native
              value={itemType}
              onChange={handleChangeItemType}
              label="Item Type"
              inputProps={{
                name: "Item Type",
                id: "item-type",
              }}
            >
              <option value={""} aria-label="Item Type" />
              {itemTypes.map((itemType, index) => (
                <option key={itemType} value={itemType}>
                  {itemType}
                </option>
              ))}
            </Select>
          </FormControl>
          <div className={classes.configButtons}>
            <Tooltip title="View List">
              <IconButton onClick={() => {setView("list")}}>
                <ViewStreamIcon fontSize="large" color={currentView === "list" ? "primary" : "inherit"} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Grid">
              <IconButton onClick={() => {setView("grid")}}>
                <ViewModuleIcon fontSize="large" color={currentView === "grid" ? "primary" : "inherit"} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Place an Order
          </Typography>
        </div>
        <br />
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
      </Paper>
    </div>
  );
};

export default OrderPre;
