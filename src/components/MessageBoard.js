import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../abis/msgboardABI.json';
import '../App.css';
require('dotenv').config();


function MessageBoard() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [messages, setMessages] = useState([]);

    // Your contract address here
    const contractAddress = '0xD28405A087426098431163A7d5CCdb4F2110E1F2';

    useEffect(() => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
        } else {
            alert('Please install MetaMask to use this dApp!');
        }
    }, []);

    useEffect(() => {
        const loadContract = async () => {
            if (web3) {
                const contractInstance = new web3.eth.Contract(
                    contractABI,
                    contractAddress,
                );
                setContract(contractInstance);
            }
        };
        loadContract();
    }, [web3]);

    useEffect(() => {
        const loadAccounts = async () => {
            if (web3) {
                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);
            }
        };
        loadAccounts();
    }, [web3]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (contract) {
                let latestMsg = await contract.methods.latestMsg().call();
                latestMsg = Number(latestMsg);
                let totalMessages = await contract.methods.totalMessages().call();
                totalMessages = Number(totalMessages);
                let messages = [];
                if (totalMessages < 6) {
                    for (let i = totalMessages; i >= 0; i++) {
                        let message = await contract.methods.retrieveMsg(i).call();
                        messages[i] = message;
                    }
                }
                else {
                    for (let i = 0; i < 5; i++) {

                    }
                }

                setMessages(messages);
            }
        };

        fetchMessages();
    }, [contract]);

    const connectWallet = async () => {
        if (window.ethereum) {
            // Request account access
            await window.ethereum.enable();
        }
    };
    return (
        <div>
            <h1>Message Board</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            {messages.map((message, index) => (
                <div key={index} className="message-container">
                    <h2>{message.sender}</h2>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
}

export default MessageBoard;