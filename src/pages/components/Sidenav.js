import React from 'react';

const Sidenav = ({children}) => {
    return (
        <div>
            <div className="d-flex">
                <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: '280px',height:'100vh'}}>
                    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <svg className="bi pe-none me-2" width="40" height="32"><use xlinkHref="#bootstrap"/></svg>
                    <span className="fs-4">Sidebar</span>
                    </a>
                    <hr />
                    <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        <a href="/" className="nav-link text-white">
                        Home
                        </a>
                    </li>
                    <li>
                        <a href="/customer" className="nav-link text-white">
                        Customer
                        </a>
                    </li>
                    <li>
                        <a href="/product" className="nav-link text-white">
                        Product
                        </a>
                    </li>
                    <li>
                        <a href="/sale" className="nav-link text-white">
                        Sale
                        </a>
                    </li>
                    </ul>
                    <hr />
                </div>
                <div className="w-100 p-3">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Sidenav;
