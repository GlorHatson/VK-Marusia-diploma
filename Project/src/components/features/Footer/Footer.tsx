import styles from './Footer.module.scss';
import Container from '../../UI/Container/Container';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.footer__container}>
        <div className={styles['footer__social-list']}>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="VK">
            <img src="/images/icon-vk.svg" alt="VK" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="YouTube">
            <img src="/images/icon-youtube.svg" alt="YouTube" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="OK">
            <img src="/images/icon-ok.svg" alt="OK" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="Telegram">
            <img src="/images/icon-telegram.svg" alt="Telegram" />
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;