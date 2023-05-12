import React from 'react';

function ProgressBar({progress}) {
    return (
        progress !== 0 &&
        <div className="progress-bar" style={{ display: "block", width: progress + "%" }}></div>
    );
}

export default ProgressBar;