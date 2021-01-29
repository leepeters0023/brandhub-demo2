import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import { CSVLink } from "react-csv";
import { CSVReader } from "react-papaparse";
import { CloudinaryContext } from "cloudinary-react";
import { openUploadWidget } from "../utility/cloudinary";
import format from "date-fns/format";
import Helmet from "react-helmet";

import { useDispatch, useSelector } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { setRetain } from "../redux/slices/filterSlice";
import {
  fetchSinglePO,
  submitPurchaseOrder,
  acceptPurchaseOrder,
  declinePurchaseOrder,
  completePurchaseOrder,
  updateAllShippingParams,
  addAdditionalFile,
} from "../redux/slices/purchaseOrderSlice";
import { getTracking } from "../redux/slices/trackingSlice";

import CurrentPO from "../components/SupplierManagement/CurrentPO";
import Loading from "../components/Utility/Loading";
import ShippingParameterTable from "../components/SupplierManagement/ShippingParameterTable";
import TrackingModal from "../components/Utility/TrackingModal";

import MuiLink from "@material-ui/core/Link";
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
  const [currentFile, setCurrentFile] = useState(null);
  const [isTrackingOpen, setTrackingOpen] = useCallback(useState(false));

  const isPOLoading = useSelector((state) => state.purchaseOrder.isLoading);
  const currentPO = useSelector((state) => state.purchaseOrder.currentPO);
  const currentRole = useSelector((state) => state.user.role);

  const uploadToCloudinary = () => {
    const options = {
      cloudName: "brandhub",
      uploadPreset: "jyehcpv4",
      showUploadMoreButton: false,
    };
    openUploadWidget(options, (error, file) => {
      if (!error) {
        if (file.event === "success") {
          setCurrentFile(file.info.original_filename);
          dispatch(addAdditionalFile(currentPO.id, file.info.public_id));
        }
      } else {
        console.log(error.toString());
      }
    });
  };

  const handleSupplierAccept = () => {
    dispatch(acceptPurchaseOrder(currentPO.id));
  };

  const handleSupplierDecline = () => {
    dispatch(declinePurchaseOrder(currentPO.id));
  };

  const handleSupplierComplete = () => {
    dispatch(completePurchaseOrder(currentPO.id));
  };

  const handlePurchaserSubmit = () => {
    dispatch(submitPurchaseOrder(currentPO.id));
  };

  const handleOpenDialog = (evt) => {
    if (csvRef.current) {
      csvRef.current.open(evt);
    }
  };

  const handleTrackingClick = (id) => {
    dispatch(getTracking(id));
    setTrackingOpen(true);
  };

  const handleFileUpload = (data) => {
    const mappedData = data.map((dataPoint) => ({
      id: dataPoint.data["Param Item Id"],
      "ship-from-zip": dataPoint.data["Ship From Zip"],
      carrier: dataPoint.data["Carrier"],
      method: dataPoint.data["Ship Method"],
      "actual-ship-date": new Date(dataPoint.data["Actual Ship Date"]),
      "shipped-qty": dataPoint.data["Shipped Quantity"],
      "package-count": dataPoint.data["Package Count"],
      "package-type": dataPoint.data["Package Type"],
      "tracking-number": dataPoint.data["Tracking Number"],
      tax: dataPoint.data["Tax"],
      "expected-arrival-date": new Date(
        dataPoint.data["Expected Arrival Date"]
      ),
    }));
    dispatch(updateAllShippingParams(mappedData, currentPO.id));
    setUploadLoading(false);
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
    if (
      (!currentPO.id && window.location.hash !== "#new") ||
      (currentPO.id &&
        window.location.hash !== "#new" &&
        currentPO.id !== window.location.hash.slice(1))
    ) {
      dispatch(fetchSinglePO(window.location.hash.slice(1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      currentPO.id &&
      currentCSV.data.length === 0 &&
      currentPO.id === window.location.hash.slice(1)
    ) {
      //Add attention, change dist name to dist / add name
      //remove ship from zip, remove package type, expected arrival date
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
        { label: "Attention", key: "attn" },
        { label: "City", key: "city" },
        { label: "State", key: "state" },
        { label: "Zip", key: "zip" },
        { label: "Item Number", key: "itemNumber" },
        { label: "Labeling Info", key: "label" },
        { label: "Total Quantity", key: "totalItems" },
        { label: "Order Approval Status", key: "shipStatus" },
        { label: "Carrier", key: "carrier" },
        { label: "Ship Method", key: "method" },
        { label: "Actual Ship Date", key: "actShipDate" },
        { label: "Shipped Quantity", key: "shippedQuantity" },
        { label: "Package Count", key: "packageCount" },
        { label: "Tracking Number", key: "trackingNum" },
        { label: "Tax", key: "tax" },
      ];
      let csvData = [];
      currentPO.poItems.forEach((item) => {
        currentPO.shippingParams.forEach((param) => {
          let currentParamItem = param.items.find(
            (i) => i.itemNumber === item.itemNumber
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
              abn: param.distributorId ? param.distributorId : "---",
              distributor: param.distributor ? param.distributor : param.name,
              addressOne: param.addressOne,
              addressTwo: param.addressTwo,
              attn: param.attn ? param.attn : "---",
              city: param.city,
              state: param.state,
              zip: param.zip,
              itemNumber: currentParamItem.itemNumber,
              label: currentParamItem.shippingLabel,
              totalItems: currentParamItem.totalItems,
              shipStatus:
                currentParamItem.shipHoldStatus === "approved" ||
                currentParamItem.shipHoldStatus === "ok"
                  ? "Ok"
                  : (currentParamItem.shipHoldStatus === "prior-approval-pending"
                      ? "Pending - On Hold"
                      : "Denied - Don't Ship"),
              carrier:
                currentParamItem.carrier === "---"
                  ? ""
                  : currentParamItem.carrier,
              method:
                currentParamItem.method === "---"
                  ? ""
                  : currentParamItem.method,
              actShipDate:
                currentParamItem.actShipDate === "---"
                  ? ""
                  : currentParamItem.actShipDate,
              shippedQuantity:
                currentParamItem.shippedQuantity === "---"
                  ? ""
                  : currentParamItem.shippedQuantity,
              packageCount:
                currentParamItem.packageCount === "---"
                  ? ""
                  : currentParamItem.packageCount,
              trackingNum:
                currentParamItem.trackingNum === "---"
                  ? ""
                  : currentParamItem.trackingNum,
              tax: currentParamItem.tax === "---" ? "" : currentParamItem.tax,
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

  return (
    <>
      <Helmet><title>RTA | Purchase Order</title>
      <script type="text/javascript">{`Beacon('close')`}</script>
      </Helmet>
      <TrackingModal open={isTrackingOpen} handleClose={setTrackingOpen} />
      <CloudinaryContext cloudName="brandhub">
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
                  <IconButton component={Link} to="/purchasing/poRollup">
                    <ArrowBackIcon fontSize="large" color="secondary" />
                  </IconButton>
                </Tooltip>
              )}
              <Typography className={classes.titleText}>
                {`Purchase Order #${currentPO.id} - ${currentPO.brand.join(
                  ", "
                )}`}
              </Typography>
            </div>
            <div className={classes.configButtons}>
              <div
                className={classes.innerConfigDiv}
                style={{ alignItems: "flex-start" }}
              >
                {currentRole !== "supplier" && (
                  <div style={{ position: "relative" }}>
                    <Button
                      className={classes.largeButton}
                      variant="contained"
                      color="secondary"
                      startIcon={<PublishIcon />}
                      onClick={uploadToCloudinary}
                    >
                      ORDER INFO
                    </Button>
                    {currentFile && (
                      <Typography
                        style={{
                          position: "absolute",
                          top: "Calc(100% + 5px)",
                        }}
                        variant="body2"
                        color="textSecondary"
                      >
                        {`File: ${currentFile}`}
                      </Typography>
                    )}
                  </div>
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
                      component={MuiLink}
                      target="_blank"
                      href={`https://res.cloudinary.com/brandhub/image/upload/fl_attachment/${currentPO.additionalFile}`}
                      disabled={!currentPO.additionalFile}
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
                        <div style={{ position: "relative" }}>
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
                            <Typography
                              style={{
                                position: "absolute",
                                top: "Calc(100% + 5px)",
                              }}
                              variant="body2"
                              color="textSecondary"
                            >
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
                    disabled={!currentPO.isPriceCompliant}
                  >
                    SUBMIT PURCHASE ORDER
                  </Button>
                )}
              </>
            )}
            {currentRole === "supplier" && currentPO.status === "submitted" && (
              <div style={{ display: "flex" }}>
                <Button
                  style={{ marginRight: "10px" }}
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    handleSupplierAccept();
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
            {currentRole === "supplier" && currentPO.status === "in-progress" && (
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={handleSupplierComplete}
              >
                COMPLETE PURCHASE ORDER
              </Button>
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
                handleTrackingClick={handleTrackingClick}
              />
              <br />
              <br />
            </div>
          </div>
          <br />
          <br />
        </Container>
      </CloudinaryContext>
    </>
  );
};

PurchaseOrder.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default PurchaseOrder;
