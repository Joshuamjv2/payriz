import knowMore1 from '../../assets/landing_page/knowmore1.svg';
import knowMore2 from '../../assets/landing_page/knowmore2.svg';
import knowMore3 from '../../assets/landing_page/knowmore3.svg';

const KnowMore = () => {
  const knowMoreItems = [
    {
      img: knowMore1,
      title: 'Create a Profile',
      alt: 'Man on a phone',
    },
    {
      img: knowMore2,
      title: 'Send Invoice',
      alt: 'Woman sending',
    },
    {
      img: knowMore3,
      title: 'Get Paid',
      alt: 'Woman on laptop smiling',
    },
  ];

  return (
    <div className="mt-16 p-7 border-t-gray border-b-gray border-r-0 border-l-0 border-[1px] border-opacity-25">
      <h1 className="text-center font-bold text-xl">Want To Know More</h1>
      <div className="grid sm:grid-cols-3 mt-5">
        {knowMoreItems.map((item) => (
          <div key={item.title}>
            <img src={item.img} alt={item.alt} className="mx-auto" />
            <p className="text-center">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowMore;
