import React, { Component } from "react";
import { connect } from "react-redux";
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

  componentDidUpdate() {
    if (
      this.props.programs ||
      this.props.currentOrder ||
      this.props.orderHistory ||
      this.props.items ||
      this.props.preOrderDetails
    ) {
      if (this.props.programs) {
        throw this.props.programs
      } else if (this.props.currentOrder) {
        throw this.props.currentOrder
      } else if (this.props.orderHistory) {
        throw this.props.orderHistory
      } else if (this.props.items) {
        throw this.props.items
      } else if (this.props.preOrderDetails) {
        throw this.props.preOrderDetails
      }
    }
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

const mapStateToProps = (state) => {
  const errors = {
    programs: state.programs.error,
    currentOrder: state.currentOrder.error,
    orderHistory: state.orderHistory.error,
    items: state.items.error,
    preOrderDetails: state.preOrderDetails.error,

  };
  return errors;
};

export default connect(mapStateToProps)(ErrorBoundary);
