import React from 'react';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../pageStyles/TermsAndConditions.css';

const TermsAndConditions = () => {
    return (
        <>
            <PageTitle title="Terms and Conditions" />
            <Navbar />
            <div className="terms-and-conditions-container">
                <h1>Terms and Conditions</h1>
                <p>This is the terms and conditions page. Content to be added soon.</p>
            </div>
            <Footer />
        </>
    );
};

export default TermsAndConditions;
