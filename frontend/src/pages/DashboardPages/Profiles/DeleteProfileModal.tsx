import Modal, { Styles } from 'react-modal';
// import person2 from '../../../assets/person2.svg';
import { UserContextData } from '../../../context/type';
import { UserContext } from '../../../context/UserContext';
import { useContext } from 'react';
import delete_alarm from '../../../assets/delete-alarm.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const customStyles: Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    padding: '24px',
  },
  overlay: {
    position: 'fixed',
    background: 'rgba(24, 49, 64, 0.63)',
    backdropFilter: 'blur("91px")',
    zIndex: 1,
  },
};

const DeleteProfileModal = ({
  modalIsOpen,
  closeModal,
  activeViewId,
}: {
  modalIsOpen: any;
  closeModal: any;
  activeViewId: string;
}) => {
  const user: UserContextData = useContext(UserContext);

  const customerInfo = user?.customers!.find((obj) => obj.id === activeViewId);
  const navigate = useNavigate();

  const deleteProfile = async () => {
    try {
      await axios.delete(`/customers/${activeViewId}`, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });
      closeModal();
      navigate('/dashboard');
      toast.success('Profile deleted successfully');
    } catch (error: any) {
      console.log(error);
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="View Modal"
      appElement={document.getElementById('root') || undefined}
    >
      <img src={delete_alarm} alt="" />
      <h2 className="pt-4 font-bold sm:text-lg text-base">Delete Profile</h2>
      <p className="pt-2 text-gray sm:text-base text-sm max-w-[352px]">
        Are you sure you want to delete profile for {customerInfo?.name}? This
        action cannot be undone
      </p>

      <div className="mt-8 sm:flex gap-3">
        <button
          onClick={() => closeModal()}
          className="rounded-lg py-[10px] text-gray border-[1px] border-[#D0D5DD] px-14"
        >
          Cancel
        </button>
        <button
          onClick={() => deleteProfile()}
          className="bg-[#D92D20] sm:mt-auto mt-3 rounded-lg py-[10px] text-white px-14"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteProfileModal;
