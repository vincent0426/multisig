import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = ({ account, children }) => {
    const router = useRouter();
    const onConnectClick = async () => {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        router.reload(window.location.pathname);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        Multisig
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${
                                        router.pathname === "/" ? "active" : ""
                                    }`}
                                    aria-current="page"
                                    href="/">
                                    Transfers
                                </a>
                            </li>
                            <li className="nav-item">
                                <Link href="/transfer/create">
                                    <a
                                        className={`nav-link ${
                                            router.pathname ===
                                            "/transfer/create"
                                                ? "active"
                                                : ""
                                        }`}
                                        href="/transfer/create">
                                        Create
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="text-light">
                        {account !== "" ? (
                            account
                        ) : (
                            <button
                                className="btn btn-secondary"
                                onClick={onConnectClick}>
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
};

export default Navbar;
