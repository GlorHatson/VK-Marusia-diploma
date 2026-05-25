import styles from './Footer.module.scss';
import Container from '../../UI/Container/Container';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.footerContainer}>
        <div className={styles.socialLinks}>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="VK">
            <img src="/images/icon-vk.svg" alt="VK" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
            <img src="/images/icon-youtube.svg" alt="YouTube" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="OK">
            <img src="/images/icon-ok.svg" alt="OK" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Telegram">
            <img src="/images/icon-telegram.svg" alt="Telegram" />
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;