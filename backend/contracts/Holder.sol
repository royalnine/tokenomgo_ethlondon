// Verification Key Hash: 2a08edb6e3d3f41c4086b62593f62c0c1f43c3377fb276b88e06eb3709171fc7
// SPDX-License-Identifier: Apache-2.0
// Copyright 2022 Aztec
pragma solidity >=0.8.4;

interface Verifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool);
}

contract Holder {

    address public verifierAddress;
    event Claim(address claimer);

    constructor(address _verifierAddress) payable {
        setNewVerifier(_verifierAddress);
    }

    function setNewVerifier(address _verifierAddress) public {
        verifierAddress = _verifierAddress;
    }

    function claim(bytes calldata _proof, bytes32[] calldata _publicInputs) public payable {
        Verifier verifier = Verifier(verifierAddress);
        bool verification_result = verifier.verify(_proof, _publicInputs);
        require(verification_result == true, "verification failed");

        uint contractBalance = address(this).balance;
        address payable sender = payable(msg.sender);
        sender.transfer(contractBalance);
    }

    receive() external payable {
        // This function is called when Ether is sent to the contract
        // You can add custom logic here if needed
    }

}