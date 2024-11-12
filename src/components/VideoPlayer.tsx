'use client';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';

export const VideoPlayer = (props: any) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { options, onReady, user, course_name, video_index, video_len } = props;
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const sendProgressUpdate = async (course_name: string, video_index: number, time: number) => {
    console.log("Sending progress update");

    if (!course_name || !video_index || !time || !video_len) {
      console.warn("Course name is not available. Skipping progress update.");
      return;
    }

    if (!user || !user.attributes || !user.attributes.email) {
      console.error("User or user email is not available");
      return;
    }

    const [mins, secs] = video_len.split(":").map(Number);

    if (mins === 0 && secs === 0) {
      console.error("Abnormal video length.");
      return;
    }

    try {
      const response = await fetch('https://c27rktve90.execute-api.eu-west-1.amazonaws.com/Prod', {
        mode: 'cors',
        method: 'PUT',
        body: JSON.stringify({
          user_email: user.attributes.email,
          course_name: course_name,
          video_index: video_index,
          progress: Math.min(1.0, Math.max(0.0, time / (mins * 60 + secs)))
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update progress.");
      }
    } catch (error) {
      console.error("Error sending progress update:", error);
    }
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      console.log("Current progress", currentTime);

      if (currentTime - lastUpdateTime >= 3) {
        sendProgressUpdate(course_name, video_index + 1, currentTime);
        setLastUpdateTime(currentTime);  // Update the last update time
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const videoElement = document.createElement('video');
      videoElement.classList.add('video-js', 'vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        player.on('timeupdate', handleTimeUpdate);
        onReady && onReady(player);
      });

      console.log("Video element and player created");

      if (Hls.isSupported()) {
        console.log("Hls.js is supported");
        const hls = new Hls({
          xhrSetup: (xhr) => {
            xhr.withCredentials = true; // Enable CORS with credentials
          }
        });
        hls.loadSource(options.sources[0].src);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed, starting video playback");
          videoElement.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS.js error", event, data);
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        console.log("Browser supports HLS natively");
        videoElement.src = options.sources[0].src;
        videoElement.addEventListener('loadedmetadata', () => {
          console.log("Metadata loaded, starting video playback");
          videoElement.play();
        });
      } else {
        console.error("HLS not supported");
      }

      return () => {
        if (player && !player.isDisposed()) {
          player.off('timeupdate', handleTimeUpdate);
          player.dispose();
          playerRef.current = null;
        }
      };
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.off('timeupdate', handleTimeUpdate);
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return <div ref={videoRef} className="w-full h-full"></div>;
};

export default VideoPlayer;