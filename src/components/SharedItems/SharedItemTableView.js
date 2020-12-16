import React from "react";
import PropTypes from "prop-types";

import ImageWrapper from "../Utility/ImageWrapper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "preview", label: "Preview" },
  { id: "sequenceNum", label: "Sequence #" },
  { id: "program", label: "Program" },
  { id: "itemType", label: "Item Type" },
  { id: "itemDescription", label: "Item Desc." },
  { id: "brand", label: "Brand" },
  { id: "inMarketDate", label: "In Market Date" },
];

const ItemTableHead = ({ classes }) => (
  <TableHead>
    <TableRow>
      {headCells.map((cell) => (
        <TableCell className={classes.headerText} key={cell.id} align="left">
          {cell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const SharedItemTableView = ({ items, handlePreview, isItemsLoading }) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 250px)" }}
      >
        <Table className={classes.table} aria-label="shared-items" stickyHeader>
          <ItemTableHead classes={classes} />
          <TableBody>
            {!isItemsLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={7}>
                  <Typography className={classes.headerText}>
                    {`There are no items items shared..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isItemsLoading &&
              items.length > 0 &&
              items.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell align="left">
                    <ImageWrapper
                      id={item.sequenceNum}
                      imgClass={classes.previewImageFloat}
                      alt={item.itemType}
                      imgUrl={item.imgUrlThumb}
                      handleClick={() => handlePreview(item.id)}
                    />
                  </TableCell>
                  <TableCell align="left">{item.sequenceNum}</TableCell>
                  <TableCell align="left">{item.program}</TableCell>
                  <TableCell align="left">{item.itemType}</TableCell>
                  <TableCell align="left">{item.itemDescription}</TableCell>
                  <TableCell align="left">{item.brand}</TableCell>
                  <TableCell align="left">{item.inMarketDate}</TableCell>
                </TableRow>
              ))}
            {isItemsLoading && (
              <TableRow>
                <TableCell align="left" colSpan={7}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

SharedItemTableView.propTypes = {
  items: PropTypes.array,
  handlePreview: PropTypes.func.isRequired,
  isItemsLoading: PropTypes.bool.isRequired,
};

export default SharedItemTableView;
