import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogCampos(props) {
  const { open, data, close } = props;
  const {
    campo,
    tipo,
    label,
    tooltip,
    orden,
    iop,
    desabilitado,
    valorDefecto,
    validacion,
    parametrica,
    parametricaText,
    campoPadre,
    campoHijo,
    observable,
    filtro,
    kardex,
    maxMinFecha,
    size,
    tabla,
    cantidadMax,
    documentoSoporte,
    codigoTipoDocumento,
    codigoTipoPublicacion,
    criterioOpcional,
    estado,
    idSeccion,
  } = data;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={close}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Campos : {campo || ''}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">DESCRIPCIÓN:</TableCell>
                  <TableCell align="left">DATOS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">Campo:</TableCell>
                  <TableCell align="left">{campo || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Estado:</TableCell>
                  <TableCell align="left">{estado || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Tipo:</TableCell>
                  <TableCell align="left">{tipo || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Label:</TableCell>
                  <TableCell align="left">{label || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Tooltip:</TableCell>
                  <TableCell align="left">{tooltip || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Orden:</TableCell>
                  <TableCell align="left">{orden || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Iop:</TableCell>
                  <TableCell align="left">{iop || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Deshabilitado:</TableCell>
                  <TableCell align="left">{desabilitado ? 'SI' : 'NO'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Observable:</TableCell>
                  <TableCell align="left">{observable ? 'SI' : 'NO'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">ValorDefecto:</TableCell>
                  <TableCell>{valorDefecto || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Validación:</TableCell>
                  <TableCell align="left">{validacion + ', ' || []}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Paramétrica:</TableCell>
                  <TableCell align="left">{parametrica || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">ParamétricaText:</TableCell>
                  <TableCell align="left">{parametricaText || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">CampoPadre:</TableCell>
                  <TableCell align="left">{campoPadre || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">CampoHijo:</TableCell>
                  <TableCell align="left">{campoHijo || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Filtro:</TableCell>
                  <TableCell align="left">{filtro || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">MaxMinFecha:</TableCell>
                  <TableCell align="left">{maxMinFecha || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Size:</TableCell>
                  <TableCell align="left">{size || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Tabla:</TableCell>
                  <TableCell align="left">{tabla || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Kardex:</TableCell>
                  <TableCell align="left">{kardex || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">CantidadMax:</TableCell>
                  <TableCell align="left">{cantidadMax || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">DocumentoSoporte:</TableCell>
                  <TableCell align="left">{documentoSoporte ? 'SI' : 'NO'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">CodigoTipoDocumento:</TableCell>
                  <TableCell align="left">{codigoTipoDocumento || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">CódigoTipoPublicación:</TableCell>
                  <TableCell align="left">{codigoTipoPublicacion || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">CriterioOpcional:</TableCell>
                  <TableCell align="left">{criterioOpcional || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">IdSección:</TableCell>
                  <TableCell align="left">{idSeccion || ''}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
