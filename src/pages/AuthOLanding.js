import React, { useEffect } from "react";
import { navigate } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";

import { getRedirect, loginWithCode } from "../redux/slices/userSlice";

import Loading from "../components/Utility/Loading";

const AuthOLanding = ({ code }) => {
  const dispatch = useDispatch();
  const link = useSelector((state) => state.user.redirectLink);
  const currentRole = useSelector((state) => state.user.role);
  const isLinkLoading = useSelector((state) => state.user.authIsLoading);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    if (!currentRole && !link && !code && !isLinkLoading) {
      dispatch(getRedirect());
    }
  }, [link, isLinkLoading, code, dispatch, currentRole]);

  useEffect(() => {
    if (!currentRole && link && !code) {
      //window.open(link);
      window.location = link;
    }
  }, [link, code, currentRole]);

  useEffect(() => {
    if (code && !currentRole) {
      dispatch(loginWithCode(code));
    }
  });

  useEffect(() => {
    if (currentRole) {
      navigate("/dashboard");
    }
  }, [currentRole]);

  useEffect(() => {
    if (error) {
      navigate("/whoops");
    }
  }, [error]);

  return <Loading />;
};

export default AuthOLanding;
