// import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import TopBar from '../components/TopBar';
import create_white from '../assets/create-white.svg';
import attach_white from '../assets/attach-white.svg';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <TopBar />
        <p className="text-gray text-sm font-light pt-2">
          Take a look at your financial overview
        </p>

        <section className="grid grid-cols-2 mt-5 gap-5">
          <section>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg py-5 px-11 shadow-sm">
                <h2 className="text-blue font-bold text-sm">
                  Create a Profile
                </h2>
                <p className="text-gray text-sm font-light pt-2">
                  Click here to create a profile
                </p>
                <button
                  type="button"
                  className="flex gap-1 items-center bg-blue rounded-md px-5 py-2 text-white mt-5"
                  onClick={() => navigate('/dashboard/create-profile')}
                >
                  <img src={create_white} alt="create" />
                  Create Profile
                </button>
              </div>
              <div className="bg-white rounded-lg py-5 px-11 shadow-sm">
                <h2 className="text-blue font-bold text-sm">Attach Invoice</h2>
                <p className="text-gray text-sm font-light pt-2">
                  Click here to attach an invoice
                </p>
                <button
                  type="button"
                  className="flex gap-1 items-center bg-blue rounded-md px-5 py-2 text-white mt-5"
                  // onClick={}
                >
                  <img src={attach_white} alt="create" />
                  Attach Invoice
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg py-5 px-11 mt-5 shadow-sm">
              <h2 className="text-blue font-bold text-sm">Invoices</h2>
            </div>
          </section>

          <section className="bg-white rounded-lg py-5 px-11 shadow-sm">
            <h2 className="text-blue font-bold text-sm">List of Profiles</h2>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
