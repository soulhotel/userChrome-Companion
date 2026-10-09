import Modal from ".";

export default function ConnectionModal({ onRetry, onDismiss }) {
  return (
    <Modal title="Not Connected" onClose={onDismiss} footer={<button onClick={onRetry}>Retry</button>}>
      <p>userChrome Companion failed to connect to the preference bridge - preferences can't be toggled on/off until this is resolved.</p>
      <p>
        You can exit (x) this popup and continue for now (presets, settings, sidebar still work),
        but preferences can't be turned on/off until this is resolved.
        Make sure userChrome JS is properly installed, then retry the connection when ready.
      </p>
    </Modal>
  );
}