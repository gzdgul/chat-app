import React from 'react';

function ProgressBar({progress}) {
    return (
        (progress !== 0 && progress !== null) &&
        <div className="progress-bar" style={{ display: "block", width: progress + "%" }}></div>
    );
}

export default ProgressBar;