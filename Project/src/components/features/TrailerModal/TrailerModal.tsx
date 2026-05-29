import { useEffect, useRef, useState } from 'react';
import styles from './TrailerModal.module.scss';

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;   // YouTube video ID
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
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [playerSize, setPlayerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!isOpen) return;
        // При открытии модалки, подготавливаем размеры
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.parentElement?.getBoundingClientRect();
                const maxWidth = Math.min(rect?.width || 960, 960);
                const height = maxWidth * 9 / 16;
                setPlayerSize({ width: maxWidth, height });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const initPlayer = () => {
            if (!containerRef.current) return;
            if (playerRef.current) {
                playerRef.current.destroy();
            }
            playerRef.current = new window.YT.Player(containerRef.current, {
                height: playerSize.height,
                width: playerSize.width,
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
                    // устаревшие параметры, но можно оставить
                    showinfo: 0,
                    autohide: 1,
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
            const callback = () => initPlayer();
            ytCallbacks.push(callback);
            loadYouTubeAPI();
        }
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [isOpen, videoId, playerSize]);

    // При изменении размеров плеера обновляем его размеры
    useEffect(() => {
        if (playerRef.current && playerSize.width) {
            playerRef.current.setSize(playerSize.width, playerSize.height);
        }
    }, [playerSize]);

    const handlePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    // const handleVideoClick = () => {
    //     handlePlayPause();
    // };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    if (!isOpen) return null;

    return (
        <div className={styles['trailer-modal__overlay']} onClick={onClose}>
            <div
                className={styles['trailer-modal__container']}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={styles['trailer-modal__video-wrapper']}>
                    <div ref={containerRef} className={styles['trailer-modal__player']} />
                    {!isPlayerReady && (
                        <div className={styles['trailer-modal__loader']}>
                            <div className={styles['trailer-modal__spinner']}></div>
                        </div>
                    )}
                    {isPlayerReady && (isHovered || !isPlaying) && (
                        <button
                            className={styles['trailer-modal__control-btn']}
                            onClick={handlePlayPause}
                            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести▶'}
                        >
                            {isPlaying
                                ? <svg width="20" height="30" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0H2V18H0V0ZM10 0H12V18H10V0Z" fill="currentColor" />
                                </svg>
                                : <svg width="25" height="30" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 17.3931V1.0016C0 0.21617 0.86395 -0.26268 1.53 0.1536L14.6432 8.34939C15.2699 8.74099 15.2699 9.65369 14.6432 10.0454L1.53 18.2411C0.86395 18.6574 0 18.1786 0 17.3931Z" fill="currentColor" />
                                </svg>
                            }
                        </button>
                    )}
                    {!isPlaying && (
                        <div className={styles['trailer-modal__title']}>{title}</div>
                    )}
                </div>
                <button className={styles['trailer-modal__close-btn']} onClick={onClose}>
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.79293 9.20715L0 1.41421L1.41421 0L9.20713 7.79285L17 0L18.4142 1.41421L10.6213 9.20715L18.4142 17L17 18.4142L9.20713 10.6213L1.41421 18.4142L0 17L7.79293 9.20715Z" fill="currentColor" />
                    </svg>

                </button>
            </div>
        </div>
    );
};

export default TrailerModal;