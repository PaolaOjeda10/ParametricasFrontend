import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { closeMessage } from "../../redux/reducer";

const Messages = () => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.plugins.Message.show);
  const message = useSelector(state => state.plugins.Message.message);
  const theme = useSelector(state => state.plugins.Message.theme);
  const timeout = useSelector(state => state.plugins.Message.timeout);
  const handleClose = () => {
    dispatch(closeMessage())
  }
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={show}
      autoHideDuration={timeout || 5000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={theme}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default Messages;
