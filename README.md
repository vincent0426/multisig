# Basic Multisig Project
## Setup
To run this project, download the zip code and open the directory in terminal

```
$ npm install
// By running npx hardhat node we spin up an instance of Hardhat Network
// that you can connect to using MetaMask.
$ npx hardhat node  
```

We should see a list of addresses and private keys:

<img width="721" alt="Screen Shot 2022-02-07 at 2 54 19 PM" src="https://user-images.githubusercontent.com/68840528/152739302-69fc0516-f479-413c-9bbf-b0458c0f5c6a.png">

Import the first four account to Metamask, the first three accounts are set as approvers and the fourth is set as receiver.

Get more information about how to import accounts at https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13

In a different terminal in the same directory, run:

```
$ npx hardhat --network localhost run scripts/deploy.js
```

This will deploy the contract to Hardhat Network.
After this completes run:

```
$ cd client
$ npm install
$ npm run dev
```

To start the react web app. Open http://localhost:3000/ (opens new window)in your browser and you should see this:

<img width="1326" alt="Screen Shot 2022-02-07 at 2 35 27 PM" src="https://user-images.githubusercontent.com/68840528/152737498-64b344dc-cbda-465a-b12c-84f14f07eb46.png">

Set your network in MetaMask to localhost:8545.

You might also need to configure MetaMask to work well with Hardhat.

To do that

* Open Metamask
* Go to Settings -> Networks -> Add networks
* Configure the network as

<img width="406" alt="Screen Shot 2022-02-07 at 2 46 58 PM" src="https://user-images.githubusercontent.com/68840528/152738414-c9da0171-d1b9-4b83-9342-0434a38b6d90.png">


Now click the connect wallet button on top right in the web app. You can connect the four accounts to web now.

We can first copy the receiver's(fourth's) address and switch back to any of the approvers'(first three) accounts since only approvers are allowed to create the transfer.

### Go to the create page:

<img width="721" alt="Screen Shot 2022-02-07 at 3 00 02 PM" src="https://user-images.githubusercontent.com/68840528/152740493-7bcc56f4-b1a9-4e6b-9210-6ca5980e0237.png">

We've set the balance as 100 ETH in https://github.com/Vincent0426/multisig/blob/main/scripts/deploy.js, which means we will transfer 100ETH to the contract when we deploy and that's why our first account has only 9899.xxxx ETH in balance which includes the 100 ETH we sent to the contract and the gas fee.

* Set the amount of ETH that you want to send to the receiver
* Paste the receiver's address which we've just copied
* Click the Create button and go back to the Transfers page.

<img width="721" alt="Screen Shot 2022-02-07 at 3 09 54 PM" src="https://user-images.githubusercontent.com/68840528/152741398-5dbf27f9-8a18-4e1d-b4fb-100ae9cc0cde.png">

Then you will see:

<img width="1024" alt="Screen Shot 2022-02-07 at 3 11 25 PM" src="https://user-images.githubusercontent.com/68840528/152741473-ddb81215-612f-4110-9235-58479d8839b9.png">

Now we can use the approvers' accounts to approve the transfer!
As soon as the approvers reach the quorum we've set in /scripts/deploy.js which is 2 now, we'll send the amount to the receiver account.

## References
* https://hardhat.org/tutorial/hackathon-boilerplate-project.html
* https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
