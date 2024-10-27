const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Define oracle address - replace this with your actual oracle address for production
  const oracleAddress = "0xF2de1E3000fbD29cD227aFc3B86721987B4AF701"; // TODO: Replace with actual oracle address

  // Deploy the contract
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(oracleAddress);
  await predictionMarket.waitForDeployment();

  console.log("PredictionMarket deployed to:", await predictionMarket.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });