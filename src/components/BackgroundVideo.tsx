import { useEffect, useRef, useState } from 'react';

const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const loopStartTime = 2.01;
  const loopEndTime = 29.24;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(error => {
        console.log('Autoplay failed, will play on user interaction:', error);
      });
    };

    const initializeVideo = async () => {
      const videoSrc = 'https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/manifest/video.m3u8';
      
      try {
        // Dynamically import HLS.js
        const HlsModule = await import('hls.js');
        const Hls = HlsModule.default;
        
        if (Hls.isSupported()) {
          console.log('HLS is supported, using HLS.js');
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
          });
          
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed, attempting to play');
            playVideo();
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            // Only log fatal errors, ignore buffer stalled errors
            if (data.fatal) {
              console.error('Fatal HLS error:', data);
              // Try to recover from fatal errors
              if (data.type === 'mediaError') {
                hls.recoverMediaError();
              } else if (data.type === 'networkError') {
                // Reload the source for network errors
                hls.startLoad();
              } else {
                // For other fatal errors, destroy and recreate
                hls.destroy();
                // Fallback to native video
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                  video.src = videoSrc;
                  video.load();
                }
              }
            }
            // Ignore non-fatal buffer stalled errors as they're normal
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          console.log('Native HLS support detected');
          video.src = videoSrc;
          video.addEventListener('loadedmetadata', playVideo);
        } else {
          console.error('HLS is not supported in this browser');
        }
      } catch (error) {
        console.error('Failed to load HLS.js:', error);
        // Fallback to native HLS support
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          console.log('Falling back to native HLS support');
          video.src = videoSrc;
          video.addEventListener('loadedmetadata', playVideo);
        }
      }
    };

    // Video event handlers
    const handleLoadedMetadata = () => {
      console.log('Video loaded, duration:', video.duration);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      if (video.paused) {
        playVideo();
      }
    };

    const handleTimeUpdate = () => {
      if (!hasPlayedOnce) {
        // First play - let it play completely
        if (video.currentTime >= video.duration - 0.1) {
          setHasPlayedOnce(true);
          video.currentTime = loopStartTime;
          console.log('First play complete, starting custom loop');
        }
      } else {
        // Subsequent plays - loop from 2.01 to 29.24
        if (video.currentTime >= loopEndTime) {
          video.currentTime = loopStartTime;
          console.log('Loop: jumping back to', loopStartTime);
        }
      }
    };

    const handleEnded = () => {
      console.log('Video ended event triggered');
      setHasPlayedOnce(true);
      video.currentTime = loopStartTime;
      video.play().then(() => {
        console.log('Video restarted successfully');
      }).catch(error => {
        console.error('Error restarting video:', error);
      });
    };

    const handlePause = () => {
      if (!video.ended) {
        console.log('Video paused, resuming...');
        video.play();
      }
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      // Fallback: show a message or alternative content
      const overlay = document.querySelector('.content-overlay') as HTMLElement;
      if (overlay) {
        overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Initialize video
    initializeVideo();

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [hasPlayedOnce]);

  return (
    <video 
      ref={videoRef}
      id="background-video"
      autoPlay 
      muted 
      playsInline 
      preload="auto"
    >
      <source src="https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/manifest/video.m3u8" type="application/x-mpegURL" />
      <source src="https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/downloads/default.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;