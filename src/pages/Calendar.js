import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TuneIcon from "@material-ui/icons/Tune";
import Helmet from "react-helmet";

const useStyles = makeStyles((theme) => ({
    ...theme.global,
    mainWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    singleItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "40px",
        padding: "10px",
    },
}));

const Calendar = ({ handleFiltersClosed, filtersOpen }) => {
    const classes = useStyles();
    
    useEffect(() => {
        handleFiltersClosed();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
    return (
        <>
            <Helmet>
                <title> 2020 Calendar</title>
            </Helmet>
            <Container
                className={classes.mainWrapper}
            >
                <div style={{ height: "100%", width: "1440px", marginTop: "50px" }}>
                    <img src="https://res.cloudinary.com/joshdowns-dev/image/upload/v1607629969/Select/calendar_2_bmy08b.png" />
                </div>
            </Container>
        </>
    );
};

Calendar.propTypes = {
    handleFiltersClosed: PropTypes.func.isRequired,
    filtersOpen: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
};

export default Calendar;
