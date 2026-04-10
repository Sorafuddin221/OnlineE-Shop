import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

function AboutUs() {
  return (
    <>
      <PageTitle title="About Us - My Website" />
      <Navbar />
      <div style={{ textAlign: 'center', margin: '15rem' }}>
        <h1>About Us</h1>
        <p>This is the about us page.</p>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
