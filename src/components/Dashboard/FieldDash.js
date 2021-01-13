import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import ImageWrapper from "../Utility/ImageWrapper";

import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const FieldDash = ({ classes, name, InfoPopover }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const preOrderOpen = anchorEl ? anchorEl.id === "pre-order-parent" : false;
  const inStockOpen = anchorEl ? anchorEl.id === "in-stock-parent" : false;
  const onDemandOpen = anchorEl ? anchorEl.id === "on-demand-parent" : false;
  const historyOpen = anchorEl ? anchorEl.id === "history-parent" : false;
  const catalogCurrentOpen = anchorEl
    ? anchorEl.id === "catalog-current-parent"
    : false;
  const catalogArchiveOpen = anchorEl
    ? anchorEl.id === "catalog-archive-parent"
    : false;
  const itemRulesOpen = anchorEl ? anchorEl.id === "item-rules-parent" : false;
  const wrapReportOpen = anchorEl
    ? anchorEl.id === "wrap-report-parent"
    : false;

  const cardData = [
    {
      titleText: "Q1 Ordering",
      ariaOwnsState: preOrderOpen,
      ariaOwnsText: "pre-order",
      id: "pre-order-parent",
      link: "/programs",
      info:
        "Place your Quarter One Pre-Order. Orders are placed in groups based on programs and distributors that are availiable within your assigned Regions and Key Accounts",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Q1_Ordering_tg2ryl.png",
    },
    {
      titleText: "On-Demand Order",
      ariaOwnsState: onDemandOpen,
      ariaOwnsText: "on-demand",
      id: "on-demand-parent",
      link: "/orders/items/onDemand",
      info:
        "Place orders for items that will need to be produced for your order",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Place_On_Demand_Order_zoymv2.png",
    },
    {
      titleText: "In-Stock Order",
      ariaOwnsState: inStockOpen,
      ariaOwnsText: "in-stock",
      id: "in-stock-parent",
      link: "/orders/items/inStock",
      info:
        "Place orders for items that are currently available in our inventory",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Place_In_Stock_Order_skvxpj.png",
    },
    {
      titleText: "Order History",
      ariaOwnsState: historyOpen,
      ariaOwnsText: "order-history",
      id: "history-parent",
      link: "/orders/history/group/byOrder",
      info:
        "View order history grouped by item or order & get tracking information",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Order_History_jvvgmh.png",
    },
    {
      titleText: "Item Catalog: Current",
      ariaOwnsState: catalogCurrentOpen,
      ariaOwnsText: "catalog-current",
      id: "catalog-current-parent",
      link: "/items/all",
      info: "View catalog of and details about currently available items",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Item_Catalog_Current_ykkrrc.png",
    },
    {
      titleText: "Item Catalog: Archive",
      ariaOwnsState: catalogArchiveOpen,
      ariaOwnsText: "catalog-archive",
      id: "catalog-archive-parent",
      link: "/items/all",
      //link: "/items/archive"
      info: "View archive of and details about currently available items",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Item_Catalog_Archive_wgetjy.png",
    },
    {
      titleText: "Item Rules",
      ariaOwnsState: itemRulesOpen,
      ariaOwnsText: "item-rules",
      id: "item-rules-parent",
      link: "/compliance/items",
      info: "View details about regional item compliance",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Item_Rules_r2iepr.png",
    },
    {
      titleText: "Wrap Up Report",
      ariaOwnsState: wrapReportOpen,
      ariaOwnsText: "wrap-up-report",
      id: "wrap-report-parent",
      link: "/reports/wrap-up",
      info: "View wrap up report",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1610483653/prod/Icons/Wrap_Up_Reports_hwy0en.png",
    },
  ];
  return (
    <Grid container spacing={6} justify="center" style={{ width: "80%" }}>
      <div style={{ paddingLeft: "24px", width: "100%", textAlign: "left" }}>
        <Typography className={classes.titleText}>
          {`Welcome back ${name}!`}
        </Typography>
      </div>
      {cardData.map((data, index) => (
        <Grid
          item
          lg={3}
          md={4}
          sm={6}
          xs={12}
          component={Link}
          to={data.link}
          key={index}
        >
          <div className={classes.dashboardGridItem}>
            <Paper className={classes.dashPaper} elevation={5}>
              <div
                id={data.id}
                className={classes.innerPaper}
                aria-owns={data.ariaOwnsState ? data.ariaOwnsText : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                <div
                  style={{
                    width: "100%",
                    height: "30%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.titleText}>
                    {data.titleText}
                  </Typography>
                </div>
                <Divider className={classes.divider} />
                <ImageWrapper
                  imgUrl={data.icon}
                  alt={data.titleText}
                  imgClass={classes.icon}
                  id={`${data.id}-image`}
                  handleClick={null}
                />
                {/* <img className={classes.icon} src={data.icon} /> */}
              </div>
            </Paper>
          </div>
          <InfoPopover
            id={data.id}
            info={data.info}
            classes={classes}
            open={data.ariaOwnsState}
            anchorEl={anchorEl}
            handlePopoverClose={handlePopoverClose}
          />
        </Grid>
      ))}
    </Grid>
  );
};

FieldDash.propTypes = {
  classes: PropTypes.object.isRequired,
  InfoPopover: PropTypes.func.isRequired,
};

export default FieldDash;
