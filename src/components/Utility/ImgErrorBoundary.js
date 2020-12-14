import React, { Component } from "react";
import PropTypes from "prop-types";

class ImgErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(_error, _info) {
    console.error("There was a problem loading this image ...");
  }

  render() {
    if (this.state.hasError) {
      return (
        <img
          src="/images/NotFound.png"
          alt={this.props.alt}
          className={this.props.imgClass}
          id={this.props.id}
        />
      );
    }
    return this.props.children;
  }
}

ImgErrorBoundary.propTypes = {
  alt: PropTypes.string.isRequired,
  imgClass: PropTypes.any.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ImgErrorBoundary;
