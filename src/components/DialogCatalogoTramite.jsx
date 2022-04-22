import React from 'react';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
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

export default function DialogCatalogoTramite(props) {
  const { open, data, close } = props;
  const {
    idParametricaCategoria,
    nombre,
    codigo,
    estado,
    tipo,
    tipoCatalogo,
    tipoSocietarioHabilitado,
    tipoTramiteHabilitado,
    version,
    requiereRegistrarEditarSeccion,
    requierePago,
    requierePresentacion,
    requiereRevision,
    requierePublicacion,
    emiteCertificado,
    requiereMatriculaVigente,
    duracion,
    kardex,
    api,
    rutaFront,
    preRutaFront,
    metodoObtenerInformacion,
    metodoValidarDatos,
    metodoDespuesDelPago,
    metodoVolcarDatos,
    metodoPublicar
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
          Catálogo Trámite : {nombre}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Descripción</TableCell>
                  <TableCell align="left">Dato</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">Nombre</TableCell>
                  <TableCell align="left">{nombre || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Código:</TableCell>
                  <TableCell align="left">{codigo || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Tipo:</TableCell>
                  <TableCell align="left">{tipo || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Estado:</TableCell>
                  <TableCell align="left">{estado || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">TipoCatalogo:</TableCell>
                  <TableCell align="left">{tipoCatalogo || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">TipoSocietarioHabilitado:</TableCell>
                  <TableCell align="left">
                    {tipoSocietarioHabilitado + '' || ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">TipoTramiteHabilitado:</TableCell>
                  <TableCell align="left">
                    {tipoTramiteHabilitado+'' || ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Versión:</TableCell>
                  <TableCell align="left">{version || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">
                    RequiereRegistrarEditarSección:
                  </TableCell>
                  <TableCell align="left">
                    {requiereRegistrarEditarSeccion ? 'SI' : 'NO'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">RequierePago:</TableCell>
                  <TableCell align="left">
                    {requierePago ? 'SI' : 'NO'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">RequierePresentación:</TableCell>
                  <TableCell align="left">
                    {requierePresentacion ? 'SI' : 'NO'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">RequiereRevisión:</TableCell>
                  <TableCell align="left">
                    {requiereRevision ? 'SI' : 'NO'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">RequierePublicación:</TableCell>
                  <TableCell align="left">
                    {requierePublicacion ? 'SI' : 'NO'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">EmiteCertificado:</TableCell>
                  <TableCell align="left">
                    {emiteCertificado ? 'SI' : 'NO'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Duración:</TableCell>
                  <TableCell align="left">{duracion || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Api:</TableCell>
                  <TableCell align="left">{api || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">RutaFront:</TableCell>
                  <TableCell align="left">{rutaFront || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">PreRutaFront:</TableCell>
                  <TableCell align="left">{preRutaFront || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">RequiereMatrículaVigente:</TableCell>
                  <TableCell align="left">
                    {requiereMatriculaVigente ? 'SI' : 'NO'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Kardex:</TableCell>
                  <TableCell align="left">{kardex || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">MétodoObtenerInformación:</TableCell>
                  <TableCell align="left">
                    {metodoObtenerInformacion || ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">MétodoValidarDatos:</TableCell>
                  <TableCell align="left">{metodoValidarDatos || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">MétodoDespuesDelPago:</TableCell>
                  <TableCell align="left">
                    {metodoDespuesDelPago || ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">MétodoVolcarDatos:</TableCell>
                  <TableCell align="left">{metodoVolcarDatos || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Método Publicar:</TableCell>
                  <TableCell align="left">{metodoPublicar || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">IdParametricaCategoria:</TableCell>
                  <TableCell align="left">
                    {idParametricaCategoria || ''}
                  </TableCell>
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
