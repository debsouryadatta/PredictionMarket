// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PredictionMarket {

    enum Side { Kamala, Trump }
    struct Result {
        Side winner;
        Side loser;
    }
    Result public result;
    bool public electionFinished;
    mapping(Side => uint) public betsPerCandidate;
    mapping(address => mapping(Side => uint)) public betsPerGambler;
    address public oracle;
    uint public totalBets;

    constructor(address _oracle) {
        oracle = _oracle;
    }

    // 1. function for placing bet
    function bet(Side _side) public payable {
        require(electionFinished == false, "Election is finished");
        require(msg.value > 0, "You need to bet more than 0");
        betsPerCandidate[_side] += msg.value;
        betsPerGambler[msg.sender][_side] += msg.value;
        totalBets += 1;
    }

    // 2. Withdraw function
    // In solidity mapping, even if the key does not exist, it will return 0
    function withdraw() external {
        uint gamblerBet = betsPerGambler[msg.sender][result.winner];
        require(gamblerBet > 0, "You don't have any winning bet");
        require(electionFinished == true, "Election is not finished yet");
        uint gain = gamblerBet + betsPerCandidate[result.loser] * gamblerBet / betsPerCandidate[result.winner];
        betsPerGambler[msg.sender][Side.Kamala] = 0;
        betsPerGambler[msg.sender][Side.Trump] = 0;
        (bool success, ) = payable(msg.sender).call{value: gain}("");
        require(success == true, "Withdrawal failed");
    }

    // 3. report winner function
    function report(Side _winner, Side _loser) external {
        require(msg.sender == oracle, "Only oracle can report the result");
        require(_winner != _loser, "Winner and loser cannot be the same");
        result.winner = _winner;
        result.loser = _loser;
        electionFinished = true;
    }

    // 4. The below functions are created according to the requirements
    function getBetAmount(Side _side) external view returns (uint) {
        return betsPerCandidate[_side];
    }

    function getTotalVolume() public view returns (uint) {
        return betsPerCandidate[Side.Kamala] + betsPerCandidate[Side.Trump];
    }

    function getTotalBets() external view returns (uint) {
        return totalBets;
    }

    function getAvgBetAmount() external view returns (uint) {
        return getTotalVolume() / totalBets;
    }

    function getBetAmountByGambler(address _gambler) external view returns (uint, uint) {
        return (betsPerGambler[_gambler][Side.Kamala], betsPerGambler[_gambler][Side.Trump]);
    }

    
}