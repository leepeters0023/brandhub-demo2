import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import { formatMoney } from "../utility/utilityFunctions";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useInitialFilters } from "../hooks/UtilityHooks";
import { useReactToPrint } from "react-to-print";

import { fetchNextFilteredRules } from "../redux/slices/complianceRulesSlice";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import ComplianceRulesTable from "../components/Compliance/ComplianceRulesTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TuneIcon from "@material-ui/icons/Tune";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultFilters = {
  ruleType: "all",
  sortOrder: "asc",
  sortOrderBy: "ruleType",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ComplianceRules = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const tableRef = useRef(null);

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const currentRules = useSelector((state) => state.complianceRules.rules);
  const isLoading = useSelector((state) => state.complianceRules.isLoading);
  const nextLink = useSelector((state) => state.complianceRules.nextLink);
  const isNextLoading = useSelector(
    (state) => state.complianceRules.isNextLoading
  );

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredRules(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll, 300);

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
      (currentRules.length > 0 && currentCSV.data.length === 0) ||
      (currentCSV.data.length > 0 &&
        currentRules.length > 0 &&
        currentCSV.data.length !== currentRules.length) ||
      (currentCSV.data.length > 0 &&
        currentRules.length > 0 &&
        currentCSV.data[0].ruleType !== currentRules[0].ruleType)
    ) {
      let csvHeaders = [
        { label: "Rule Type", key: "ruleType" },
        { label: "Description", key: "ruleDesc" },
        { label: "Item Types", key: "itemTypes" },
        { label: "Item Type Code", key: "itemTypeCode" },
        { label: "Product Families", key: "productFamilies" },
        { label: "Price", key: "price" },
        { label: "State Codes", key: "stateCodes" },
      ];
      let csvData = [];
      currentRules.forEach((rule) => {
        csvData.push({
          ruleType: rule.ruleType,
          ruleDesc: rule.desc,
          itemTypes: rule.itemTypes,
          itemTypeCode: rule.itemTypeCode,
          productFamilies: rule.productFamilies,
          price:
            rule.price !== "---" ? formatMoney(rule.price, false) : rule.price,
          stateCodes: rule.states,
        });
      });
      setCurrentCSV({ data: csvData, headers: csvHeaders });
    }
  }, [currentRules, currentCSV]);

  useInitialFilters(
    "compliance-rules",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  return (
    <>
      <Helmet>
        <title> Compliance Rules</title>
        {currentUserRole === "purchaser" && !filtersOpen && (
          <script type="text/javascript">{`Beacon('suggest', ['601438192042ff6d1b2a8ab3'])`}</script>
        )}
      </Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Compliance Rules
          </Typography>
          <div
            style={{
              display: "flex",
              width: "250px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print Rules">
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
        <ComplianceRulesTable
          rules={currentRules}
          rulesLoading={isLoading}
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

ComplianceRules.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default ComplianceRules;
