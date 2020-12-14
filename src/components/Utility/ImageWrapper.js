import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { useImage } from "react-image";

import ImgErrorBoundary from "./ImgErrorBoundary";

import CircularProgress from "@material-ui/core/CircularProgress";

const ImgComp = ({ imgUrl, alt, imgClass, id, handleClick }) => {
  const { src } = useImage({ srcList: [imgUrl, "/images/NotFound.png"] });
  return <img src={src} alt={alt} className={imgClass} id={id} onClick={handleClick}/>;
};

const ImageWrapper = ({ imgUrl, alt, imgClass, id, handleClick }) => {
  return (
    <Suspense fallback={<CircularProgress size={75}/>}>
      <ImgErrorBoundary alt={alt} imgClass={imgClass} id={id}>
        <ImgComp imgUrl={imgUrl} alt={alt} imgClass={imgClass} id={id} handleClick={handleClick} />
      </ImgErrorBoundary>
    </Suspense>
  );
};

ImageWrapper.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  imgClass: PropTypes.any.isRequired,
  id: PropTypes.string.isRequired,
};

export default React.memo(ImageWrapper);
