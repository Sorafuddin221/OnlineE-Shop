import React from 'react';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../pageStyles/PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <>
            <PageTitle title="Privacy Policy" />
            <Navbar />
            <div className="privacy-policy-container">
                <h1>Privacy Policy</h1>
                <p>This is the privacy policy page. Content to be added soon.</p>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
