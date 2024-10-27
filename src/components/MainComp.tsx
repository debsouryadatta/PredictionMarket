// @ts-nocheck
'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wallet, TrendingUp, User, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ethers } from "ethers"
import abi from "@/lib/PredictionMarket.json"

export default function MainComp() {
  const [kamalaStake, setKamalaStake] = useState("")
  const [trumpStake, setTrumpStake] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isElectionOver, setIsElectionOver] = useState(false)
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [provider, setProvider] = useState(null)
  const [marketStats, setMarketStats] = useState({
    totalVolume: "0",
    totalBets: "0",
    avgBet: "0",
    kamalaBets: "0",
    trumpBets: "0"
  })
  const [userBets, setUserBets] = useState({
    kamalaBet: "0",
    trumpBet: "0",
    totalWinnings: "0"
  })
  const [timeRemaining, setTimeRemaining] = useState("")
  const { theme, setTheme } = useTheme()

  const CONTRACT_ADDRESS = "0xdBd963818848D860B76a59f7b6bbCA22EEf5F6B9"
  const CONTRACT_ABI = abi.abi
  const ORACLE_ADDRESS = "0xF2de1E3000fbD29cD227aFc3B86721987B4AF701"
  const ELECTION_DATE = new Date('2024-11-05T00:00:00Z')

  useEffect(() => {
    setMounted(true)
    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isConnected && contract) {
      fetchMarketStats()
      fetchUserBets()
      checkElectionStatus()
    }
  }, [isConnected, contract, account])

  const updateTimeRemaining = () => {
    const now = new Date()
    const diff = ELECTION_DATE - now
    
    if (diff <= 0) {
      setTimeRemaining("Election Day!")
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    setTimeRemaining(`${days}d ${hours}h`)
  }

  const handleConnect = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!")
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      console.log("Contract connected:", contract);
      

      setProvider(provider)
      setContract(contract)
      setAccount(address)
      setIsConnected(true)
    } catch (error) {
      console.error("Connection error:", error)
      alert("Failed to connect wallet")
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAccount("")
    setContract(null)
    setProvider(null)
    setUserBets({
      kamalaBet: "0",
      trumpBet: "0",
      totalWinnings: "0"
    })
  }

  const fetchMarketStats = async () => {
    try {
      const [kamalaBets, trumpBets, totalBets, totalVolume, avgBet] = await Promise.all([
        contract.getBetAmount(0),
        contract.getBetAmount(1),
        contract.getTotalBets(),
        contract.getTotalVolume(),
        contract.getAvgBetAmount()
      ])

      // const totalVolume = kamalaBets.add(trumpBets)
      // const avgBet = totalBets.gt(0) ? totalVolume.div(totalBets) : ethers.BigNumber.from(0)

      setMarketStats({
        totalVolume: ethers.utils.formatEther(totalVolume),
        totalBets: totalBets.toString(),
        avgBet: ethers.utils.formatEther(avgBet),
        kamalaBets: ethers.utils.formatEther(kamalaBets),
        trumpBets: ethers.utils.formatEther(trumpBets)
      })
    } catch (error) {
      console.error("Error fetching market stats:", error)
    }
  }

  const fetchUserBets = async () => {
    try {
      const [kamalaBet, trumpBet] = await contract.getBetAmountByGambler(account)
      setUserBets({
        kamalaBet: ethers.utils.formatEther(kamalaBet),
        trumpBet: ethers.utils.formatEther(trumpBet),
        totalWinnings: "0" // This will be calculated after election is over
      })
    } catch (error) {
      console.error("Error fetching user bets:", error)
    }
  }

  const checkElectionStatus = async () => {
    try {
      const status = await contract.electionFinished()
      setIsElectionOver(status)
    } catch (error) {
      console.error("Error checking election status:", error)
    }
  }

  const placeBet = async (side, amount) => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount")
        return
      }

      const tx = await contract.bet(side, {
        value: ethers.utils.parseEther(amount)
      })
      await tx.wait()

      // Reset input and refresh stats
      side === 0 ? setKamalaStake("") : setTrumpStake("")
      await fetchMarketStats()
      await fetchUserBets()
    } catch (error) {
      console.error("Error placing bet:", error)
      alert("Failed to place bet")
    }
  }

  const handleWithdraw = async () => {
    try {
      const tx = await contract.withdraw()
      await tx.wait()
      await fetchUserBets()
      alert("Withdrawal successful!")
    } catch (error) {
      console.error("Error withdrawing:", error)
      alert("Failed to withdraw")
    }
  }

  const endElection = async () => {
    try {
      if (account.toLowerCase() !== ORACLE_ADDRESS.toLowerCase()) {
        alert("Only oracle can end the election")
        return
      }

      // For this example, we're making Kamala the winner
      // In a real application, this would be determined by real-world election results
      const tx = await contract.report(0, 1) // 0 for Kamala, 1 for Trump
      await tx.wait()
      setIsElectionOver(true)
    } catch (error) {
      console.error("Error ending election:", error)
      alert("Failed to end election")
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      <header className="bg-white dark:bg-black/60 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ElectionBets</h1>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {isConnected ? (
              <>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px] sm:max-w-none">
                  {account}
                </span>
                <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm" onClick={handleDisconnect}>
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </>
            ) : (
              <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm" onClick={handleConnect}>
                <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            2024 US Presidential Election
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Place your bets on who will win the 2024 US Presidential Election
          </p>
          {account.toLowerCase() === ORACLE_ADDRESS.toLowerCase() && (
            <Button onClick={endElection} className="mt-4" disabled={isElectionOver}>
              End Election
            </Button>
          )}
        </div>

        {isConnected && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Bets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kamala Harris</p>
                  <p className="text-lg font-semibold">{userBets.kamalaBet} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Donald Trump</p>
                  <p className="text-lg font-semibold">{userBets.trumpBet} ETH</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Winnings</p>
                  <p className="text-lg font-semibold">{userBets.totalWinnings} ETH</p>
                </div>
                <Button 
                  onClick={handleWithdraw} 
                  disabled={!isElectionOver || (userBets.kamalaBet === "0" && userBets.trumpBet === "0")}
                >
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Kamala Harris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1730044830/projects/kamala_harris_hihrls.jpg"
                    alt="Kamala Harris"
                    width={128}
                    height={128}
                  />
                </div>
                <div className="text-2xl font-bold">{marketStats.kamalaBets} ETH</div>
                <p className="text-gray-500 dark:text-gray-400">Total Bets</p>
                <Input
                  type="number"
                  placeholder="Enter ETH amount"
                  value={kamalaStake}
                  onChange={(e) => setKamalaStake(e.target.value)}
                  className="mt-2"
                />
                <Button 
                  className="w-full" 
                  disabled={!isConnected || isElectionOver}
                  onClick={() => placeBet(0, kamalaStake)}
                >
                  Place Bet on Kamala
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Donald Trump</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1730044828/projects/Donald_Trump_ogdida.jpg"
                    alt="Donald Trump"
                    width={128}
                    height={128}
                  />
                </div>
                <div className="text-2xl font-bold">{marketStats.trumpBets} ETH</div>
                <p className="text-gray-500 dark:text-gray-400">Total Bets</p>
                <Input
                  type="number"
                  placeholder="Enter ETH amount"
                  value={trumpStake}
                  onChange={(e) => setTrumpStake(e.target.value)}
                  className="mt-2"
                />
                <Button 
                  className="w-full" 
                  disabled={!isConnected || isElectionOver}
                  onClick={() => placeBet(1, trumpStake)}
                >
                  Place Bet on Trump
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Market Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{marketStats.totalVolume} ETH</div>
                <p className="text-gray-500 dark:text-gray-400">Total Volume</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{marketStats.totalBets}</div>
                <p className="text-gray-500 dark:text-gray-400">Total Bets</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{marketStats.avgBet} ETH</div>
                <p className="text-gray-500 dark:text-gray-400">Average Bet</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{timeRemaining}</div>
                <p className="text-gray-500 dark:text-gray-400">Time Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}