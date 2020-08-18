import React, { useState } from "react";
//import { Link } from "@reach/router";

//import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.dashboard,
}));

const DashboardFieldOne = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div style={{ width: "100%" }}>
      <Accordion
        className={classes.accordian}
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        style={{
          backgroundColor: `${
            expanded === "panel1" ? "whitesmoke" : "#bebebe"
          }`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.titleText}>
            Programs &amp; Products
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid
              item
              md={4}
              sm={12}
              xs={12}
              style={{ textAlign: "center" }}
            >
              <Typography className={classes.headerText}>Calendar</Typography>
              <br />
            </Grid>
            <Grid item md={4} sm={12} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>
                New In-Stock Items
              </Typography>
              <br />
            </Grid>
            <Grid item md={4} sm={12} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>
                Canceled Items
              </Typography>
              <br />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordian}
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
        style={{
          backgroundColor: `${
            expanded === "panel2" ? "whitesmoke" : "#bebebe"
          }`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.titleText}>Your Orders</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>
                New Tracking
              </Typography>
              <br />
            </Grid>
            <Grid item md={3} sm={6} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>
                In Progress
              </Typography>
              <br />
            </Grid>
            <Grid item md={3} sm={6} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>Compliance</Typography>
              <br />
            </Grid>
            <Grid item md={3} sm={6} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>
                Rush Requests
              </Typography>
              <br />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordian}
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
        style={{
          backgroundColor: `${
            expanded === "panel3" ? "whitesmoke" : "#bebebe"
          }`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.titleText}>Your Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2}>
            <Grid item md={4} sm={12} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>
                Order History
              </Typography>
              <br />
            </Grid>
            <Grid item md={4} sm={12} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>Spend</Typography>
              <br />
            </Grid>
            <Grid item md={4} sm={12} xs={12} style={{ textAlign: "center" }}>
              <Typography className={classes.headerText}>Reporting</Typography>
              <br />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DashboardFieldOne;
