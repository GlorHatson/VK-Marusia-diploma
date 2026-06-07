import { useEffect, useRef, useState } from 'react';
import styles from './TrailerModal.module.scss';
import CloseIcon from '../../../assets/images/icon-close.svg?react';
import PlayIcon from '../../../assets/images/icon-play.svg?react';
import PauseIcon from '../../../assets/images/icon-pause.svg?react';
import Button from '../../../components/UI/Button/Button';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let ytApiLoaded = false;
const ytCallbacks: (() => void)[] = [];

function loadYouTubeAPI() {
  if (ytApiLoaded) return;
  if (window.YT) {
    ytApiLoaded = true;
    ytCallbacks.forEach(cb => cb());
    return;
  }
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  window.onYouTubeIframeAPIReady = () => {
    ytApiLoaded = true;
    ytCallbacks.forEach(cb => cb());
  };
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, videoId, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [showCloseDelayed, setShowCloseDelayed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setIsPlayerReady(true);
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      ytCallbacks.push(initPlayer);
      loadYouTubeAPI();
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setIsPlayerReady(false);
      setIsPlaying(true);
      setIsHovered(false);
      setIsCloseHovered(false);
      setShowCloseDelayed(false);
    };
  }, [isOpen, videoId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (playerRef.current) playerRef.current.pauseVideo();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const isLoading = !isPlayerReady;

  useEffect(() => {
    if (isLoading || !isPlaying) {
      setShowCloseDelayed(true);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    } else if (isPlaying && (isHovered || isCloseHovered)) {
      setShowCloseDelayed(true);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    } else if (isPlaying && !isHovered && !isCloseHovered) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => {
        setShowCloseDelayed(false);
      }, 800);
    }
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [isPlaying, isHovered, isCloseHovered, isLoading]);

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  if (!isOpen) return null;

  let showPlayPause = false;
  let showClose = false;
  let showTitle = false;

  if (isLoading) {
    showClose = true;
  } else if (!isPlaying) {
    showPlayPause = true;
    showClose = true;
    showTitle = true;
  } else {
    if (isHovered) {
      showPlayPause = true;
    }
    showClose = showCloseDelayed;
  }

  return (
    <div className={styles['trailer-modal__overlay']} onClick={onClose}>
      <div className={styles['trailer-modal__container']} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles['trailer-modal__video-wrapper']}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div ref={containerRef} className={styles['trailer-modal__player']} />
          {isLoading && (
            <div className={styles['trailer-modal__loader']}>
              <div className={styles['trailer-modal__spinner']}></div>
            </div>
          )}
          {showPlayPause && (
            <Button
              variant="light"
              isRound
              className={styles['trailer-modal__control-btn']}
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
              icon={isPlaying ? <PauseIcon/> : <PlayIcon />}
            />
          )}
          {showTitle && <div className={styles['trailer-modal__title']}>{title}</div>}
        </div>
        {showClose && (
          <Button
            variant="light"
            isRound
            icon={<CloseIcon />}
            className={styles['trailer-modal__close-btn']}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            aria-label="Закрыть"
          />
        )}
      </div>
    </div>
  );
};

export default TrailerModal;