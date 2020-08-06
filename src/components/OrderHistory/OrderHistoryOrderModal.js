import React from "react";
import PropTypes from "prop-types";

import MaterialTable from "material-table";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
import { tableIcons } from "../../utility/tableIcons";

//mock data
import { orderHistory } from "../../assets/mockdata/orderHistory";

const byItemRows = orderHistory.map((data) => ({
  sequenceNum: data.sequenceNum,
  brand: data.brand,
  itemType: data.itemType,
  program: data.program,
  qty: data.qty,
  orderDate: data.orderDate,
  shipDate: data.shipDate,
  trackingNum: data.trackingNum,
  itemStatus: data.itemStatus,
}));

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderHistoryOrderModal = ({ handleClose, orderNumber }) => {
  const classes = useStyles();

  return (
    <div style={{ overflow: "hidden" }}>
      <IconButton
        className={classes.closeButton}
        onClick={() => {
          handleClose(false);
        }}
      >
        <CancelIcon fontSize="large" color="secondary" />
      </IconButton>
      <br />
      <br />
      <MaterialTable
        title={`Order #${orderNumber}`}
        columns={[
          { title: "Sequence #", field: "sequenceNum" },
          { title: "Brand", field: "brand" },
          { title: "Item Type", field: "itemType" },
          { title: "Program", field: "program" },
          { title: "Quantity", field: "qty", filtering: false },
          { title: "Order Date", field: "orderDate", filtering: false },
          { title: "Ship Date", field: "shipDate", filtering: false },
          { title: "Track. #", field: "trackingNum" },
          { title: "Compliance", field: "itemStatus" },
        ]}
        data={byItemRows}
        options={{
          filtering: true,
          headerStyle: {
            backgroundColor: "#404040",
            fontWeight: "600",
            position: "sticky",
            top: 0,
            color: "#FFF",
          },
          filterCellStyle: {
            position: "sticky",
          },
          maxBodyHeight: "650px",
          pageSizeOptions: [5, 10, 20, 50, 100],
          exportButton: true,
          exportAllData: true,
        }}
        icons={tableIcons}
      />
    </div>
  );
};

OrderHistoryOrderModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  orderNumber: PropTypes.string,
};

export default OrderHistoryOrderModal;
