import Button from "./Button";
import "./ConfirmationModal.scss";

const ConfirmationModal = ({ text, confirm, cancel }) => {
  return (
    <div className="confirmation-modal-container">
      <div className="confirmation-modal">
        {text}
        <Button filled text="Yes" onClick={confirm} />
        <Button outline text="Cancel" onClick={cancel} />
      </div>
    </div>
  );
};

export default ConfirmationModal;
