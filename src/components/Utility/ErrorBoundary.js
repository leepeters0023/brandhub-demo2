import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "@reach/router";
import FourOhFour from "../../pages/FourOhFour";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    //add logging service like Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Redirect noThrow to="/whoops" />
          <FourOhFour />
        </>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
