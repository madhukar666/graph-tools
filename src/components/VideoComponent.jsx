import React from 'react';

export const VideoComponent = () => {
    return (
        <div className="text-center">
            <video
                width="100%" // Set the width as needed
                height="auto" // Set height to auto for responsiveness
                loop // Loop the video if desired
                autoPlay // Autoplay the video

            >
                <source src="/images/GraphAnimation.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

