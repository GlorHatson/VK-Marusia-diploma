import styles from './Footer.module.scss';
import Container from '../../UI/Container/Container';
import IconVk from '../../../assets/images/icon-vk.svg?react';
import IconYoutube from '../../../assets/images/icon-youtube.svg?react';
import IconOk from '../../../assets/images/icon-ok.svg?react';
import IconTelegram from '../../../assets/images/icon-telegram.svg?react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.footer__container}>
        <div className={styles['footer__social-list']}>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="VK">
            <IconVk/>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="YouTube">
            <IconYoutube/>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="OK">
            <IconOk/>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles['footer__social-link']} aria-label="Telegram">
            <IconTelegram />
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;