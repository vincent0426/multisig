import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";
import multisig from "../ethereum/multisig";

const App = ({ transfers, quorum }) => {
    const [account, setAccount] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                provider.once("block", () => {
                    multisig.on("ApproveTransfer", (...args) => {
                        router.replace(router.asPath);

                        setLoading(false);
                    });
                });
            }
        };

        getData();
    }, []);

    const onApproveClick = async (id) => {
        setLoading(true);
        await multisig.sendTransfer(id);
    };

    const renderedTable = () => {
        const rows = transfers.map((transfer) => {
            const finish = transfer.approvals === quorum ? true : false;
            return (
                <tr
                    className="align-middle"
                    key={transfer.id}
                    style={finish ? { opacity: "0.4" } : {}}>
                    <th scope="row">{transfer.id}</th>
                    <td>{transfer.amount}</td>
                    <td>{transfer.to}</td>
                    <td>
                        {transfer.approvals}/{quorum}
                    </td>
                    <td>
                        <button
                            onClick={() => {
                                onApproveClick(transfer.id);
                            }}
                            type="button"
                            className={`btn btn-secondary ${
                                finish ? "disabled" : ""
                            }`}
                            style={{ width: "90px" }}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                                <span>Approve</span>
                            )}
                        </button>
                    </td>
                </tr>
            );
        });
        return <tbody>{rows}</tbody>;
    };

    return (
        <div>
            <Navbar account={account} />
            <div className="container">
                <div className="row" style={{ marginTop: "30px" }}>
                    <div className="col"></div>
                    <div className="col-9">
                        <div className="card">
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Transfer ID</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">To</th>
                                            <th scope="col">Approvers</th>
                                        </tr>
                                    </thead>
                                    {renderedTable()}
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        </div>
    );
};

export async function getStaticProps() {
    const quorum = await multisig.quorum();

    const numberOfTransfers = await multisig.nextId();

    const transfers = [];
    let transfer;
    for (let i = 0; i < numberOfTransfers.toNumber(); i++) {
        transfer = await multisig.transfers(i);
        transfers.push({
            id: transfer.id.toString(),
            amount: ethers.utils
                .formatEther(transfer.amount.toString())
                .toString(),
            to: transfer.to,
            approvals: transfer.approvals.toString(),
            sent: transfer.sent,
        });
    }

    return {
        props: {
            transfers,
            quorum: quorum.toString(),
        },
    };
}

export default App;
