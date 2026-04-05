import React, { useState, useEffect } from 'react';
import './home.css'


const Home = () => 
<div style={{ padding: '20px' }}>
  <h2 className='mainHeader'>Learn! Grow! Succeed!</h2>

  <div className='component'>
    {<img className='colPhoto' src="col1.png" alt="Learning" />}
    <h4 className='colText' >COURSES — це простір для навчання та зростання.</h4>


    <h4 className='colText' >Обирай напрям, проходь курси у зручному темпі та поступово підвищуй свій рівень знань.</h4>
    {<img className='colPhoto' src="col5.png" alt="Learning" />}

    {<img className='colPhoto' src="col3.png" alt="Learning" />}
    <h4 className='colText' >З нами ти зможеш досягти нових висот у своїй кар'єрі та особистому розвитку.</h4>  
    
    
  </div>

</div>;


export default Home;