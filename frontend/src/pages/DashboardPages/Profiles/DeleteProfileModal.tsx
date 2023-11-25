import Modal, { Styles } from 'react-modal';
// import person2 from '../../../assets/person2.svg';
import { UserContextData } from '../../../context/type';
import { UserContext } from '../../../context/UserContext';
import { useContext } from 'react';

const customStyles: Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    padding: '6px 10px',
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
      Delete
      {customerInfo?.name}
    </Modal>
  );
};

export default DeleteProfileModal;
