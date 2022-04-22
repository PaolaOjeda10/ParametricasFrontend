import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Aranceles from './Aranceles';
import DocumentosEmitidos from './DocumentosEmitidos';
import ParPublicaciones from './ParPublicaciones';
import CatalogoTramites from './CatalogoTramites';
import { useNavigate } from 'react-router-dom';
import GrupoTabs from './GrupoTabs';
import { Breadcrumbs } from '@material-ui/core';
import { DrawContext } from '../Context/drawer/DrawContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop:'10px',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
link:{
  marginTop:20,
},
}));

function getSteps() {
  return [
    'CATÁLOGO TRÁMITES',
    'GRUPOS',
    'ARANCELES',
    'DOCUMENTOS EMITIDOS',
    'PAR_PUBLICACIONES',
  ];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return <CatalogoTramites />;
    case 1:
      return <GrupoTabs />;
    case 2:
      return <Aranceles />;
    case 3:
      return <DocumentosEmitidos />;
    case 4:
      return <ParPublicaciones />;
    default:
      return '';
  }
}
const CatalogoTInicio = () => {
  const { draw } = React.useContext(DrawContext);
  const navigate = useNavigate();

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  useEffect(() => {
    window.localStorage.removeItem('tramite');
    window.localStorage.removeItem('grupo');
    window.localStorage.removeItem('seccion');
  }, []);

  return (
    <>
    <div style={{ marginRight:'200px', marginLeft: draw?.marginLeft || 200,}}>
    <Breadcrumbs aria-label="breadcrumb" className={classes.link}>
      <Typography >
       Paramétricas
        </Typography>
        <Typography >
        Catálogo trámites
        </Typography>
    </Breadcrumbs>
    <Typography variant="h4" style={{ textAlign: 'center' }}>
            Catálogo Trámites
          </Typography>
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step style={{width:'100%'}} key={label}>
            <StepLabel style={{width:'100%'}} onClick={handleStep(index)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography component={'span'} className={classes.instructions}>
              Datos completos
            </Typography>
            <button onClick={() => navigate('/')}>Guardar</button>
            <br />
          </div>
        ) : (
          <div>
            <Typography component={'span'} className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                style={{ marginBottom: '30px' }}
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Anterior
              </Button>
              <Button
                style={{ marginBottom: '30px' }}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default CatalogoTInicio;
