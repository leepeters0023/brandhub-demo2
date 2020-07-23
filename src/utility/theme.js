export default {
  palette: {
    primary: {
      light: "#ffac33",
      main: "#ff9800",
      dark: "#b26a00",
      contrastText: "#fff",
    },
    secondary: {
      light: "#3d6bb3",
      main: "#0d47a1",
      dark: "#093170",
      contrastText: "#fff",
    },
  },
  global: {
    titleImage: {
      display: "flex",
      alignItems: "center",
    },
    previewImg: {
      width: "75px",
      height: "75px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    previewImageFloat: {
      width: "75px",
      height: "75px",
      borderRadius: "50%",
      objectFit: "cover",
      "&:hover": {
        cursor: "pointer",
      },
    },
    navList: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "Calc(100% - 64px)",
      marginTop: "64px",
    },
    navItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center"
    },
    navText: {
      fontSize: ".75rem",
      color: ""
    },
    titleText: {
      fontWeight: "600",
      fontSize: "1.5rem",
      color: "#4C4C4C",
      marginBottom: "5px",
    },
    logo: {
      width: "100px",
      height: "auto",
      marginRight: "50px",
    },
    headerText: {
      fontWeight: "600",
      fontSize: "1rem",
      color: "#4C4C4C",
    },
    bodyText: {
      fontSize: "1rem",
      color: "#4C4C4C",
    },
    titleBar: {
      display: "flex",
      justifyContent: "space-between",
    },
    largeButton: {
      fontWeight: "500",
      fontSize: "1.3rem",
    },
    tabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "30px",
    },
    cartContainer: {
      maxHeight: "65vh",
    },
    paperContainer: {
      margin: "30px auto 0 auto",
      padding: "20px 25px",
      width: "90vw",
    },
    modalTabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    relativeContainer: {
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: "0",
      right: "5px",
    }
  },
};
