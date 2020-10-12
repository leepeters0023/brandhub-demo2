import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import subDays from "date-fns/subDays";
import format from "date-fns/format";

import { useDispatch } from "react-redux";

import { setClear, updateSingleFilter } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import DistributorAutoComplete from "../Utility/DistributorAutoComplete";
import UserAutoComplete from "../Utility/UserAutoComplete";
import StatusSelector from "../Utility/StatusSelector";
import ProgramAutoComplete from "../Utility/ProgramAutoComplete";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DateFnsUtils from "@date-io/date-fns";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const ItemTypesList = React.memo(
  ({ listItems, handleCheckToggle, itemTypesChecked, setItemTypesChecked }) => {
    return (
      <List component="div" disablePadding>
        {listItems.map((item) => {
          const labelId = `checkbox-list-label-${item}`;

          return (
            <ListItem
              key={item}
              role={undefined}
              dense
              button
              onClick={() => {
                handleCheckToggle(
                  item,
                  itemTypesChecked,
                  setItemTypesChecked,
                  "itemType"
                );
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={itemTypesChecked.indexOf(item) !== -1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item}`} />
            </ListItem>
          );
        })}
      </List>
    );
  }
);

const SupplierList = React.memo(
  ({ listItems, handleCheckToggle, suppliersChecked, setSuppliersChecked }) => {
    return (
      <List component="div" disablePadding>
        {listItems.map((item) => {
          const labelId = `checkbox-list-label-${item}`;

          return (
            <ListItem
              key={item}
              role={undefined}
              dense
              button
              onClick={() => {
                handleCheckToggle(
                  item,
                  suppliersChecked,
                  setSuppliersChecked,
                  "itemType"
                );
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={suppliersChecked.indexOf(item) !== -1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item}`} />
            </ListItem>
          );
        })}
      </List>
    );
  }
);

const FiltersHistory = ({
  reset,
  setReset,
  handleFilters,
  classes,
  sequenceNum,
  bindSequenceNum,
  rfqNum,
  bindRfqNum,
  poNum,
  bindPoNum,
  itemTypes,
  suppliers,
  handleSearch,
  historyType,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useCallback(
    useState(historyType === "rollup" ? "submitted" : "all")
  );

  const currentUserRole = useSelector((state) => state.user.role);
  const toDate = useSelector((state) => state.filters.toDate);
  const fromDate = useSelector((state) => state.filters.fromDate);
  const [value, setValue] = useCallback(useState("order"));
  const [itemTypesOpen, setItemTypesOpen] = useCallback(useState(false));
  const [itemTypesChecked, setItemTypesChecked] = useCallback(useState([]));
  const [suppliersOpen, setSuppliersOpen] = useCallback(useState(false));
  const [suppliersChecked, setSuppliersChecked] = useCallback(useState([]));

  const currentItemTypeFilter = useSelector((state) => state.filters.itemType);
  const currentSupplierFilter = useSelector((state) => state.filters.supplier);

  const handleCheckToggle = useCallback(
    (value, array, func, type, deleting) => {
      const currentIndex = array.indexOf(value);
      const newChecked = [...array];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      func(newChecked);
      if (!deleting) {
        dispatch(updateSingleFilter({ filter: type, value: newChecked }));
      }
    },
    [dispatch]
  );

  const handleListToggle = (open, func) => {
    func(!open);
  };

  useEffect(() => {
    if (currentItemTypeFilter.length !== itemTypesChecked.length) {
      if (itemTypesChecked.length > currentItemTypeFilter.length) {
        let missingFilter;
        itemTypesChecked.forEach((unit) => {
          if (currentItemTypeFilter.filter((u) => u === unit).length === 0) {
            missingFilter = unit;
          }
        });
        handleCheckToggle(
          missingFilter,
          itemTypesChecked,
          setItemTypesChecked,
          "itemType",
          true
        );
      }
    }
  }, [
    currentItemTypeFilter,
    itemTypesChecked,
    setItemTypesChecked,
    handleCheckToggle,
  ]);

  useEffect(() => {
    if (currentSupplierFilter.length !== suppliersChecked.length) {
      if (suppliersChecked.length > currentSupplierFilter.length) {
        let missingFilter;
        suppliersChecked.forEach((unit) => {
          if (currentSupplierFilter.filter((u) => u === unit).length === 0) {
            missingFilter = unit;
          }
        });
        handleCheckToggle(
          missingFilter,
          suppliersChecked,
          setSuppliersChecked,
          "itemType",
          true
        );
      }
    }
  }, [
    currentSupplierFilter,
    suppliersChecked,
    setSuppliersChecked,
    handleCheckToggle,
  ]);

  //TODO need to add group by in API calls

  return (
    <>
      {historyType !== "rfq" &&
        historyType !== "po" &&
        historyType !== "approvals" && (
          <>
            <br />
            <Typography className={classes.headerText}>Group By:</Typography>
            <br />
            <ButtonGroup
              orientation="vertical"
              fullWidth
              color="secondary"
              aria-label="order-item-type"
            >
              <Button
                className={
                  value === "order"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={value === "order" ? "contained" : "outlined"}
                onClick={() => {
                  setValue("order");
                  handleFilters("order", "groupBy", "history");
                }}
              >
                ORDER
              </Button>
              <Button
                className={
                  value === "itemType"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={value === "itemType" ? "contained" : "outlined"}
                onClick={() => {
                  setValue("itemType");
                  handleFilters("itemType", "groupBy", "history");
                }}
              >
                ITEM TYPE
              </Button>
            </ButtonGroup>
            <br />
            <br />
          </>
        )}
      <List>
        {historyType === "rfq" && (
          <ListItem>
            <TextField
              className={classes.queryField}
              color="secondary"
              fullWidth
              name="rfqNum"
              type="text"
              label="RFQ #"
              value={rfqNum}
              {...bindRfqNum}
              variant="outlined"
              size="small"
            />
          </ListItem>
        )}
        {historyType === "po" && (
          <ListItem>
            <TextField
              className={classes.queryField}
              color="secondary"
              fullWidth
              name="poNum"
              type="text"
              label="PO #"
              value={poNum}
              {...bindPoNum}
              variant="outlined"
              size="small"
            />
          </ListItem>
        )}
        {historyType !== "rfq" && historyType !== "po" && (
          <>
            <ListItem>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="fromDate"
                  label="Order From Date"
                  value={
                    fromDate || format(subDays(new Date(), 7), "MM/dd/yyyy")
                  }
                  onChange={(value) => handleFilters(value, "fromDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </ListItem>
            <ListItem>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="toDate"
                  label="Order To Date"
                  value={toDate || format(new Date(), "MM/dd/yyyy")}
                  onChange={(value) => handleFilters(value, "toDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </ListItem>
          </>
        )}
        <ListItem />
        {currentUserRole !== "field1" &&
          historyType !== "rfq" &&
          historyType !== "po" && (
            <ListItem>
              <UserAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
                filterType={"history"}
              />
            </ListItem>
          )}
        <ListItem>
          <TextField
            className={classes.queryField}
            color="secondary"
            fullWidth
            name="sequenceNumber"
            type="text"
            label="Sequence #"
            value={sequenceNum}
            {...bindSequenceNum}
            variant="outlined"
            size="small"
          />
        </ListItem>
        <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"history"}
          />
        </ListItem>
        {historyType !== "rollup" &&
          historyType !== "rfq" &&
          historyType !== "po" && (
            <ListItem>
              <DistributorAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
                filterType={"history"}
              />
            </ListItem>
          )}
        <ListItem>
          <ProgramAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"history"}
          />
        </ListItem>

        {(historyType === "rollup" ||
          historyType === "rfq" ||
          historyType === "po") && (
          <ListItem>
            <StatusSelector
              handleStatus={handleFilters}
              status={status}
              setStatus={setStatus}
              classes={classes}
              filterType={historyType === "rollup" ? "history" : historyType}
            />
          </ListItem>
        )}
        <ListItem />
        {historyType === "po" && (
          <>
            <ListItem
              button
              onClick={() => {
                handleListToggle(suppliersOpen, setSuppliersOpen);
              }}
            >
              <ListItemText primary="Supplier" />
              {suppliersOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={suppliersOpen}
              timeout={{ appear: 400, enter: 400, exit: 0 }}
            >
              <SupplierList
                listItems={suppliers}
                handleCheckToggle={handleCheckToggle}
                suppliersChecked={suppliersChecked}
                setSuppliersChecked={setSuppliersChecked}
              />
            </Collapse>
            <Divider />
            <ListItem />
          </>
        )}
        <ListItem
          button
          onClick={() => {
            handleListToggle(itemTypesOpen, setItemTypesOpen);
          }}
        >
          <ListItemText primary="Item Type" />
          {itemTypesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          in={itemTypesOpen}
          timeout={{ appear: 400, enter: 400, exit: 0 }}
        >
          <ItemTypesList
            listItems={itemTypes}
            handleCheckToggle={handleCheckToggle}
            itemTypesChecked={itemTypesChecked}
            setItemTypesChecked={setItemTypesChecked}
          />
        </Collapse>
        <Divider />
        <ListItem />
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={handleSearch}
          >
            SEARCH
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch(setClear());
            }}
          >
            CLEAR FILTERS
          </Button>
        </ListItem>
      </List>
    </>
  );
};

FiltersHistory.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  sequenceNum: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default FiltersHistory;
