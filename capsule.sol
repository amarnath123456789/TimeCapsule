// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DigitalTimeCapsule {
    
    struct TimeCapsule {
        string encryptedFileHash; // IPFS hash of the encrypted file
        string encryptedDecryptionKey; // Encrypted decryption key
        uint256 releaseTime; // Timestamp for release
        address recipient; // Recipient's address
        bool isReleased; // Status of the capsule
    }

    // Mapping from capsule ID to its details
    mapping(uint256 => TimeCapsule) public capsules;
    uint256 public nextCapsuleId;

    event CapsuleCreated(uint256 indexed capsuleId, address indexed creator, uint256 releaseTime);
    event CapsuleReleased(uint256 indexed capsuleId, address indexed recipient);

    // Create a new time capsule
    function createCapsule(string memory _encryptedFileHash, string memory _encryptedDecryptionKey, uint256 _releaseTime, address _recipient) public {
        require(_releaseTime > block.timestamp, "Release time must be in the future.");
        
        uint256 capsuleId = nextCapsuleId++;
        capsules[capsuleId] = TimeCapsule(_encryptedFileHash, _encryptedDecryptionKey, _releaseTime, _recipient, false);

        emit CapsuleCreated(capsuleId, msg.sender, _releaseTime);
    }

    // Release the capsule, allowing the recipient to access the decryption key
    function releaseCapsule(uint256 _capsuleId) public {
        TimeCapsule storage capsule = capsules[_capsuleId];

        require(block.timestamp >= capsule.releaseTime, "It is not yet time to release this capsule.");
        require(msg.sender == capsule.recipient, "Only the designated recipient can release this capsule.");
        require(!capsule.isReleased, "This capsule has already been released.");

        capsule.isReleased = true;
        emit CapsuleReleased(_capsuleId, msg.sender);
    }

    // Retrieve capsule details
    function getCapsuleDetails(uint256 _capsuleId) public view returns (string memory, string memory, uint256, address, bool) {
        TimeCapsule memory capsule = capsules[_capsuleId];
        require(msg.sender == capsule.recipient || msg.sender == tx.origin, "You are not authorized to view this capsule.");
        require(capsule.isReleased, "This capsule has not been released yet.");

        return (capsule.encryptedFileHash, capsule.encryptedDecryptionKey, capsule.releaseTime, capsule.recipient, capsule.isReleased);
    }
}
