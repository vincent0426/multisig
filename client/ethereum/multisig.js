import { ethers } from "ethers";

import Multisig from "../artifacts/contracts/Multisig.sol/Multisig.json";
import multisigAddress from "../artifacts/contracts/Multisig.sol/multisig-address.json";

let multisigContract;

if (typeof window !== "undefined") {
    // browser code
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    multisigContract = new ethers.Contract(
        multisigAddress.Address,
        Multisig.abi,
        signer
    );
} else {
    const provider = new ethers.providers.JsonRpcProvider();
    multisigContract = new ethers.Contract(
        multisigAddress.Address,
        Multisig.abi,
        provider
    );
}

export default multisigContract;
