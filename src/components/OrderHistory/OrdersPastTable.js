import React from "react";
import PropTypes from "prop-types";

import MaterialTable from "material-table";
import CircularProgress from "@material-ui/core/CircularProgress";

import { tableIcons } from "../../utility/tableIcons";

//mock data
import { orderHistory } from "../../assets/mockdata/orderHistory";

const byOrderRows = orderHistory.map((data) => ({
  orderNum: data.orderNum,
  distributor: data.distributor,
  program: data.program,
  state: data.state,
  orderDate: data.orderDate,
  shipDate: data.shipDate,
  trackingNum: data.trackingNum,
  orderTotal: data.orderTotal,
  orderStatus: data.orderStatus,
}));

const byItemRows = orderHistory.map((data) => ({
  sequenceNum: data.sequenceNum,
  orderNum: data.orderNum,
  brand: data.brand,
  itemType: data.itemType,
  program: data.program,
  qty: data.qty,
  distributor: data.distributor,
  orderDate: data.orderDate,
  shipDate: data.shipDate,
  trackingNum: data.trackingNum,
  itemStatus: data.itemStatus,
}));

const OrdersPastTable = ({ handlePreview, tableType }) => {
  if (!tableType) {
    return <CircularProgress />;
  }
  if (tableType === "byItems") {
    return (
      <>
        <MaterialTable
          title="Order History by Items"
          columns={[
            { title: "Sequence #", field: "sequenceNum" },
            { title: "Ord. #", field: "orderNum" },
            { title: "Brand", field: "brand" },
            { title: "Item Type", field: "itemType" },
            { title: "Program", field: "program" },
            { title: "Quantity", field: "qty", filtering: false },
            {
              title: "Distributor",
              field: "distributor",
              render: (rowData) => (
                <div style={{ width: "200px" }}>
                  <p>{rowData.distributor}</p>
                </div>
              ),
            },
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
          onRowClick={(evt, selectedRow) => {
            handlePreview(`${selectedRow.sequenceNum}`, "item");
          }}
          icons={tableIcons}
        />
      </>
    );
  } else if (tableType === "byOrder") {
    return (
      <>
        <MaterialTable
          title="Order History by Order"
          columns={[
            { title: "Ord. #", field: "orderNum" },
            {
              title: "Distributor",
              field: "distributor",
              render: (rowData) => (
                <div style={{ width: "200px" }}>
                  <p>{rowData.distributor}</p>
                </div>
              ),
            },
            { title: "Program", field: "program" },
            { title: "State", field: "state" },
            { title: "Order Date", field: "orderDate", filtering: false },
            { title: "Ship Date", field: "shipDate", filtering: false },
            { title: "Track. #", field: "trackingNum" },
            { title: "Total", field: "orderTotal", filtering: false },
            { title: "Order Status", field: "orderStatus" },
          ]}
          data={byOrderRows}
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
          onRowClick={(evt, selectedRow) => {
            handlePreview(`${selectedRow.orderNum}`, "order");
          }}
          icons={tableIcons}
        />
      </>
    );
  }
};

OrdersPastTable.propTypes = {
  handlePreview: PropTypes.func.isRequired,
  tableType: PropTypes.string.isRequired,
};

export default OrdersPastTable;
