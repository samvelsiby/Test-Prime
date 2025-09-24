import { useNavbarScroll } from '../hooks/useNavbarScroll';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

const Navigation = () => {
  useNavbarScroll();
  const { handleSmoothScroll } = useSmoothScroll();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Brand</h2>
      </div>
      <ul className="nav-links">
        <li><a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')}>Home</a></li>
        <li><a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')}>About</a></li>
        <li><a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')}>Services</a></li>
        <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')}>Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;