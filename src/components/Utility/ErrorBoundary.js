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
      this.props.inStockOrder ||
      this.props.onDemandOrder ||
      this.props.orderHistory ||
      this.props.items ||
      this.props.programTable ||
      this.props.patchOrder
    ) {
      if (this.props.programs) {
        throw this.props.programs
      } else if (this.props.inStockOrder) {
        throw this.props.inStockOrder
      } else if (this.props.onDemandOrder) {
        throw this.props.onDemandOrder
      } else if (this.props.orderHistory) {
        throw this.props.orderHistory
      } else if (this.props.items) {
        throw this.props.items
      } else if (this.props.programTable) {
        throw this.props.programTable
      } else if (this.props.patchOrder) {
        throw this.props.patchOrder
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
    inStockOrder: state.inStockOrder.error,
    onDemandOrder: state.onDemandOrder.error,
    orderHistory: state.orderHistory.error,
    items: state.items.error,
    programTable: state.programTable.error,
    patchOrder: state.patchOrder.error,
  };
  return errors;
};

export default connect(mapStateToProps)(ErrorBoundary);
