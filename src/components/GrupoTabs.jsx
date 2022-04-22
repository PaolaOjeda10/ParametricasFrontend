import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Secciones from './Secciones';
import Camposs from './Camposs';
import Grupos from './Grupos';
import { Grid } from '@material-ui/core';

// const AddForm = (props) =>

const GrupoTabs = (props) => {
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Grid
        role="tabpanel"
        hidden={value !== index}
        style={{width:'100%'}}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-taDocumentosEmitidosb-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </Grid>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    boxShadow: 'none',
    },
    formControl: {
      margin: theme.spacing(1),
      paddingTop: 30,
    },
    container: {
      maxHeight: 440,
      width:'100%',
    },
    checkbox: {
      flexDirection: 'initial',
    },
    tab:{
      backgroundColor:'#ffffff73',
      color:'#3f51b5'
    }
  }));
  // fin tabs
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <Grid container className="grid">
        <AppBar position="static" style={{color:'rgb(5 17 84)',backgroundColor:'#ffffff73'}} 
        // className={classes.tab}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="#3f51b5"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab style={{minWidth:'30%'}} label="Grupos" {...a11yProps(0)} />
            <Tab style={{minWidth:'30%'}} label="Secciones" {...a11yProps(1)} />
            <Tab style={{minWidth:'30%'}} label="Campos" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Grupos />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Secciones />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Camposs />
        </TabPanel>
      </Grid>
    </div>
  );
};

export default GrupoTabs;
