import { Breadcrumbs, Typography } from '@material-ui/core';
import React, { useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import GrainIcon from '@material-ui/icons/Grain';
import { DrawContext } from '../Context/drawer/DrawContext';

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    // color:'#747373'
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));
const Inicio = () => {
  const { draw } = React.useContext(DrawContext);
  useEffect(() => {
    // getDatosCatalogo();
  }, []);

  const classes = useStyles();

  return (
    <>
      <div style={{marginTop:'10px',height:'850px',marginRight:'200px', marginLeft: draw?.marginLeft || 200, }}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.link}>
      <Typography>
        <GrainIcon className={classes.icon} />
       Paramétricas
        </Typography>
        <Typography >
        <HomeIcon className={classes.icon} />
       Inicio
        </Typography>
    </Breadcrumbs>
    <Typography variant="h4" style={{ textAlign: 'center' }}>
            Bienvenid@
          </Typography>
      </div>
    </>
  );
};

export default Inicio;
