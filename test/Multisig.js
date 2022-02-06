const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Multisig", function () {
    let Multisig;
    let multisig;
    let approver1;
    let approver2;
    let approver3;
    let receiver;
    let notApprover;
    let addrs;
    let provider;
    let transfer;
    beforeEach(async function () {
        Multisig = await ethers.getContractFactory("Multisig");
        provider = waffle.provider;
        [approver1, approver2, approver3, receiver, notApprover, ...addrs] =
            await ethers.getSigners();

        multisig = await Multisig.deploy(
            [approver1.address, approver2.address, approver3.address],
            2,
            {
                value: ethers.utils.parseEther("1"),
            }
        );

        await multisig.createTransfer(
            ethers.utils.parseEther("1"),
            receiver.address
        );
    });

    describe("Deploy contract", () => {
        it("Contract balance should be 1 ether", async () => {
            expect(await multisig.balanceOf()).to.equal(
                ethers.utils.parseEther("1")
            );
        });

        it("isApprover approver1,2,3 should be true", async () => {
            expect(await multisig.isApprovers(approver1.address)).to.be.true;
            expect(await multisig.isApprovers(approver2.address)).to.be.true;
            expect(await multisig.isApprovers(approver3.address)).to.be.true;
        });

        it("Should have 2 quorum", async () => {
            const quorum = await multisig.quorum();
            expect(quorum).to.equal(2);
        });
    });

    describe("Create transfer", () => {
        it("Transfer id should be 0", async () => {
            transfer = await multisig.transfers(0);
            expect(transfer.id).to.equal(0);
        });

        it("Transfer amount should be 1 ether", async () => {
            expect(transfer.amount).to.equal(ethers.utils.parseEther("1"));
        });

        it("Should not create transfer if not approver", async () => {
            await expect(
                multisig
                    .connect(notApprover)
                    .createTransfer(
                        ethers.utils.parseEther("1"),
                        receiver.address
                    )
            ).to.be.revertedWith("Only Approvers can action");
        });
    });

    describe("Send transfer", () => {
        it("Should not send transfer if quorum not reached", async () => {
            const beforeBalance = await provider.getBalance(receiver.address);
            await multisig.sendTransfer(0);
            const afterBalance = await provider.getBalance(receiver.address);
            transferAfter = await multisig.transfers(0);

            expect(transferAfter.approvals).to.equal(1);
            expect(afterBalance.sub(beforeBalance).toNumber()).to.equal(0);
        });

        it("Should send transfer if quorum reached", async () => {
            const balanceBefore = await provider.getBalance(receiver.address);
            await multisig.connect(approver2).sendTransfer(0);
            await multisig.connect(approver3).sendTransfer(0);
            const balanceAfter = await provider.getBalance(receiver.address);
            expect(balanceAfter.sub(balanceBefore).toString()).to.equal(
                ethers.utils.parseEther("1")
            );
        });
    });

    describe("Get deployed transfers", () => {
        let numberOfTransfers;
        it("Should return deployed contract", async () => {
            numberOfTransfers = await multisig.nextId();
            expect(numberOfTransfers).to.equal(1);

            await multisig.createTransfer(
                ethers.utils.parseEther("2"),
                receiver.address
            );

            numberOfTransfers = await multisig.nextId();
            expect(numberOfTransfers).to.equal(2);

            for (let i = 0; i < numberOfTransfers; i++) {
                if (i === 0) {
                    transfer = await multisig.transfers(i);
                    expect(transfer.amount).to.equal(
                        ethers.utils.parseEther("1")
                    );
                } else if (i === 1) {
                    transfer = await multisig.transfers(i);
                    expect(transfer.amount).to.equal(
                        ethers.utils.parseEther("2")
                    );
                }
            }
        });
    });
});
