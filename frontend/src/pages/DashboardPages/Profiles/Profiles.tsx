import { useContext, useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { UserContext } from '../../../context/UserContext';
import { UserContextData } from '../../../context/type';
// import { useNavigate } from 'react-router-dom';
import { convertTimestampToFormattedDate } from '../../../helpers';
import person from '../../../assets/person.svg';
import eyeIcon from '../../../assets/eye.svg';
import deleteIcon from '../../../assets/delete.svg';
import ViewProfileModal from './ViewProfileModal';
import DeleteProfileModal from './DeleteProfileModal';

const Profiles = () => {
  // const navigate = useNavigate();
  const user: UserContextData = useContext(UserContext);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [activeViewId, setActiveViewId] = useState('');

  function closeViewModal() {
    setViewModalIsOpen(false);
  }
  function closeDeleteModal() {
    setDeleteModalIsOpen(false);
  }

  const handleViewOpening = (id: string) => {
    setViewModalIsOpen(true);
    setActiveViewId(id);
  };

  const handleDeleteOpening = (id: string) => {
    setDeleteModalIsOpen(true);
    setActiveViewId(id);
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <section className="bg-white rounded-lg py-5 sm:px-11 px-5 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-blue font-bold">List of Profiles</h2>
          </div>

          <table className="mt-5 w-full overflow-x-auto block [&::-webkit-scrollbar]:hidden">
            <tbody className="table w-full">
              <tr className="[&>*]:text-left text-gray text-sm">
                <th>Name</th>
                <th>Contact Information</th>
                <th className="">Date Created</th>
                <th />
              </tr>

              {user?.customers?.map((customer) => (
                <tr
                  key={customer.id}
                  className="[&>*]:p-2 text-sm cursor-pointer"
                  onClick={() => handleViewOpening(customer.id)}
                >
                  <td className="flex items-center gap-x-2 whitespace-nowrap">
                    <img
                      src={person}
                      alt="person"
                      className="sm:block hidden"
                    />
                    {customer.name}
                  </td>
                  <td>{customer.email}</td>
                  <td className="">
                    {convertTimestampToFormattedDate(customer.created)}
                  </td>
                  <td className="flex sm:gap-6 gap-3 items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteOpening(customer.id)}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="w-3 max-w-[12px] block sm:mb-4"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewOpening(customer.id)}
                    >
                      <img
                        src={eyeIcon}
                        alt="View"
                        className="w-3 max-w-[12px] block sm:mb-4"
                      />
                    </button>
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
        <ViewProfileModal
          modalIsOpen={viewModalIsOpen}
          closeModal={closeViewModal}
          activeViewId={activeViewId}
        />
        <DeleteProfileModal
          modalIsOpen={deleteModalIsOpen}
          closeModal={closeDeleteModal}
          activeViewId={activeViewId}
        />
      </div>
    </>
  );
};

export default Profiles;
