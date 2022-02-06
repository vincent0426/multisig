import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import Navbar from "../../components/Navbar";
import multisig from "../../ethereum/multisig";

const CreateTransfer = ({ contractBalance }) => {
    const [account, setAccount] = useState("");
    const [amount, setAmount] = useState(0);
    const [to, setTo] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const [account] = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(account);

                window.ethereum.on("accountsChanged", (accounts) => {
                    setAccount(accounts[0]);
                });

                multisig.on("CreateTransfer", (...args) => {
                    setLoading(false);
                });
            }
        };

        getData();
    }, []);

    const onFormSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            await multisig.createTransfer(
                ethers.utils.parseEther(amount.toString()),
                to
            );
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <Navbar account={account}>
            <div className="container">
                <div className="row" style={{ marginTop: "30px" }}>
                    <div className="col"></div>
                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-subtitle mb-2 text-muted float-end">
                                    Balance: {contractBalance} ETH
                                </h5>
                                <h5 className="card-title">Create Transfer</h5>
                                <div className="card-text">
                                    <form onSubmit={onFormSubmit}>
                                        <label
                                            htmlFor="amount"
                                            className="form-label">
                                            Amount
                                        </label>
                                        <div className="input-group mb-3">
                                            <input
                                                value={amount}
                                                onChange={(e) => {
                                                    setAmount(e.target.value);
                                                }}
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                id="amount"></input>
                                            <span
                                                className="input-group-text"
                                                id="basic-addon2">
                                                ETH
                                            </span>
                                        </div>
                                        <label
                                            htmlFor="to"
                                            className="form-label">
                                            To
                                        </label>
                                        <div className="mb-3">
                                            <input
                                                value={to}
                                                onChange={(e) => {
                                                    setTo(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                id="to"></input>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ width: "90px" }}>
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : (
                                                <span>Create</span>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        </Navbar>
    );
};

export async function getStaticProps() {
    const contractBalance = await multisig.balanceOf();

    return {
        props: {
            contractBalance: ethers.utils.formatEther(
                contractBalance.toString()
            ),
        },
    };
}

export default CreateTransfer;
