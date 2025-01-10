import React, { useState } from 'react';
import NavBar from './nabvar';
import Footer from './footer';
import SectionHeading from '../components/section-heading';

const UserMainPage = () => {
  const [role, setRole] = useState('user'); // Change to 'admin' to test admin view
    
  return (
    <>
      <NavBar role={role} />
     
      <h1><br/><br/></h1>

      <SectionHeading heading="WELCOME, USER" />



      <Footer />
    </>
  );
};

export default UserMainPage;
