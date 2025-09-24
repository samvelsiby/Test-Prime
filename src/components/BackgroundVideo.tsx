import { useEffect, useRef, useState } from 'react';

const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const loopStartTime = 2.01;
  const loopEndTime = 29.24;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialize HLS for Cloudflare Stream
    const initializeCloudflareStream = async () => {
      const videoSrc = 'https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/manifest/video.m3u8';
      
      // Dynamically import HLS.js
      const Hls = (await import('hls.js')).default;
      
      if (Hls.isSupported()) {
        console.log('HLS is supported, using HLS.js');
        const hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
        });
        
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          console.log('HLS manifest parsed, starting video');
          video.play().catch(error => {
            console.log('Autoplay failed, will play on user interaction:', error);
          });
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
          console.error('HLS error:', data);
          if (data.fatal) {
            console.log('Fatal HLS error, falling back to MP4');
            video.src = 'https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/downloads/default.mp4';
            video.load();
          }
        });
        
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Native HLS support detected');
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.log('Autoplay failed, will play on user interaction:', error);
          });
        });
      } else {
        console.log('HLS not supported, using MP4 fallback');
        video.src = 'https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/downloads/default.mp4';
      }
    };

    // Video event handlers
    const handleLoadedMetadata = () => {
      console.log('Video loaded, duration:', video.duration);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      if (video.paused) {
        video.play().catch(error => {
          console.error('Error playing video:', error);
        });
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
    initializeCloudflareStream();

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