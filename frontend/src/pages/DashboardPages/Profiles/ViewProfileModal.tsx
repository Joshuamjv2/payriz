import Modal, { Styles } from 'react-modal';
import default_big from '../../../assets/default_big.svg';
import { UserContextData } from '../../../context/type';
import { UserContext } from '../../../context/UserContext';
import { useContext } from 'react';
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
    padding: '10px 10px',
  },
  overlay: {
    position: 'fixed',
    background: 'rgba(24, 49, 64, 0.63)',
    backdropFilter: 'blur("91px")',
    zIndex: 1,
  },
};

const ViewProfileModal = ({
  modalIsOpen,
  closeModal,
  activeViewId,
}: {
  modalIsOpen: any;
  closeModal: any;
  activeViewId: string;
}) => {
  const user: UserContextData = useContext(UserContext);
  const navigate = useNavigate();

  const customerInfo = user?.customers!.find((obj) => obj.id === activeViewId);

  const handleAttach = () => {
    navigate('/dashboard/attach-invoice', { state: { customerInfo } });
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="View Modal"
      appElement={document.getElementById('root') || undefined}
    >
      <button
        onClick={() => closeModal()}
        className="flex w-full justify-end font-semibold"
      >
        x
      </button>
      <img src={default_big} alt="profile picture" />
      <h2 className="pt-4 font-bold text-lg">{customerInfo?.name}</h2>
      <p className="pt-2 text-gray">{customerInfo?.email}</p>
      <address className="pt-3 text-gray not-italic">
        {customerInfo?.address}
      </address>
      <p className="pt-3 text-gray">{customerInfo?.phone}</p>

      <button
        onClick={handleAttach}
        type="submit"
        className="mt-5 mx-auto bg-blue disabled:bg-gray px-10 justify-center flex text-[#ffffff] font-bold py-[10px] rounded-md"
      >
        Attach Invoice
      </button>
    </Modal>
  );
};

export default ViewProfileModal;
