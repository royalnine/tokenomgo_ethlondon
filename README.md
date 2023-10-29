# tokenomgo_ethlondon

## TokenomGo built with Noir, Solidity, Ionic and React

TokenomGo is a game taking inspiration from PokemonGo. The main idea is to allow players claim tokens based on their geolocation.

## Problem

The main issue with having a GPS based on-chain game is hiding the coordinates of the tokens to be claimed. That's where Aztec's Noir comes into play, letting us hide the location of the tokens using ZKP.

## Backend

- We created a circuit to hide the location of the tokens, generating a smart contract through the use of `nargo codegen-verifier` , ran local tests and deployed the `Verifier` contract.
- Following which we created a `Holder` contract which actually holds the tokens and verifies proofs generated by `NoirJS` on the frontend with the `Verifier` contract.

The following figure illustrates the application's architecture:
![IMAGE 2023-10-29 11:37:49](https://github.com/royalnine/tokenomgo_ethlondon/assets/17271567/c40f5f14-4192-42ab-aa2c-445e3854ad81)

1. Create a smart contract from the circuit.
1. Frontend:
    1. Constantly polls the geolocation of the player (represented in seconds, 1' ~ 30 meters) 
    1. Generates the proofs for the private inputs.
    1. Allows the player to try and claim the tokens off the contract.
  
1. The holder contract tries to verify the proof calling `verify` method on the verifier contract.

## Frontend 

The idea was to use a mobile app to interact with the game, however it proved more complex than initially anticipated. Had there been more time to hack the project, we’d have definitely gotten the mobile application working but for now it works as a web app. We used `ionic` and `capacitor` which works for both web apps and mobile apps.

The frontend constantly polls the players’ geolocation allowing them to try and claim the tokens from the `Holder` contract. If the coordinates submitted are correct, all locked ETH is sent over to the player. 

The GPS coordinates are converted from the standard form of degrees, minutes and seconds into seconds. The advantage of doing so is that one second approximately equates to 30 meters. So the tokens are placed in a rough square of 30x30 meters.
