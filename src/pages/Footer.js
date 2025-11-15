import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 p-4 text-center">
            <div className="container">
                <p className="mb-0">
                    &copy; {new Date().getFullYear()} BITSA Official Website. All Rights Reserved.
                </p>
                <p>
                    <a href="#" className="text-white me-2">Facebook</a>|
                    <a href="#" className="text-white mx-2">Twitter</a>|
                    <a href="#" className="text-white ms-2">LinkedIn</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;