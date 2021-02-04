import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useInitialFilters } from "../hooks/UtilityHooks";
import { useReactToPrint } from "react-to-print";

import {
  fetchNextFilteredTriggeredRules,
  approvePriorApprovalItem,
  denyPriorApprovalItem,
} from "../redux/slices/complianceItemsSlice";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import ComplianceItemsTable from "../components/Compliance/ComplianceItemsTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TuneIcon from "@material-ui/icons/Tune";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultFilters = {
  brand: [],
  //program: [],
  itemType: [],
  tag: [],
  ruleType: "all",
  status: "all",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "itemNumber",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ComplianceItems = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const tableRef = useRef(null);

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const currentItemRules = useSelector((state) => state.complianceItems.items);
  const selectedCompItems = useSelector(
    (state) => state.complianceItems.selectedItems
  );
  const isLoading = useSelector((state) => state.complianceItems.isLoading);
  const nextLink = useSelector((state) => state.complianceItems.nextLink);
  const isNextLoading = useSelector(
    (state) => state.complianceItems.isNextLoading
  );

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredTriggeredRules(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

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

  const handleApprove = () => {
    dispatch(approvePriorApprovalItem(selectedCompItems));
  };

  const handleDeny = () => {
    dispatch(denyPriorApprovalItem(selectedCompItems));
  };

  useEffect(() => {
    if (
      (currentItemRules.length > 0 && currentCSV.data.length === 0) ||
      (currentCSV.data.length > 0 &&
        currentItemRules.length > 0 &&
        currentCSV.data.length !== currentItemRules.length) ||
      (currentCSV.data.length > 0 &&
        currentItemRules.length > 0 &&
        currentCSV.data[0].itemNumber !== currentItemRules[0].itemNumber)
    ) {
      let csvHeaders = [
        { label: "Sequence #", key: "itemNumber" },
        { label: "Program", key: "program" },
        { label: "Brand", key: "brand" },
        { label: "Item Type", key: "itemType" },
        { label: "State", key: "state" },
        { label: "Rule Type", key: "ruleType" },
        { label: "Rule Description", key: "ruleDesc" },
        { label: "Status", key: "status" },
      ];
      let csvData = [];
      currentItemRules.forEach((rule) => {
        csvData.push({
          itemNumber: rule.itemNumber,
          program: rule.program,
          brand: rule.brand,
          itemType: rule.itemType,
          state: rule.state,
          ruleType: rule.ruleType,
          ruleDesc: rule.ruleDesc,
          status: rule.status,
        });
      });
      setCurrentCSV({ data: csvData, headers: csvHeaders });
    }
  }, [currentItemRules, currentCSV]);

  useInitialFilters(
    "compliance-items",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  return (
    <>
      <Helmet>
        <title>RTA | Compliance Items</title>
        {currentUserRole === "purchaser" && !filtersOpen && (
          <script type="text/javascript">{`Beacon('suggest', ['601438192042ff6d1b2a8ab3'])`}</script>
        )}
      </Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Compliance Items
          </Typography>
          <div
            style={{
              display: "flex",
              width: "500px",
              justifyContent: "flex-end",
            }}
          >
            {(currentUserRole === "compliance" ||
              currentUserRole === "super") && (
              <>
                <Tooltip
                  title="Approves a Prior Approval Rule"
                  PopperProps={{ style: { marginRight: "20px" } }}
                >
                  <span>
                    <Button
                      className={classes.largeButton}
                      variant="contained"
                      color="secondary"
                      disabled={selectedCompItems.length === 0}
                      style={{ marginRight: "20px" }}
                      onClick={() => {
                        handleApprove();
                      }}
                    >
                      APPROVE RULE
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip
                  title="Denies a Prior Approval Rule"
                  PopperProps={{ style: { marginRight: "20px" } }}
                >
                  <span>
                    <Button
                      className={classes.largeButton}
                      variant="contained"
                      color="secondary"
                      disabled={selectedCompItems.length === 0}
                      style={{ marginRight: "20px" }}
                      onClick={() => {
                        handleDeny();
                      }}
                    >
                      DENY RULE
                    </Button>
                  </span>
                </Tooltip>
              </>
            )}
            <Tooltip title="Print Item Rules">
              <IconButton onClick={handlePrint}>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export File">
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
        <ComplianceItemsTable
          items={currentItemRules}
          itemsLoading={isLoading}
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

ComplianceItems.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default ComplianceItems;
