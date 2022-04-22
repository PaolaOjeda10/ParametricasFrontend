import React from 'react';

import './ErrorPage.css';

const ErrorPage = () => {

  return (
    <>
    <div className='b'>
       
    <a href="https://codepen.io/uiswarup/full/wvqNWOY">
  <header className="top-header">
</header>
<div className='bd'>
<div>
  <div className="starsec"></div>
  <div className="starthird"></div>
  <div className="starfourth"></div>
  <div className="starfifth"></div>
</div>

<div className="lamp__wrap">
  <div className="lamp">
    <div className="cable"></div>
    <div className="cover"></div>
    <div className="in-cover">
      <div className="bulb"></div>
    </div>
    <div className="light"></div>
  </div>
</div>
<section className="error">
  <div className="error__content">
    <div className="error__message message">
      <h1 className="message__title">No se encunetra la página</h1>
      <p className="message__text">Opps!, la página que estabas buscando no se encuentra aquí.
      El enlace que siguió puede estar roto o ya no existe. Vuelva a intentarlo.</p>
    </div>
    <div className="error__nav e-nav">
    </div>
  </div>

</section>

  </div>
  </a>
    </div>
    </>
  );
};

export default ErrorPage;
