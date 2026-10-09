export default function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container">
          <div className="modal-header"><span>{title}</span><button className="modal-close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-section">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>  
      </div>
    </div>
  );
}