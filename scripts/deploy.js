async function main() {
    const [approver1, approver2, approver3, receiver, notApprover, ...addrs] =
        await ethers.getSigners();

    console.log("Deploying contracts with the account:", approver1.address);

    console.log("Account balance:", (await approver1.getBalance()).toString());

    const Multisig = await ethers.getContractFactory("Multisig");
    const multisig = await Multisig.deploy(
        [approver1.address, approver2.address, approver3.address],
        2,
        {
            value: ethers.utils.parseEther("100"),
        }
    );
    console.log("Multisig address:", multisig.address);

    saveFrontendFiles(multisig);
}

function saveFrontendFiles(multisig) {
    const fs = require("fs");
    const multisigAddress =
        __dirname + "/../client/artifacts/contracts/Multisig.sol";

    if (!fs.existsSync(multisigAddress)) {
        fs.mkdirSync(multisigAddress);
    }

    fs.writeFileSync(
        multisigAddress + "/multisig-address.json",
        JSON.stringify({ Address: multisig.address }, undefined, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
