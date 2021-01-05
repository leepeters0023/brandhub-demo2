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

  const currentQuotesOpen = anchorEl
    ? anchorEl.id === "current-quote-parent"
    : false;
  const quoteHistoryOpen = anchorEl
    ? anchorEl.id === "quote-history-parent"
    : false;
  const currentPOsOpen = anchorEl ? anchorEl.id === "current-po-parent" : false;
  const poHistoryOpen = anchorEl ? anchorEl.id === "po-history-parent" : false;

  const cardData = [
    {
      titleText: "Current Quotes",
      ariaOwnsState: quoteHistoryOpen,
      ariaOwnsText: "current-quotes",
      id: "current-quote-parent",
      link: "/purchasing/rfqHistory/current",
      info: "New and Pending Quotes",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1609786359/prod/Icons/on-demand-order-and-current-quotes_cmoaqi.png",
    },
    {
      titleText: "Quote History",
      ariaOwnsState: currentQuotesOpen,
      ariaOwnsText: "quote-history",
      id: "quote-history-parent",
      link: "/purchasing/rfqHistory/all",
      info: "All Quotes",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1609786359/prod/Icons/item-catalog-archive-and-quote-history_tjl7au.png",
    },
    {
      titleText: "Current Purchase Orders",
      ariaOwnsState: currentPOsOpen,
      ariaOwnsText: "current-po",
      id: "current-po-parent",
      link: "/purchasing/poHistory#current",
      info: "New and Pending Purchase Orders",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1609786360/prod/Icons/pre-order-and-current-PO_suofhu.png",
    },
    {
      titleText: "Purchase Order History",
      ariaOwnsState: poHistoryOpen,
      ariaOwnsText: "po-history",
      id: "po-history-parent",
      link: "/purchasing/poHistory#all",
      info: "All Purchase Orders",
      icon:
        "https://res.cloudinary.com/brandhub/image/upload/v1609786359/prod/Icons/order-history-and-PO-history_lmnw4w.png",
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
