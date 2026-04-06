import React from "react";

const VideoSection = () => {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h2 className="text-2xl font-semibold mb-6">
            How Our Products Made
          </h2>

          {/* Video Container */}
          <div
            className="
              w-full
              h-[487px]
              overflow-hidden
              bg-black
              shadow-lg
              rounded-b-[31px]
            "
          >
            <video
              className="w-full h-full object-cover"
              controls
              loop
              preload="metadata"
              poster="/images/video-poster.jpg" // optional
              onEnded={(e) => {
                // Fallback (some browsers/edge cases): ensure replay at end
                e.currentTarget.currentTime = 0;
                e.currentTarget.play();
              }}
            >
              <source
                src="/videos/dryfruits-video.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
