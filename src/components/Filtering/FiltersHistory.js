import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

import { useDispatch } from "react-redux";

import { setClear } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import DistributorAutoComplete from "../Utility/DistributorAutoComplete";
import UserAutoComplete from "../Utility/UserAutoComplete";
import UserSuperAutoComplete from "../Utility/UserSuperAutoComplete";
import StatusSelector from "../Utility/StatusSelector";
import ProgramAutoComplete from "../Utility/ProgramAutoComplete";
import ItemTypeAutoComplete from "../Utility/ItemTypeAutoComplete";
import SupplierAutoComplete from "../Utility/SupplierAutoComplete";
import PurchaserAutoComplete from "../Utility/PurchaserAutoComplete";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Divider from "@material-ui/core/Divider";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

const FiltersHistory = ({
  reset,
  setReset,
  handleFilters,
  classes,
  itemNumber,
  bindSequenceNum,
  rfqNum,
  bindRfqNum,
  poNum,
  bindPoNum,
  handleSearch,
  historyType,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useCallback(
    useState(historyType === "rollup" ? "submitted" : "all")
  );

  const currentUserRole = useSelector((state) => state.user.role);
  const currentGrouping = useSelector((state) => state.filters.groupBy);
  const toDate = useSelector((state) => state.filters.toDate);
  const fromDate = useSelector((state) => state.filters.fromDate);
  const isLoading = useSelector((state) => state.globalLoad.isLoading);
  const [value, setValue] = useCallback(useState("order"));

  useEffect(() => {
    if (currentGrouping !== value) {
      setValue(currentGrouping);
    }
  }, [currentGrouping, value, setValue]);

  return (
    <>
      <List>
        {historyType !== "rfq" &&
          historyType !== "po" &&
          historyType !== "approvals" && (
            <>
              <ListItem
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography className={classes.headerText}>
                  Group By:
                </Typography>
                <br />
                <ButtonGroup
                  orientation="vertical"
                  fullWidth
                  color="secondary"
                  aria-label="order-group"
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
                    disabled //={isLoading}
                  >
                    ORDER
                  </Button>
                  <Button
                    className={
                      value === "item"
                        ? classes.largeButton
                        : classes.selectedButton
                    }
                    variant={value === "item" ? "contained" : "outlined"}
                    onClick={() => {
                      setValue("item");
                      handleFilters("item", "groupBy", "history");
                    }}
                    disabled={isLoading}
                  >
                    ITEM
                  </Button>
                </ButtonGroup>
              </ListItem>
              <ListItem />
              <Divider />
              <ListItem />
            </>
          )}

        <ListItem>
          <TextField
            className={classes.queryField}
            color="secondary"
            fullWidth
            name="sequenceNumber"
            type="text"
            label="Sequence #"
            value={itemNumber}
            {...bindSequenceNum}
            variant="outlined"
            size="small"
            disabled={isLoading}
          />
        </ListItem>
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </ListItem>
        )}
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={handleSearch}
            disabled={isLoading}
          >
            SEARCH
          </Button>
        </ListItem>
        <ListItem />
        <Divider />
        <ListItem />
        {historyType !== "rfq" && historyType !== "po" && (
          <>
            <ListItem>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
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
                  onChange={(value) =>
                    handleFilters(value, "fromDate", "history")
                  }
                  PopoverProps={{
                    style: { zIndex: "16000" },
                  }}
                  disabled={isLoading}
                />
              </MuiPickersUtilsProvider>
            </ListItem>
            <ListItem>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  fullWidth
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="toDate"
                  label="Order To Date"
                  value={toDate || format(addDays(new Date(), 1), "MM/dd/yyyy")}
                  onChange={(value) =>
                    handleFilters(value, "toDate", "history")
                  }
                  PopoverProps={{
                    style: { zIndex: "16000" },
                  }}
                  disabled={isLoading}
                />
              </MuiPickersUtilsProvider>
            </ListItem>
          </>
        )}
        {(historyType === "rollup" ||
          historyType === "rfq" ||
          historyType === "po") && (
          <ListItem>
            <StatusSelector
              handleStatus={handleFilters}
              status={status}
              setStatus={setStatus}
              classes={classes}
              filterType={
                historyType === "rollup"
                  ? "history"
                  : currentUserRole === "supplier"
                  ? `${historyType}Supplier`
                  : historyType
              }
            />
          </ListItem>
        )}
        {currentUserRole !== "field1" &&
          historyType !== "rfq" &&
          historyType !== "po" && (
            <ListItem>
              {currentUserRole === "super" ||
              currentUserRole === "read-only" ? (
                <UserSuperAutoComplete
                  classes={classes}
                  handleChange={handleFilters}
                  reset={reset}
                  setReset={setReset}
                  filterType={"budget"}
                />
              ) : (
                <UserAutoComplete
                  classes={classes}
                  handleChange={handleFilters}
                  reset={reset}
                  setReset={setReset}
                  filterType={"budget"}
                />
              )}
            </ListItem>
          )}
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
        <ListItem>
          <ItemTypeAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"history"}
          />
        </ListItem>
        {historyType === "po" && currentUserRole !== "supplier" && (
          <>
            <ListItem>
              <SupplierAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
                filterType={"history"}
              />
            </ListItem>
            <ListItem>
              <PurchaserAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
                filterType={"history"}
              />
            </ListItem>
          </>
        )}
        <Divider />
        <ListItem />
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch(setClear());
            }}
            disabled={isLoading}
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
  itemNumber: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default FiltersHistory;
