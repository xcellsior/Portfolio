// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MessageBoard {
    struct Message {
        string content;
        address sender;
        uint256 timestamp;
    }
    uint public totalMessages;
    Message[5] public messageBoard;
    address payable private owner;
    uint public latestMsg;

    event msgBoard (string message, uint totalMessages, address messenger, uint timestamp);

    constructor() {
        owner = payable(msg.sender);
        Message memory message  = Message({
            content: "WELCOME TO THE MESSAGE BOARD",
            sender: owner,
            timestamp: block.timestamp
        });
        messageBoard[0] = message;
        totalMessages++;
        emit msgBoard(message.content, totalMessages, owner, block.timestamp);
    }

    // Post a message to the message board and increment counter
    function postMessage(string calldata content) public {
        Message memory newMessage = Message({
                content: content,
                sender: msg.sender,
                timestamp: block.timestamp
            });
        latestMsg = totalMessages % 5;
        messageBoard[latestMsg] = newMessage;
        totalMessages++;
        emit msgBoard(newMessage.content, totalMessages, msg.sender, block.timestamp);
    }
    
    modifier onlyOwner () {
        require (msg.sender == owner, "Only the owner can call this");
        _;
    }
    
    function changeOwner (address payable newOwner) public onlyOwner {
        require(newOwner != address(0), "No renouncing this contract!");
        owner = newOwner;
    }

    // Reclaim any ETH sent to contract
    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }

    // Function to transfer any accidentally sent ERC20 tokens
    function retrieveERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(owner, amount), "Token transfer failed");
    }

    // Function to transfer any accidentally sent NFTs
    function retrieveNFT(address nftContract, uint256 tokenId) external onlyOwner {
        IERC721(nftContract).safeTransferFrom(address(this), owner, tokenId);
    }
    
    // Function to read any message slot
    function retrieveMsg(uint8 slot) public view returns (Message memory){
        return messageBoard[slot];
    }
}

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
}