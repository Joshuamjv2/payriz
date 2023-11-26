import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import ScrollToAnchor from '../../components/ScrollToAnchor';
import About from './About';
import Contact from './Contact';
import Hero from './Hero';
import KnowMore from './KnowMore';

const LandingPage = () => {
  return (
    <>
      <ScrollToAnchor />
      <Navbar />
      <Hero />
      <KnowMore />
      <About />
      <Contact />
      <Footer />
    </>
  );
};

export default LandingPage;
