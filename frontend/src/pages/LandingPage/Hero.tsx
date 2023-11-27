import { useNavigate } from 'react-router-dom';
import blue_circle from '../../assets/landing_page/blue_circle.svg';
import gray_circle from '../../assets/landing_page/gray_circle.svg';
import hero_img from '../../assets/landing_page/hero_img.png';
import Cookies from 'js-cookie';
import { AnimateHeroStyles } from '../../components/AnimateHeroStyles';

const Hero = () => {
  const isAuthenticated = !!Cookies.get('token');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    isAuthenticated ? navigate('/dashboard') : navigate('/register');
  };

  return (
    <section className="grid lg:grid-cols-2 md:mx-20 sm:mx-10 mx-5 items-center">
      <AnimateHeroStyles />
      <div className="sm:my-20 my-10">
        <h1 className="font-bold md:text-5xl text-4xl lg:w-[410px]">
          Simplifying Your Business Payment with{' '}
          <span className="text-blue" id="animate-hero-payriz">
            PAYRIZ
          </span>
        </h1>
        <p className="sm:pt-10 pt-5 md:text-xl text-lg lg:w-[373px]">
          Effortless Invoicing, Quick Payments, and Seamless Financial
          Management.
        </p>
        <button
          onClick={handleGetStarted}
          className="text-white bg-blue rounded-lg px-10 sm:mt-10 mt-5 py-3"
        >
          {isAuthenticated ? 'Dashboard' : 'Get Started'}
        </button>
      </div>
      <div className="relative mt-20 lg:block hidden">
        <img
          src={blue_circle}
          alt=""
          className="absolute top-0 right-0 -z-10"
        />
        <img
          src={gray_circle}
          alt=""
          className="absolute bottom-0 left-0 -z-10"
        />
        <img src={hero_img} alt="People" className="mx-auto" />
      </div>
    </section>
  );
};

export default Hero;
