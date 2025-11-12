import Button from "./Button";

import "./DeleteModal.scss";

const DeleteModal = ({ cancel, deleteEntry }) => {
  return (
    <div className="delete-modal-container">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h2>Delete entry</h2>
        </div>
        <p>Are you sure you want to delete this entry?</p>
        <Button outline text="Delete" onClick={deleteEntry} />
        <Button filled text="Cancel" onClick={cancel} />

      </div>
    </div>
  );
};

export default DeleteModal;
