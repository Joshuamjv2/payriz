import about from '../../assets/landing_page/about.svg';

const About = () => {
  return (
    <div
      id="about"
      className="py-10 border-t-gray border-b-gray border-r-0 border-l-0 border-[1px] border-opacity-25"
    >
      <h1 className="text-center font-bold text-xl mb-5 ">About</h1>
      <section className="grid grid-cols-2 sm:mx-20 mx-6 py-2 items-center">
        <img
          src={about}
          alt="People together"
          className="mx-auto md:block hidden"
        />
        <div className="md:col-span-1 col-span-2">
          <p className="">
            At Payriz, we believe in simplifying the way small businesses manage
            their payments. Our mission is to empower entrepreneurs by providing
            an intuitive and efficient platform for invoicing, payment tracking,
            and financial management.
          </p>
          <h2 className="font-bold text-lg pt-10">Why Payriz?</h2>
          <ul>
            <li className="list-disc">
              Effortless Invoicing: Easily create and send professional invoices
              to your clients with just a few clicks.
            </li>
            <li className="list-disc">
              Quick Payments: Streamline the payment process and get paid
              faster, improving your cash flow.
            </li>
            <li className="list-disc">
              Seamless Financial Management: Gain control over your finances
              with our user-friendly tools for tracking transactions and
              managing profiles.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
