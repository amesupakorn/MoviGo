"use client";

import "@/app/styles/loading/two.css";

const LoadTwo = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
            <div className="loadtwo flex space-x-2">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </div>
    );
};

export default LoadTwo;