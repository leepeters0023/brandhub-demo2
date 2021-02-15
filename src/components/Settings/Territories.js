import React, { useState } from "react";

import { useSelector } from "react-redux";

import TerritoryTable from "./TerritoryTable";
import TerritoryModal from "./TerritoryModal";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Territories = () => {
  const classes = useStyles();

  const [modal, handleModal] = useState(false);
  const [modalType, setModalType] = useState("edit");
  const [currentTerritoryId, setCurrentTerritoryId] = useState(null);

  const territoryList = useSelector((state) => state.territories.territoryList);
  const isLoading = useSelector((state) => state.territories.isLoading);

  const handleModalClose = () => {
    handleModal(false);
    setCurrentTerritoryId(null);
  };

  const handleModalOpen = (id, type) => {
    setCurrentTerritoryId(id);
    setModalType(type);
    handleModal(true);
  };

  return (
    <>
      {modal && (
        <TerritoryModal
          open={modal}
          handleClose={handleModalClose}
          type={modalType}
          id={currentTerritoryId}
          territoryList={territoryList}
        />
      )}
      <div className={classes.titleBar}>
      <Typography className={classes.titleText}>Edit Territories</Typography>
      <Button
        className={classes.largeButton}
        variant="contained"
        onClick={() => handleModalOpen(null, "new")}
      >
        NEW TERRITORY
      </Button>
      </div>
      <br />
      <TerritoryTable
        handleTerritoryClick={handleModalOpen}
        territories={territoryList}
        isLoading={isLoading}
      />
    </>
  );
};

export default Territories;
