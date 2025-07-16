import React from "react";
import Modal from "../components/Modal";
import { useUiStore } from "../store/useUiStore";

const ModalDemo: React.FC = () => {
  const { open, close } = useUiStore();

  return (
    <div>
      <button className="btn btn-primary" onClick={() => open("remoteModal")}>Modal öffnen</button>
      <Modal
        title="Beispiel-Modal"
        onClose={close}
      >
        <p>Dies ist ein Beispielinhalt im Modal.</p>
      </Modal>
    </div>
  );
};

export default ModalDemo; 