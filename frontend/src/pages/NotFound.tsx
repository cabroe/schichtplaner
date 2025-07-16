import React from "react";
import SimpleTemplate from "../templates/SimpleTemplate";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <SimpleTemplate>
    <div className="container container-tight py-4 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="empty">
        <div className="empty-header">404</div>
        <p className="empty-title">Page not found</p>
        <p className="empty-subtitle text-body-secondary">
          We could not find the page you were looking for. Please return to your dashboard and start over.
        </p>
        <div className="empty-action">
          <Link className="btn btn-primary" to="/">
            <i className="icon fas fa-long-arrow-alt-left"></i>Take me home
          </Link>
        </div>
      </div>
    </div>
  </SimpleTemplate>
);

export default NotFound; 