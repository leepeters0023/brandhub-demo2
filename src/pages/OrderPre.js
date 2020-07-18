import React, { useState } from "react";

import ItemPreviewModal from "../components/ItemPreviewModal";

import GalloLogo from "../assets/gallologo.png";

//mockdata
import items from "../assets/mockdata/Items";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
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
  previewImg: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    objectFit: "cover",
    "&:hover": {
      cursor: "pointer",
    },
  },
  qty: {
    width: "50px",
    padding: "2px",
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

  const handleChangeUnit = (evt) => {
    updateUnit(evt.target.value);
  };

  const handleChangeBrand = (evt) => {
    updateBrand(evt.target.value);
  };

  const handleChangeItemType = (evt) => {
    updateItemType(evt.target.value);
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
                <option key={brand} value={index + 1}>
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
                <option key={itemType} value={index + 1}>
                  {itemType}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Place an Order
          </Typography>
        </div>
        <br />
        <TableContainer className={classes.tableContainer}>
          <br />
          <div className={classes.titleBar}>
            <Typography className={classes.titleText} variant="h5">
              Monthly Pre Order
            </Typography>
            <div className={classes.configButtons}>
              <Tooltip title="View List">
                <IconButton>
                  <ViewStreamIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Grid">
                <IconButton>
                  <ViewModuleIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <br />
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerText}></TableCell>
                <TableCell className={classes.headerText} align="left">
                  Preview
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Item Name
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Item #
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Brand
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Qty / Item
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Total Cost
                </TableCell>
                <TableCell className={classes.headerText}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.itemNumber} hover>
                  <TableCell component="th" scope="row">
                    <IconButton>
                      <StarBorderIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="left">
                    <img
                      id={row.itemNumber}
                      className={classes.previewImg}
                      src={row.imgUrl}
                      alt={row.itemType}
                      onClick={handlePreview}
                    />
                  </TableCell>
                  <TableCell align="left">{`${row.brand} ${row.itemType}`}</TableCell>
                  <TableCell align="left">{row.itemNumber}</TableCell>
                  <TableCell align="left">{row.brand}</TableCell>
                  <TableCell align="left">{row.qty}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      id={`${row.itemNumber}`}
                    >
                      <Tooltip title="Add to Cart">
                        <AddShoppingCartIcon color="secondary" />
                      </Tooltip>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default OrderPre;
