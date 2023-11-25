import { useContext } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { UserContext } from '../../context/UserContext';
import { UserContextData } from '../../context/type';
// import { useNavigate } from 'react-router-dom';
import { convertTimestampToFormattedDate } from '../../helpers';
import person from '../../assets/person.svg';

const Profiles = () => {
  // const navigate = useNavigate();
  const user: UserContextData = useContext(UserContext);
  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <section className="bg-white rounded-lg py-5 px-11 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-blue font-bold">List of Profiles</h2>
          </div>

          <table className="mt-5 w-full overflow-x-auto">
            <tbody>
              <tr className="[&>*]:text-left text-gray text-sm">
                <th>Name</th>
                <th>Contact Information</th>
                <th className="flex justify-end">Date Created</th>
              </tr>

              {user?.customers?.map((customer) => (
                <tr key={customer.id} className="[&>*]:py-2 text-sm">
                  <td className="flex items-center gap-x-2">
                    <img
                      src={person}
                      alt="person"
                      className="sm:block hidden"
                    />
                    {customer.name}
                  </td>
                  <td>{customer.email}</td>
                  <td className="flex justify-end">
                    {convertTimestampToFormattedDate(customer.created)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {user?.isProfileLoading && user?.customers?.length === 0 && (
            <p className="text-center sm:my-40 my-10 text-gray text-sm">
              Loading...
            </p>
          )}

          {user?.customers?.length == 0 && !user?.isProfileLoading && (
            <p className="text-center sm:my-40 my-10 text-gray text-sm">
              No profiles created yet
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default Profiles;
