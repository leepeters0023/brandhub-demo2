import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import { navigate } from "@reach/router";
import { formatMoney } from "../utility/utilityFunctions";

import { useSelector, useDispatch } from "react-redux";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useInitialFilters } from "../hooks/UtilityHooks";
import { useReactToPrint } from "react-to-print";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";
import { fetchNextFilteredPOHistory } from "../redux/slices/purchaseOrderHistorySlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import PurchaseOrderHistoryTable from "../components/SupplierManagement/PurchaseOrderHistoryTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TuneIcon from "@material-ui/icons/Tune";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultCurrentFilters = {
  supplier: [],
  brand: [],
  program: [],
  itemType: [],
  status: "submitted",
  poNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "poNum",
};

const defaultSupplierNewFilters = {
  supplier: [],
  brand: [],
  program: [],
  itemType: [],
  status: "submitted",
  hasShipHold: false,
  poNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "poNum",
};

const defaultSupplierInProgressFilters = {
  supplier: [],
  brand: [],
  program: [],
  itemType: [],
  status: "in-progress",
  hasShipHold: false,
  poNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "poNum",
};

const defaultSupplierShipHoldFilters = {
  supplier: [],
  brand: [],
  program: [],
  itemType: [],
  status: "shipping-hold",
  hasShipHold: true,
  poNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "poNum",
};

const defaultHistoryFilters = {
  supplier: [],
  brand: [],
  program: [],
  itemType: [],
  status: "all",
  poNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "poNum",
};

const filterOptionMap = {
  current: defaultCurrentFilters,
  new: defaultSupplierNewFilters,
  inProgress: defaultSupplierInProgressFilters,
  shippingHold: defaultSupplierShipHoldFilters,
  all: defaultHistoryFilters,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrderHistory = ({
  handleFilterDrawer,
  filtersOpen,
  filterOption,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const tableRef = useRef(null);

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });
  const [currentView, setCurrentView] = useState(filterOption);

  const nextLink = useSelector((state) => state.rfqHistory.nextLink);
  const isNextLoading = useSelector((state) => state.rfqHistory.isNextLoading);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredPOHistory(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isPOsLoading = useSelector(
    (state) => state.purchaseOrderHistory.isLoading
  );
  const currentPOs = useSelector((state) => state.purchaseOrderHistory.pos);
  const error = useSelector((state) => state.purchaseOrderHistory.error);
  const defaultFilters = filterOptionMap[filterOption];

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleSort = (sortObject) => {
    scrollRef.current.scrollTop = 0;
    dispatch(
      updateMultipleFilters({
        filterObject: {
          sortOrder: sortObject.order,
          sortOrderBy: sortObject.orderBy,
        },
      })
    );
    dispatch(setSorted());
  };

  useEffect(() => {
    if (
      (currentPOs.length > 0 && currentCSV.data.length === 0) ||
      (currentPOs.length > 0 &&
        currentCSV.data.length > 0 &&
        currentPOs.length !== currentCSV.data.length) ||
      (currentPOs.length > 0 &&
        currentCSV.data.length > 0 &&
        currentPOs[0].itemNumber !== currentCSV.data[0].itemNumber)
    ) {
      let csvHeaders = [
        { label: "Sequence #", key: "itemNumber" },
        { label: "Brand", key: "brand" },
        { label: "Project #", key: "projectNum" },
        { label: "Item Description", key: "itemDesc" },
        { label: "Supplier", key: "supplier" },
        { label: "Quantity", key: "quantity" },
        { label: "Est. Cost/Unit", key: "estCost" },
        { label: "Act. Cost/Unit", key: "actCost" },
        { label: "Status", key: "status" },
        { label: "Submitted Date", key: "submittedDate" },
        { label: "In Market Date", key: "inMarketDate" },
        { label: "Purchaser", key: "poCreator" },
        { label: "Allocated", key: "allocated" },
      ];

      let csvSupplierHeaders = [
        { label: "Sequence #", key: "itemNumber" },
        { label: "Brand", key: "brand" },
        { label: "Project #", key: "projectNum" },
        { label: "Item Description", key: "itemDesc" },
        { label: "Quantity", key: "quantity" },
        { label: "Act. Cost/Unit", key: "actCost" },
        { label: "Status", key: "status" },
        { label: "Submitted Date", key: "submittedDate" },
        { label: "In Market Date", key: "inMarketDate" },
        { label: "Purchaser", key: "poCreator" },
        { label: "Allocated", key: "allocated" },
      ];

      let csvData = [];
      currentPOs.forEach((po) => {
        if (currentUserRole !== "supplier") {
          csvData.push({
            itemNumber: po.itemNumber,
            brand: po.brand.join(", "),
            projectNum: po.projectNum,
            itemDesc: po.itemDesc,
            supplier: po.supplier,
            quantity: po.totalItems,
            estCost: formatMoney(po.estCost, true),
            actCost: formatMoney(po.actCost, true),
            status: po.status[0].toUpperCase() + po.status.slice(1),
            submittedDate: po.submittedDate,
            inMarketDate: po.inMarketDate,
            poCreator: po.purchasedBy,
            allocated: po.allocated,
          });
        } else {
          csvData.push({
            itemNumber: po.itemNumber,
            brand: po.brand.join(", "),
            projectNum: po.projectNum,
            itemDesc: po.itemDesc,
            quantity: po.totalItems,
            actCost: formatMoney(po.actCost, true),
            status: po.status[0].toUpperCase() + po.status.slice(1),
            submittedDate: po.submittedDate,
            inMarketDate: po.inMarketDate,
            poCreator: po.purchasedBy,
            allocated: po.allocated,
          });
        }
      });
      setCurrentCSV({
        data: csvData,
        headers:
          currentUserRole !== "supplier" ? csvHeaders : csvSupplierHeaders,
      });
    }
  }, [currentPOs, currentCSV, currentUserRole]);

  useInitialFilters(
    "history-po",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (currentView !== filterOption) {
      setCurrentView(filterOption);
      setCurrentView(filterOption);
      dispatch(
        updateMultipleFilters({ filterObject: filterOptionMap[filterOption] })
      );
      dispatch(setSorted());
    }
  }, [currentView, setCurrentView, filterOption, dispatch]);

  useEffect(() => {
    if (error) {
      navigate("/whoops");
    }
  }, [error]);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Purchase Order History
          </Typography>
          <div
            style={{
              display: "flex",
              width: "250px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print POs">
              <IconButton onClick={handlePrint}>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
              <CSVLink data={currentCSV.data} headers={currentCSV.headers}>
                <IconButton>
                  <GetAppIcon color="secondary" />
                </IconButton>
              </CSVLink>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            marginBottom: "10px",
          }}
        >
          <div
            className={classes.showHideFilters}
            onClick={() => {
              handleFilterDrawer(!filtersOpen);
            }}
          >
            <TuneIcon fontSize="small" color="secondary" />
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ margin: "10px 10px" }}
            >
              {filtersOpen ? "Hide Filters" : "Show Filters"}
            </Typography>
          </div>
          <FilterChipList classes={classes} />
          <br />
        </div>
        <PurchaseOrderHistoryTable
          pos={currentPOs}
          posLoading={isPOsLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
          tableRef={tableRef}
        />
        {isNextLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
        {!isNextLoading && <div style={{ width: "100%", height: "4px" }}></div>}
      </Container>
      <br />
    </>
  );
};

PurchaseOrderHistory.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default PurchaseOrderHistory;
