// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BarChart3,
  Gamepad2,
  Flag,
  Send,
  TrendingUp,
  Twitter,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import abi from "@/lib/PredictionMarket.json";

export default function Component() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const router = useRouter();
  const CONTRACT_ADDRESS = "0xdBd963818848D860B76a59f7b6bbCA22EEf5F6B9";
  const CONTRACT_ABI = abi.abi;
  const {
    provider,
    setProvider,
    contract,
    setContract,
    account,
    setAccount,
    isConnected,
    setIsConnected,
  } = useStore();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      console.log("Contract connected:", contract);

      setProvider(provider);
      setContract(contract);
      setAccount(address);
      setIsConnected(true);
      router.replace("/bet");
    } catch (error) {
      console.log(error);
      alert("Failed to connect wallet");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans" ref={targetRef}>
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/diyxwdtjd/image/upload/v1730316428/projects/openart-image_HWf3aTGZ_1730315937219_raw_ektzqx.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-red-600 text-transparent bg-clip-text font-handwritten"
          >
            ElectionBets
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 font-bold"
          >
            Predict. Bet. Win. The future of US election forecasting.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-8 py-6 text-lg font-bold font-handwritten"
              size="lg"
              onClick={connectWallet}
            >
              Start Betting
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-950 px-8 py-6 text-lg font-bold font-handwritten"
              size="lg"
            >
              How It Works
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </div>

      {/* Features Section */}
      <motion.section
        style={{ opacity, scale }}
        className="py-20 bg-gradient-to-b from-black to-blue-950"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-lg border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <TrendingUp className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 font-handwritten">
                  Presidential Race
                </h3>
                <p className="text-gray-400 font-sans">
                  Predict the outcome of the US presidential election
                </p>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-lg border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                <Users className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 font-handwritten">
                  Senate Races
                </h3>
                <p className="text-gray-400 font-sans">
                  Bet on individual Senate races across the country
                </p>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-lg border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <Flag className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 font-handwritten">
                  Swing States
                </h3>
                <p className="text-gray-400 font-sans">
                  Predict outcomes in key battleground states
                </p>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-lg border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <BarChart3 className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 font-handwritten">
                  Voter Turnout
                </h3>
                <p className="text-gray-400 font-sans">
                  Bet on voter participation rates across demographics
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Connect Wallet Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-950 to-black overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-4 font-handwritten text-white">
                CONNECT YOUR WALLET
              </h2>
              <p className="text-xl mb-6 text-gray-300">
                Get started on your ElectionBets journey by connecting any of
                these wallets
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full text-white font-bold"
                >
                  {/* <Image
                    src="/placeholder.svg"
                    alt="MetaMask"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  /> */}
                  MetaMask
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-full text-white font-bold"
                >
                  {/* <Image
                    src="/placeholder.svg"
                    alt="WalletConnect"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  /> */}
                  WalletConnect
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full text-white font-bold"
                >
                  {/* <Image
                    src="/placeholder.svg"
                    alt="Coinbase"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  /> */}
                  Coinbase
                </motion.button>
              </div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="w-full aspect-[16/10] bg-gradient-to-br from-purple-600 to-red-600 rounded-xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded" />
                      <div className="text-white font-mono text-lg">BANK</div>
                    </div>
                    <div>
                      <div className="text-white font-mono text-2xl mb-2">
                        1234 5678 9123 4567
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-white font-mono">
                          <div className="text-xs opacity-75">VALID THRU</div>
                          <div>08/28</div>
                        </div>
                        <div className="text-white font-mono">
                          <div className="text-xs opacity-75">CVV</div>
                          <div>***</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -right-4 w-16 h-16 border-4 border-purple-500 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded" />
                <span className="text-2xl font-bold font-handwritten">
                  ElectionBets
                </span>
              </div>
              <p className="text-gray-300 font-sans">
                ElectionBets is your premier platform for political predictions
                and betting. Join contests, make predictions, and win rewards in
                crypto!
              </p>
              <div className="flex gap-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-white hover:text-gray-200"
                >
                  <Twitter className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-white hover:text-gray-200"
                >
                  <Gamepad2 className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-white hover:text-gray-200"
                >
                  <Send className="w-6 h-6" />
                </motion.a>
              </div>
            </div>

            {/* ElectionBets World */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-handwritten">
                ElectionBets World
              </h3>
              <ul className="space-y-2 font-sans">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-handwritten">
                Categories
              </h3>
              <ul className="space-y-2 font-sans">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    All Categories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Presidential Race
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Senate Predictions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    State Elections
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-handwritten">
                Stay in touch for the latest updates
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 font-sans"
                />
                <Button
                  size="icon"
                  className="bg-white text-blue-600 hover:bg-gray-200"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
