import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import CurrentPrograms from "../components/Purchasing/CurrentPrograms";

import FilterChipList from "../components/Filtering/FilterChipList";

import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TuneIcon from "@material-ui/icons/Tune";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const defaultFilters = {
  bu: [],
  month: [],
  brand: [],
  sortProgramsBy: "brand",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Programs = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [programFilters, setProgramFilters] = useCallback(useState([]));

  const activePrograms = [1, 2, 3] // useSelector((state) => state.programs.programs);
  const isLoading = useSelector((state) => state.programs.isLoading);
  const sortOption = useSelector((state) => state.filters.sortProgramsBy);
  const buFilters = useSelector((state) => state.filters.bu);
  const monthFilters = useSelector((state) => state.filters.month);
  const brandFilter = useSelector((state) => state.filters.brand);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const currentUserRole = useSelector((state) => state.user.role);

  const currentPrograms = [
    {
      id: 1,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg"],
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624035/Select/20_lusezy.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
    {
      id: 2,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png",],
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
    {
      id: 3,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png",],
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
    {
      id: 4,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png",],
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
    {
      id: 5,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png",],
      program: "Home Depot",
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
    {
      id: 6,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png",],
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
    {
      id: 7,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png",],
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
    {
      id: 8,
      itemNumber: "123456",
      itemType: "an item type",
      imgUrlThumb: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg",
      imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg",
      carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg"],
      program: ["a program"],
      estCost: 500,
      brand: ["brand"],
      itemDescription: "a description of the item",
      packSize: "10",
      oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624034/Select/7_tllfj2.jpg",
      focusMonth: "June",
      orderWindowOpen: "06/01/2021",
      orderWindowClose: "07/01/20201",
      name: "The program name",
    },
  ]

  // useProgramSort(
  //   activePrograms,
  //   sortOption,
  //   programFilters
  // );

  useInitialFilters(
    "program",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (
      brandFilter.length === 0 &&
      buFilters.length === 0 &&
      monthFilters.length === 0
    ) {
      setProgramFilters([]);
    } else {
      setProgramFilters(
        brandFilter
          .map((a) => ({ type: "brand", value: a.name }))

          .concat(buFilters.map((b) => ({ type: "unit", value: b })))
          .concat(monthFilters.map((c) => ({ type: "focusMonth", value: c })))
      );
    }
  }, [brandFilter, buFilters, monthFilters, setProgramFilters]);

  return (
    <>
      <Helmet>
        <title> Programs</title>
      </Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Pre-Orders</Typography>

          {currentUserRole !== "compliance" && currentUserRole !== "read-only" && (
            <div className={classes.configButtons}>
              <div className={classes.innerConfigDiv}>
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  startIcon={<ExitToAppIcon />}
                  component={Link}
                  to="/orders/open/preorder"
                  disabled
                >
                  PLACE ORDERS
                </Button>
              </div>
            </div>
          )}
        </div>
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            marginBottom: "10px",
          }}
        >
          <div
            className={classes.showHideFilters}
            onClick={() => {
              handleFilterDrawer(!filtersOpen);
            }}
          >
            <TuneIcon fontSize="small" color="secondary" />
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ margin: "10px 10px" }}
            >
              {filtersOpen ? "Hide Filters" : "Show Filters"}
            </Typography>
          </div>
          <FilterChipList classes={classes} />
          <br />
        </div>
        {isLoading && <CircularProgress color="inherit" />}
        {!isLoading && activePrograms.length > 0 && (
          <CurrentPrograms
            currentUserRole={currentUserRole}
            currentPrograms={currentPrograms}
            filtersOpen={filtersOpen}
          />
        )}
        {!isLoading && activePrograms.length === 0 && (
          <div
            style={{
              width: "100%",
              height: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography className={classes.headerText}>
              There are currently no active Pre Order Programs ...
            </Typography>
          </div>
        )}
      </Container>
    </>
  );
};

Programs.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default Programs;
