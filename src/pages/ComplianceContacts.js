import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import { useSelector } from "react-redux";

import EditContactModal from "../components/Compliance/EditContactModal";
import ComplianceContactTable from "../components/Compliance/ComplianceContactTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";


const useStyles = makeStyles((theme) => ({
  ...theme.global
}))

const ComplianceContacts = ({ handleFiltersClosed }) => {
  const classes = useStyles()

  const [open, setOpen] = useCallback(useState(false))
  const [id, setId] = useCallback(useState(null))

  const isLoading = useSelector((state) => state.complianceContacts.isLoading);
  const contacts = useSelector((state) => state.complianceContacts.contacts);

  const handleClose = () => {
    setOpen(false);
  }

  const handleRowClick = (id) => {
    setId(id);
    setOpen(true);
  }

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet><title>RTA | Compliance Contacts</title></Helmet>
      <Container className={classes.mainWrapper}>
        {open && <EditContactModal id={id} open={open} handleClose={handleClose} />}
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Compliance Contacts</Typography>
          <div
            style={{
              display: "flex",
              width: "300px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print Items">
              <IconButton>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
              {/* <CSVLink data={currentOrders} headers={csvHeaders}> */}
              <IconButton>
                <GetAppIcon color="secondary" />
              </IconButton>
              {/* </CSVLink> */}
            </Tooltip>
          </div>
        </div>
        <br />
        <ComplianceContactTable
          contacts={contacts}
          isLoading={isLoading}
          handleRowClick={handleRowClick}
        />
      </Container>
    </>
  )
}

ComplianceContacts.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired
}

export default ComplianceContacts;