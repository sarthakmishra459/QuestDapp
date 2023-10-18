import React, { useEffect, useState } from "react";
import contract from "./contracts/StackUp.json";
import { ethers } from "ethers";

const contractAddr = "0xEE9dC4aC03FCd06912cfF6EEDd1434C94050D0cc";
const abi = contract.abi;

function App() {
 const [adminAddr, setAdminAddr] = useState("");
 const [currentAccount, setCurrentAccount] = useState(null);
 const [allQuestsInfo, setAllQuestsInfo] = useState(null);
 const [userQuestStatuses, setUserQuestStatuses] = useState(null);
 const [questId, setQuestId] = useState("");
 const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [numberOfRewards, setNumberOfRewards] = useState("");

 const connectWalletHandler = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
   try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);
    setCurrentAccount(accounts[0]);
    console.log("found an account:", accounts[0]);
   } catch (err) {
    console.log(err);
   }
  } else {
   // MetaMask not installed
   console.log("please install metamask");
  }
 };

 const getAdminAddr = async () => {
  try {
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const stackupContract = new ethers.Contract(contractAddr, abi, provider);

   const adminAddr = await stackupContract.admin();
   console.log("adminAddr:", adminAddr);
   setAdminAddr(adminAddr);
  } catch (err) {
   console.log("getAdminAddr error...");
   console.log(err);
  }
 };

 const getQuestsInfo = async () => {
  try {
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const stackupContract = new ethers.Contract(contractAddr, abi, provider);

   const nextQuestId = await stackupContract.nextQuestId();
   let allQuestsInfo = [];
   let thisQuest;
   for (let i = 0; i < nextQuestId; i++) {
    thisQuest = await stackupContract.quests(i);
    allQuestsInfo.push(thisQuest);
   }
   setAllQuestsInfo(allQuestsInfo);
  } catch (err) {
   console.log("getQuestsInfo error...");
   console.log(err);
  }
 };

 const getUserQuestStatuses = async () => {
  try {
   if (currentAccount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const stackupContract = new ethers.Contract(contractAddr, abi, provider);

    const nextQuestId = await stackupContract.nextQuestId();
    const questStatusMapping = {
     0: "Not Joined",
     1: "Joined",
     2: "Submitted",
    };
    let userQuestStatuses = [];
    let thisQuest;

    for (let i = 0; i < nextQuestId; i++) {
     let thisQuestStatus = [];
     thisQuest = await stackupContract.quests(i);

     let thisQuestTitle = thisQuest[2];
     let thisQuestId = thisQuest[0];

     thisQuestStatus.push(thisQuestTitle);
     const questStatusId = await stackupContract.playerQuestStatuses(currentAccount, thisQuestId);
     thisQuestStatus.push(questStatusMapping[questStatusId]);

     userQuestStatuses.push(thisQuestStatus);
    }
    setUserQuestStatuses(userQuestStatuses);
   }
  } catch (err) {
   console.log("getUserQuestStatuses error...");
   console.log(err);
  }
 };

 const joinQuestHandler = async () => {
  try {
   if (!questId) {
    alert("input quest ID before proceeding");
   } else {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const stackupContract = new ethers.Contract(contractAddr, abi, signer);
    console.log("apple");
    const tx = await stackupContract.joinQuest(questId);
    await tx.wait();
   }
  } catch (err) {
   console.log(err);
   alert("error encountered! refer to console log to debug");
  }
 };
 const submitQuestHandler = async () => {
    try {
     if (!questId) {
        alert("input quest ID before proceeding");
     } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const stackupContract = new ethers.Contract(contractAddr, abi, signer);
    
        const tx = await stackupContract.submitQuest(questId);
        await tx.wait();
     }
    } catch (err) {
     console.log(err);
     alert("error encountered! refer to console log to debug");
    }
 }
 const createQuest = async () => {
    try {
      // Call the createQuest function in your smart contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const stackupContract = new ethers.Contract(contractAddr, abi, signer);
  
      const gasLimit = 300000; // Replace with an appropriate gas limit
      const tx = await stackupContract.createQuest(title, reward, numberOfRewards, {
        gasLimit,
      });
  
      const receipt = await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction receipt:", receipt);
  
      // Optionally, you can update the quest list or show a success message
    } catch (error) {
      console.error("Error creating quest:", error);
    }
  };

 useEffect(() => {
  getAdminAddr();
  getQuestsInfo();
  getUserQuestStatuses();

 });

 return (
    <div className="container">
    <nav className="navbar">
      <h1>Quests Dapp</h1>
      <h4 className="admin-address">Admin address: {adminAddr}</h4>
      {currentAccount ? (
        <h4 className="wallet-connected">Wallet connected: {currentAccount}</h4>
      ) : (
        <button className="connect-wallet-button" onClick={connectWalletHandler}>
          Connect Wallet
        </button>
      )}
    </nav>
    <h2>
    <u>Actions:</u>
    </h2>

    <div className="action-container">
    <input
     type="text"
    className="quest-input"
    placeholder="Quest Id"
    value={questId}
    onChange={(e) => setQuestId(e.target.value)}
    />
    <button className="join-quest-button" onClick={joinQuestHandler}>
    Join Quest
    </button>
    <button className="submit-quest-button" onClick={submitQuestHandler}>
    Submit Quest
    </button>
    </div>
    <h2>
      <u>All Quests:</u>
    </h2>
  
    <div className="card-container">
    {allQuestsInfo &&
      allQuestsInfo.map((quest) => {
        return (
          <div className="card" key={quest[0]}>
            <h4>{quest[2]}</h4>
            <ul>
              <li>questId: {quest[0].toString()}</li>
              <li>number of players: {quest[1].toString()}</li>
              <li>reward: {quest[3].toString()}</li>
              <li>number of rewards available: {quest[4].toString()}</li>
            </ul>
          </div>
        );
      })}
  </div>

  <h2>
    <u>Your Quest Statuses:</u>
  </h2>

  <div className="card-container">
    {userQuestStatuses &&
      userQuestStatuses.map((quest) => {
        return (
          <div className="card" key={quest[0]}>
            <li>
              {quest[0]} - {quest[1]}
            </li>
          </div>
        );
      })}
  </div>
  <h2>
        <u>Create a New Quest:</u>
      </h2>
      <div className="create-quest-form">
        <input
          type="text"
          placeholder="Quest Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quest Reward"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Rewards"
          value={numberOfRewards}
          onChange={(e) => setNumberOfRewards(e.target.value)}
        />
        <button onClick={createQuest}>Create Quest</button>
      </div>
    

</div>
  
 );
}

export default App;