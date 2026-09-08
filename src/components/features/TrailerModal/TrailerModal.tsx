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
  tag.async = true;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      return;
    }

    const initPlayer = () => {
      try {
        if (!containerRef.current) {
          throw new Error('Контейнер плеера не найден');
        }
        if (!window.YT || !window.YT.Player) {
          throw new Error('YouTube API не загружена');
        }

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
              setError(null);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
            },
            onError: (event: any) => {
              const errorCode = event.data;
              let message = 'Не удалось воспроизвести трейлер.';
              if (errorCode === 2) message = 'Неверный ID видео.';
              else if (errorCode === 5) message = 'Плеер не может воспроизвести видео.';
              else if (errorCode === 100) message = 'Видео недоступно.';
              else if (errorCode === 101 || errorCode === 150) message = 'Видео не может быть воспроизведено на этом сайте.';
              setError(message);
              setIsPlayerReady(false);
              console.error('YouTube Player error:', event);
            },
          },
        });
      } catch (err: any) {
        setError(err.message || 'Ошибка инициализации плеера');
        console.error('Ошибка инициализации YouTube плеера:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Подписываемся на загрузку API, но с таймаутом
      let timeoutId: ReturnType<typeof setTimeout>;
      const callback = () => {
        clearTimeout(timeoutId);
        initPlayer();
      };
      ytCallbacks.push(callback);
      loadYouTubeAPI();

      // Если API не загрузилась через 10 секунд, показываем ошибку
      timeoutId = setTimeout(() => {
        const index = ytCallbacks.indexOf(callback);
        if (index > -1) ytCallbacks.splice(index, 1);
        setError('Не удалось загрузить YouTube плеер. Проверьте соединение.');
      }, 10000);

      return () => {
        clearTimeout(timeoutId);
        const index = ytCallbacks.indexOf(callback);
        if (index > -1) ytCallbacks.splice(index, 1);
      };
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) { /* ignore */ }
        playerRef.current = null;
      }
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setIsPlayerReady(false);
      setIsPlaying(true);
      setIsHovered(false);
      setIsCloseHovered(false);
      setShowCloseDelayed(false);
      setError(null);
    };
  }, [isOpen, videoId]);

  // Остальные эффекты (блокировка скролла, клавиша Escape) остаются без изменений
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (playerRef.current) {
        try { playerRef.current.pauseVideo(); } catch (e) { /* ignore */ }
      }
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

  // Логика показа кнопок
  useEffect(() => {
    if (error) {
      setShowCloseDelayed(true);
      return;
    }
    if (!isPlayerReady) {
      setShowCloseDelayed(true);
      return;
    }
    if (!isPlaying) {
      setShowCloseDelayed(true);
      return;
    }
    if (isPlaying && (isHovered || isCloseHovered)) {
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
  }, [isPlaying, isHovered, isCloseHovered, isPlayerReady, error]);

  const handlePlayPause = () => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (err) {
      console.warn('Ошибка управления плеером:', err);
    }
  };

  if (!isOpen) return null;

  // Если есть ошибка, показываем сообщение
  if (error) {
    return (
      <div className={styles['trailer-modal__overlay']} onClick={onClose}>
        <div className={styles['trailer-modal__container']} onClick={(e) => e.stopPropagation()}>
          <div className={styles['trailer-modal__video-wrapper']} style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontSize: '20px' }}>{error}</p>
            <Button variant="primary" onClick={onClose} style={{ marginTop: '20px' }}>
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const showPlayPause = isPlayerReady && (!isPlaying || isHovered);
  const showClose = error || !isPlayerReady || showCloseDelayed;
  const showTitle = isPlayerReady && !isPlaying;


  return (
    <div className={styles['trailer-modal__overlay']} onClick={onClose}>
      <div className={styles['trailer-modal__container']} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles['trailer-modal__video-wrapper']}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div ref={containerRef} className={styles['trailer-modal__player']} />
          {!isPlayerReady && !error && (
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
              icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            />
          )}
        </div>
        {showTitle && <div className={styles['trailer-modal__title']}>{title}</div>}
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