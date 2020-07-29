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
  dashboard: {
    paper: {
      height: "100%",
      padding: "40px",
    },
    welcomeText: {
      fontWeight: "600",
      color: "#4C4C4C",
    },
    subTitle: {
      fontWeight: "600",
      color: "#4C4C4C",
    },
    content: {
      fontSize: "1.25rem",
      color: "#4C4C4C",
    },
    buttons: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    gridList: {
      flexWrap: "nowrap",
      transform: "translateZ(0)",
    },
    title: {
      color: "#ffac33",
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
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
      fontSize: ".7rem",
      fontWeight: "600",
      color: "#ffac33",
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
      fontWeight: "600",
      fontSize: "1rem",
      textAlign: "center",
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
    gridContainer: {
      margin: "10px auto 0 auto",
      width: "90vw",
    },
    modalTabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    centerWrapper: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
