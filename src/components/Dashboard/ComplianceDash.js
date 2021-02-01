import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import ImageWrapper from "../Utility/ImageWrapper";

import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const ComplianceDash = ({ classes, name, InfoPopover }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const catalogCurrentOpen = anchorEl
    ? anchorEl.id === "catalog-current-parent"
    : false;
  const catalogArchiveOpen = anchorEl
    ? anchorEl.id === "catalog-archive-parent"
    : false;
  const itemRulesOpen = anchorEl ? anchorEl.id === "item-rules-parent" : false;
  const generalRulesOpen = anchorEl
    ? anchorEl.id === "general-rules-parent"
    : false;

  const cardData = [
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
      link: "/items/archive",
      info: "View archive of and details about items no longer available",
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
      ariaOwnsState: generalRulesOpen,
      ariaOwnsText: "wrap-up-report",
      id: "general-rules-parent",
      link: "/compliance/rules",
      info: "View details bout specific rules",
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

ComplianceDash.propTypes = {
  classes: PropTypes.object.isRequired,
  InfoPopover: PropTypes.func.isRequired,
  currentMonth: PropTypes.number,
};

export default ComplianceDash;