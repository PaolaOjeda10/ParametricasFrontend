// import React from 'react';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   withStyles,
//   makeStyles,
//   Box
// } from '@material-ui/core';
// import { WarningOutlined, DoneAll } from '@material-ui/icons';
// import { useSelector, shallowEqual, useDispatch } from 'react-redux';
// import { closeConfirm } from '../../redux/reducer';

// const useStyles = makeStyles((theme) => ({
//   iconWarning: {
//     color: theme.palette.warning.main
//   }
// }));

// const Confirm = () => {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const { show, text, width, textOk, textCancel, callbackOk, callbackCancel } = useSelector(state => ({
//     show: state.plugins.Confirm.show,
//     text: state.plugins.Confirm.text,
//     width: state.plugins.Confirm.width,
//     textOk: state.plugins.Confirm.textOk,
//     textCancel: state.plugins.Confirm.textCancel,
//     callbackOk: state.plugins.Confirm.callbackOk,
//     callbackCancel: state.plugins.Confirm.callbackCancel
//   }), shallowEqual);

//   const DialogCustomized = withStyles(() => ({
//     root: {
//       '& .MuiDialog-paper': {
//         width
//       }
//     }
//   }))(Dialog);

//   const handleClose = () => dispatch(closeConfirm());

//   const handleCancel = () => {
//     dispatch(closeConfirm());
//     if (callbackCancel) callbackCancel();
//   };

//   const handleAccept = () => {
//     dispatch(closeConfirm());
//     if (callbackOk) callbackOk();
//   };

//   return (
//     <DialogCustomized
//       disableEscapeKeyDown
//       disableBackdropClick
//       open={show}
//       onClose={handleClose}
//     >
//       <DialogTitle>
//         <Box display="flex" fontSize={15} flexDirection="row" alignItems="center" justifyItems="start">
//           <WarningOutlined className={classes.iconWarning} />
//           Confirmar
//         </Box>
//       </DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           { text }
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button variant="text" onClick={handleCancel} disableElevation>
//           { textCancel }
//         </Button>
//         <Button startIcon={<DoneAll/>} onClick={handleAccept} variant="contained" color="secondary" autoFocus>
//           { textOk }
//         </Button>
//       </DialogActions>
//     </DialogCustomized>
//   );
// };

// export default Confirm;
