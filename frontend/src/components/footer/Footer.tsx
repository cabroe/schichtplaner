import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-transparent d-print-none fixed-bottom">
      <div className="container-fluid">
        <div className="row text-center align-items-center flex-row">
          <div className="col-12 col-lg-auto mt-3 mt-lg-0">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item">
                Copyright © <a href="https://www.kasit.de/" target="_blank" rel="noopener noreferrer" className="link-secondary">Carsten Bröckert</a>
              </li>
              <li className="list-inline-item">
                <Link className="link-secondary" to="/about">
                  Über Schichtplaner
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 