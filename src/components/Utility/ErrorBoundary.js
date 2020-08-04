import React, { Component } from 'react';
import { Redirect } from "@reach/router";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(_error) {
    return {hasError: true}
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info)
    //add logging service like Sentry
  }

  render() {
    if (this.state.hasError) {
      return <Redirect noThrow to="/whoops" />
    }

    return this.props.children;
  }
}

export default ErrorBoundary
