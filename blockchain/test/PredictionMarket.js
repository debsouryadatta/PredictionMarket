const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
  let predictionMarket;
  let owner;
  let oracle;
  let addr1;
  let addr2;
  
  // Deploy a new contract before each test
  beforeEach(async function () {
    [owner, oracle, addr1, addr2] = await ethers.getSigners();
    
    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy(oracle.address);
    await predictionMarket.waitForDeployment();
  });

  describe("Constructor", function () {
    it("Should set the oracle address correctly", async function () {
      expect(await predictionMarket.oracle()).to.equal(oracle.address);
    });
  });

  describe("Betting", function () {
    it("Should allow placing bets", async function () {
      const betAmount = ethers.parseEther("1.0");
      await predictionMarket.connect(addr1).bet(0, { value: betAmount }); // Betting on Kamala

      expect(await predictionMarket.betsPerCandidate(0)).to.equal(betAmount);
      expect(await predictionMarket.betsPerGambler(addr1.address, 0)).to.equal(betAmount);
    });

    it("Should reject bets with 0 value", async function () {
      await expect(
        predictionMarket.connect(addr1).bet(0, { value: 0 })
      ).to.be.revertedWith("You need to bet more than 0");
    });

    it("Should reject bets after election is finished", async function () {
      // First report the result
      await predictionMarket.connect(oracle).report(0, 1); // Kamala wins, Trump loses

      // Try to place a bet
      await expect(
        predictionMarket.connect(addr1).bet(0, { value: ethers.parseEther("1.0") })
      ).to.be.revertedWith("Election is finished");
    });
  });

  describe("Reporting Results", function () {
    it("Should allow only oracle to report results", async function () {
      await expect(
        predictionMarket.connect(addr1).report(0, 1)
      ).to.be.revertedWith("Only oracle can report the result");
    });

    it("Should not allow same winner and loser", async function () {
      await expect(
        predictionMarket.connect(oracle).report(0, 0)
      ).to.be.revertedWith("Winner and loser cannot be the same");
    });

    it("Should set results correctly", async function () {
      await predictionMarket.connect(oracle).report(0, 1);
      const result = await predictionMarket.result();
      expect(result.winner).to.equal(0);
      expect(result.loser).to.equal(1);
      expect(await predictionMarket.electionFinished()).to.be.true;
    });
  });

  describe("Withdrawing", function () {
    beforeEach(async function () {
      // Setup some bets
      await predictionMarket.connect(addr1).bet(0, { value: ethers.parseEther("1.0") }); // Kamala
      await predictionMarket.connect(addr2).bet(1, { value: ethers.parseEther("2.0") }); // Trump
    });

    it("Should not allow withdrawal before election is finished", async function () {
      await expect(
        predictionMarket.connect(addr1).withdraw()
      ).to.be.revertedWith("Election is not finished yet");
    });

    it("Should not allow withdrawal for losing bets", async function () {
      await predictionMarket.connect(oracle).report(0, 1); // Kamala wins
      await expect(
        predictionMarket.connect(addr2).withdraw()
      ).to.be.revertedWith("You don't have any winning bet");
    });

    it("Should calculate and transfer winnings correctly", async function () {
      await predictionMarket.connect(oracle).report(0, 1); // Kamala wins
      
      const initialBalance = await ethers.provider.getBalance(addr1.address);
      const tx = await predictionMarket.connect(addr1).withdraw();
      const receipt = await tx.wait();
      
      // Calculate gas costs
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      // Expected winnings: original bet (1 ETH) + (loser's bet * your bet / total winning bets)
      // In this case: 1 ETH + (2 ETH * 1 ETH / 1 ETH) = 3 ETH
      const expectedWinnings = ethers.parseEther("3.0");
      
      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance - initialBalance + gasUsed).to.equal(expectedWinnings);
    });
  });
});