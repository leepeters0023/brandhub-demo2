import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Link, navigate } from "@reach/router";
import { CSVLink } from "react-csv";
import { CSVReader } from "react-papaparse";
import format from "date-fns/format";

import { useDispatch, useSelector } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { setRetain } from "../redux/slices/filterSlice";
import {
  fetchSinglePO,
  submitPurchaseOrder,
} from "../redux/slices/purchaseOrderSlice";

import CurrentPO from "../components/SupplierManagement/CurrentPO";
import Loading from "../components/Utility/Loading";
import ShippingParameterTable from "../components/SupplierManagement/ShippingParameterTable";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import PublishIcon from "@material-ui/icons/Publish";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrder = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const csvRef = useRef(null);

  const [isNew, setIsNew] = useState(false);
  const [isUploadLoading, setUploadLoading] = useState(false);
  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });

  const isPOLoading = useSelector((state) => state.purchaseOrder.isLoading);
  const currentPO = useSelector((state) => state.purchaseOrder.currentPO);
  const currentRole = useSelector((state) => state.user.role);

  const handleSupplierSubmit = () => {
    //TODO
  };

  const handleSupplierDecline = () => {
    //TODO
  };

  const handlePurchaserSubmit = () => {
    dispatch(submitPurchaseOrder(currentPO.id));
    navigate("/purchasing/poHistory/current");
  };

  const handleOpenDialog = (evt) => {
    if (csvRef.current) {
      csvRef.current.open(evt);
    }
  };

  const handleFileUpload = (data) => {
    //todo
    setUploadLoading(false);
    console.log(data);
  };

  const handleFileUploadError = (err, file, inputElem, reason) => {
    //todo, modal?
    console.log(err, file, inputElem, reason);
  };

  useRetainFiltersOnPopstate("/purchasing/poRollup", dispatch);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPO.id && !isPOLoading && window.location.hash === "#new") {
      window.location.hash = currentPO.id;
      setIsNew(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPO.id]);

  useEffect(() => {
    if (!currentPO.id && window.location.hash !== "#new") {
      dispatch(fetchSinglePO(window.location.hash.slice(1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPO.id && currentCSV.data.length === 0) {
      let csvHeaders = [
        { label: "Param Item Id", key: "paramItemId" },
        { label: "PO Number", key: "poNum" },
        { label: "Key Account (y/n)", key: "isKeyAccount" },
        { label: "Key Account Name", key: "keyAccountName" },
        { label: "Requested Ship Date", key: "expectedShip" },
        { label: "ABN", key: "abn" },
        { label: "Distributor Name", key: "distributor" },
        { label: "Address1", key: "addressOne" },
        { label: "Address2", key: "addressTwo" },
        { label: "City", key: "city" },
        { label: "State", key: "state" },
        { label: "Zip", key: "zip" },
        { label: "Item Number", key: "sequenceNum" },
        { label: "Labeling Info", key: "label" },
        { label: "Total Quantity", key: "totalItems" },
        { label: "Order Approval Status", key: "shipStatus" },
        { label: "Ship From Zip", key: "shipFromZip" },
        { label: "Carrier", key: "carrier" },
        { label: "Service Level", key: "serviceLevel" },
        { label: "Actual Ship Date", key: "actShipDate" },
        { label: "Shipped Quantity", key: "shippedQuantity" },
        { label: "Package Count", key: "packageCount" },
        { label: "Package Type", key: "packageType" },
        { label: "Tracking Number", key: "trackingNum" },
        { label: "Weight", key: "weight" },
        { label: "Tax", key: "tax" },
        { label: "Expected Arrival Date", key: "expectedArrival" },
      ];
      let csvData = [];
      currentPO.poItems.forEach((item) => {
        currentPO.shippingParams.forEach((param) => {
          let currentParamItem = param.items.find(
            (i) => i.sequenceNum === item.sequenceNum
          );
          if (currentParamItem) {
            let dataObject = {
              paramItemId: currentParamItem.id,
              poNum: currentPO.id,
              isKeyAccount: "* TODO *",
              keyAccountName: "* TODO *",
              expectedShip: format(
                new Date(currentPO.expectedShip),
                "MM/dd/yyyy"
              ),
              abn: "* TODO *",
              distributor: param.distributor,
              addressOne: param.addressOne,
              addressTwo: param.addressTwo,
              city: param.city,
              state: param.state,
              zip: param.zip,
              sequenceNum: currentParamItem.sequenceNum,
              label: "* TODO *",
              totalItems: currentParamItem.totalItems,
              shipStatus: currentParamItem.shipStatus,
              shipFromZip: "",
              carrier: "",
              serviceLevel: "",
              actShipDate: "",
              shippedQuantity: "",
              packageCount: "",
              packageType: "",
              trackingNum: "",
              weight: "",
              tax: "",
              expectedArrival: "",
            };
            csvData.push(dataObject);
          }
        });
      });
      setCurrentCSV({ data: csvData, headers: csvHeaders });
    }
  }, [
    currentCSV.data.length,
    currentPO.expectedShip,
    currentPO.id,
    currentPO.poItems,
    currentPO.shippingParams,
  ]);

  if (isPOLoading || !currentPO.id) {
    return <Loading />;
  }
  console.log(isUploadLoading);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            {!isNew && (
              <Tooltip title="Back to PO History" placement="bottom-start">
                <IconButton
                  component={Link}
                  to="/purchasing/poHistory/current"
                  onClick={() => {
                    dispatch(setRetain({ value: true }));
                  }}
                >
                  <ArrowBackIcon fontSize="large" color="secondary" />
                </IconButton>
              </Tooltip>
            )}
            {isNew && (
              <Tooltip title="Back to PO Rollup" placement="bottom-start">
                <IconButton
                  component={Link}
                  to="/purchasing/poRollup"
                  onClick={() => {
                    dispatch(setRetain({ value: true }));
                  }}
                >
                  <ArrowBackIcon fontSize="large" color="secondary" />
                </IconButton>
              </Tooltip>
            )}
            <Typography className={classes.titleText}>
              {`Purchase Order #${currentPO.id}`}
            </Typography>
          </div>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv} style={{alignItems: "flex-start"}}>
              {currentRole !== "supplier" && (
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  startIcon={<PublishIcon />}
                >
                  ORDER INFO
                </Button>
              )}
              {currentRole === "supplier" && (
                <>
                  <CSVLink
                    data={currentCSV.data}
                    headers={currentCSV.headers}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      className={classes.largeButton}
                      style={{ marginRight: "10px" }}
                      variant="contained"
                      color="secondary"
                      startIcon={<GetAppIcon />}
                    >
                      SHIPPING
                    </Button>
                  </CSVLink>
                  <Button
                    className={classes.largeButton}
                    style={{ marginRight: "10px" }}
                    variant="contained"
                    color="secondary"
                    startIcon={<GetAppIcon />}
                  >
                    ORDER INFO
                  </Button>
                  <CSVReader
                    ref={csvRef}
                    onFileLoad={handleFileUpload}
                    onError={handleFileUploadError}
                    noClick
                    noDrag
                    config={{
                      header: true,
                      beforeFirstChunk: (_chunk) => {
                        setUploadLoading(true);
                      },
                    }}
                    noProgressBar
                  >
                    {({ file }) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "fit-content",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          className={classes.largeButton}
                          style={{
                            width: isUploadLoading ? "132.93px" : "auto",
                          }}
                          variant="contained"
                          color="secondary"
                          startIcon={<PublishIcon />}
                          onClick={handleOpenDialog}
                        >
                          {isUploadLoading ? (
                            <CircularProgress size={27.78} />
                          ) : (
                            "SHIPPING"
                          )}
                        </Button>
                        {file && (
                          <Typography variant="body2" color="textSecondary">
                            {file.name}
                          </Typography>
                        )}
                      </div>
                    )}
                  </CSVReader>
                </>
              )}
            </div>
          </div>
        </div>
        <br />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CurrentPO currentPO={currentPO} />
          <br />
          {currentRole !== "supplier" && (
            <>
              {(isNew || currentPO.status === "draft") && (
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  onClick={handlePurchaserSubmit}
                >
                  SUBMIT PURCHASE ORDER
                </Button>
              )}
              {currentPO.status === "submitted" && (
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                >
                  SUBMIT EDITS
                </Button>
              )}
            </>
          )}
          {currentRole === "supplier" && !currentPO.accepted && (
            <div style={{ display: "flex" }}>
              <Button
                style={{ marginRight: "10px" }}
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleSupplierSubmit();
                }}
              >
                Accept
              </Button>
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleSupplierDecline();
                }}
              >
                Decline
              </Button>
            </div>
          )}
          <br />
          <div
            style={{
              width: "75%",
              minWidth: "1000px",
              padding: "10px 20px",
            }}
          >
            <div className={classes.titleBar}>
              <Typography className={classes.titleText}>
                Shipping Info
              </Typography>
            </div>
            <br />
            <br />
            <ShippingParameterTable
              classes={classes}
              shippingInfo={currentPO.shippingParams}
            />
            <br />
            <br />
          </div>
        </div>
        <br />
        <br />
      </Container>
    </>
  );
};

PurchaseOrder.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default PurchaseOrder;
