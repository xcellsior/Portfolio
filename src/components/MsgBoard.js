import {
    useAccount,
    useConnect, useContractRead,
    useDisconnect,
} from 'wagmi';
import {addressShorten} from '../utils/addressShorten';
import { useContractReads } from 'wagmi';
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import contractABI from '../abis/msgboardABI.json';
import React, {useState} from "react";
import '../App.css'; // path may vary based on your file structure
import { ThemeContext, themes } from '../ThemeContext';
import Filter from 'bad-words';
const filter = new Filter();

function MsgBoard() {
    const theme = React.useContext(ThemeContext);
    let { address, connector, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect()
    const { disconnect } = useDisconnect()
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const handleChange = (e) => setMessage(e.target.value);

    const msgBoardContract = {
        address: '0xD28405A087426098431163A7d5CCdb4F2110E1F2',
        abi: contractABI
    }

    const { config } = usePrepareContractWrite({
        address: '0xD28405A087426098431163A7d5CCdb4F2110E1F2',
        abi: contractABI,
        functionName: 'postMessage',
        args: [message],
        chainId: 11155111,
        onSuccess(data) {
            console.log('Success', data)
        },
    })
    const { datum, isLoading2, isSuccess, write } = useContractWrite(config)


    function formatTimestamp(timestamp) {
        let date = new Date(timestamp * 1000); // if your timestamp is in seconds
        return date.toLocaleString(); // modify according to your format needs
    }

    const { data, isError, Loading } = useContractReads({
        contracts: [{
            ...msgBoardContract,
            functionName: 'latestMsg',
            },
            {
             ...msgBoardContract,
             functionName: 'totalMessages'
            },
        ]
    });

    //TODO figure out why multi-read does not work with args

    const retrieveMsg = {
        address: '0xD28405A087426098431163A7d5CCdb4F2110E1F2',
        abi: contractABI,
        functionName: 'retrieveMsg',
    }

    const data2 =  useContractRead({
        ...retrieveMsg,
        args: [0],
        onSettled(data, error) {
            let msg = {
                user: addressShorten(data.sender),
                content: data.content,
                timestamp: Number(data.timestamp)
            }
            setMessages(prevMessages => [...prevMessages, msg]);
        },
    });
    const data3 =  useContractRead({
        ...retrieveMsg,
        args: [1],
        onSettled(data, error) {
            let msg = {
                user: addressShorten(data.sender),
                content: data.content,
                timestamp: Number(data.timestamp)
            }
            setMessages(prevMessages => [...prevMessages, msg]);
        },
    });
    const data4 =  useContractRead({
        ...retrieveMsg,
        args: [2],
        onSettled(data, error) {
            let msg = {
                user: addressShorten(data.sender),
                content: data.content,
                timestamp: Number(data.timestamp)
            }
            setMessages(prevMessages => [...prevMessages, msg]);
        },
    });
    const data5 =  useContractRead({
        ...retrieveMsg,
        args: [3],
        onSettled(data, error) {
            let msg = {
                user: addressShorten(data.sender),
                content: data.content,
                timestamp: Number(data.timestamp)
            }
            setMessages(prevMessages => [...prevMessages, msg]);
        },
    });
    const data6 =  useContractRead({
        ...retrieveMsg,
        args: [4],
        onSettled(data, error) {
            let msg = {
                user: addressShorten(data.sender),
                content: data.content,
                timestamp: Number(data.timestamp)
            }
            setMessages(prevMessages => [...prevMessages, msg]);
        },
    });

    console.log(messages)
    let totalMsgs;
    //let latestMsg = Number(data[0].result);
    try{
        totalMsgs = Number(data[1].result);
    }catch (e) {

    }


    if (isConnected) {
        address = addressShorten(address);
        const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

        return (
            <div className="centered-content">

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>Your Address: {address}</div>
                    <button onClick={disconnect}>Disconnect</button>
                </div>
                <div>Connected to {connector ? connector.name : 'Loading...'}</div>
                <div>Note, this will be an Arbitrum application in the future. Stay tuned!</div>
                <div>Total messages: {totalMsgs ? totalMsgs : 'Loading...'} </div>
                <div style={{ height: '20px' }}></div> {/* This is just white space */}
                <div>
                    {sortedMessages.map((message, index) => {
                        if (message) {
                            return (
                                <div key={index} className={`message-box ${theme === themes.dark ? 'dark-theme' : 'light-theme'}`}>
                                    <div className="message-header">
                                        <span className="message-user">{message.user}:</span>
                                        <span className="message-timestamp">
                                            {message.timestamp !== null && message.timestamp !== undefined && message.timestamp !== 0 && <span className="timestamp">{formatTimestamp(message.timestamp)}</span>}
                                        </span>
                                    </div>
                                    <div className="message-content">
                                        {filter.clean(message.content)}
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>

                <div className="message-input-container">
                    <input
                        id="messageInput"
                        type="text"
                        placeholder="Enter your message..."
                        className="message-input"
                        onChange={handleChange}
                    />
                    <div>
                        <button disabled={!write} onClick={() => write?.()}>
                            Write a Message!
                        </button>
                        {isLoading && <div>Check Wallet</div>}
                        {isSuccess && <div>Transaction: {JSON.stringify(Number(data))}</div>}
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div className="connect-buttons">
            <h2> Welcome to the
                <span className='rainbow-text'> Message Board!</span>
            </h2>

            <h2>Connect Your Wallet:</h2>
            {connectors.map((connector) => (
                <button
                    className="connector-button"
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
                </button>

            ))}

            {error && <div>{error.message}</div>}
        </div>
    )
}

export default MsgBoard;