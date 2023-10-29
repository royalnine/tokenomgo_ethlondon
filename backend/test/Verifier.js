const { expect } = require('chai');
const hre = require('hardhat');

const { Noir } = require( '@noir-lang/noir_js');
const { BarretenbergBackend } = require( '@noir-lang/backend_barretenberg');

const { compile } = require( '@noir-lang/noir_wasm');
const path = require( 'path');
const { ProofData } = require( '@noir-lang/types');

const getCircuit = async (name) => {
  const compiled = await compile(path.resolve('src', `${name}.nr`));
  return compiled;
};

describe('It compiles noir program code, receiving circuit bytes and abi object.', () => {
  let noir;
  let correctProof;

  before(async () => {
    const circuit = await getCircuit('main');
    const verifierContract = await hre.ethers.deployContract('UltraVerifier');
    console.log(`Deploying`);
    await verifierContract.waitForDeployment();
    console.log(`Verifier deployed to ${verifierContract.target}`);

    const backend = new BarretenbergBackend(circuit);
    noir = new Noir(circuit, backend);
    console.log("Done initialising")
  });

  it('Should generate valid proof for correct input', async () => {
    const input = {latitude: 185424, longitude: 453 };
    console.log(`about to generate proof`);
    // Generate proof
    correctProof = await noir.generateFinalProof(input);
    expect(correctProof.proof instanceof Uint8Array).to.be.true;
  });

  it('Should verify valid proof for correct input', async () => {
    const verification = await noir.verifyFinalProof(correctProof);
    expect(verification).to.be.true;
  });

  it('Should fail to generate valid proof for incorrect input', async () => {
    try {
      const input = {latitude: 185424, longitude: 234 };
      const incorrectProof = await noir.generateFinalProof(input);
    } catch (err) {
      // TODO(Ze): Not sure how detailed we want this test to be
      expect(err instanceof Error).to.be.true;
      const error = err;
      expect(error.message).to.contain('Cannot satisfy constraint');
    }
  });
});