export function RemoteModal() {
  return (
    <div className="modal" id="remote_modal" tabIndex={-1} role="dialog" aria-labelledby="remote_modal_label">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="remote_modal_label"></h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Schließen"></button>                
          </div>
          <div className="modal-body">
          </div>
          <div className="modal-footer">
          </div>
        </div>
      </div>
    </div>
  )
}