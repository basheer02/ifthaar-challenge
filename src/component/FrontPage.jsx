import React from 'react';
import { Link } from 'react-router-dom'; // Import Link if using React Router
import IMAGES from '../images/Images'

const styles = {
    card: {
      backgroundColor: 'skyblue',
      color: 'white',
      padding: '20px',
      height: '110px',
      margin:'15px',
      borderRadius: '15px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '24px'
    },
  };
  
  function FrontPage() {
    return (
      <div className="w-screen h-screen lg:w-2/3 xl:w-1/3 mx-auto shadow-md bg-sky-100 border rounded-xl">
        <img src={IMAGES.image1} alt="Welcome" style={{padding: '3px', border: 'rounded', borderRadius: '10px',}} />
        <div style={styles.card}>
          <Link to="/home" style={styles.link}>
            Take Challenge    {'>>>'}
          </Link>
        </div>
      </div>
    );
  }
  

export default FrontPage;
