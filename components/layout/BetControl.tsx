"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {

  placeBet,
  cashOut,

} from "@/lib/features/aviatorSlice";
import { useSocket } from "@/lib/socket";

interface BetSectionProps {
  gameStatus: "waiting" | "started" | "crashed"
  isBetting: boolean
  handleBet: () => void
  handleCashOut: () => void
  handleCancel: () => void
  betAmount: number
  setBetAmount: React.Dispatch<React.SetStateAction<number>>
  currentMultiplier: number
}

const BetSection: React.FC<BetSectionProps> = ({
  gameStatus,
  isBetting,
  handleBet,
  handleCashOut,
  handleCancel,
  betAmount,
  setBetAmount,
  currentMultiplier,
}) => {
  const handleIncrement = () => setBetAmount((prev) => prev + 1)
  const handleDecrement = () => setBetAmount((prev) => (prev > 1 ? prev - 1 : 1))

  const buttonClass = isBetting
    ? "bg-[#141516] text-[#ffffff80] cursor-not-allowed opacity-50"
    : "bg-[#141516] text-white"

  const renderButton = () => {
    if (gameStatus === "waiting" && isBetting) {
      return (
        <>
          <span className="mb-1 text-sm text-[#777c7e]">
            Waiting for the next round
          </span>
          <button
            className="w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-red-600 h-14"
            onClick={handleCancel}
          >
            <span className="text-lg font-normal uppercase text-shadow text-white">
              Cancel
            </span>
          </button>
        </>
      )
    } else if (gameStatus === "started" && isBetting) {
      return (
        <button
          className="w-[160px] flex items-center justify-center rounded-2xl border border-[#ffbd71] shadow-inner bg-[#d07206] h-16 text-white text-center"
          onClick={handleCashOut}
        >
          <span className="text-lg font-normal uppercase">
            Cash Out <br /> {currentMultiplier}x
          </span>
        </button>
      )
    } else {
      return (
        <button
          className={`w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-[#28a909] h-20`}
          onClick={handleBet}
        >
          <span className="text-lg font-normal uppercase text-shadow text-white">
            Bet
          </span>
        </button>
      )
    }
  }

  return (
    <div className={`flex flex-col gap-2 w-full mt-2 p-2 rounded-md`}>
      <div className="flex gap-1 items-center relative">
        <div className="flex-1 rounded-md p-1">
          <div className="flex items-center justify-between bg-[#000000b3] rounded-3xl px-1">
            <button
              className={`w-4 h-4 flex items-center justify-center border border-[#ffffff80] rounded-full focus:outline-none ${buttonClass}`}
              onClick={handleDecrement}
              disabled={isBetting}
            >
              <Minus size={16} stroke="#ffffff80" />
            </button>
            <span className="text-lg text-white font-bold">{betAmount}</span>
            <button
              className={`w-4 h-4 flex items-center justify-center border border-[#ffffff80] rounded-full focus:outline-none ${buttonClass}`}
              onClick={handleIncrement}
              disabled={isBetting}
            >
              <Plus size={16} stroke="#ffffff80" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {[1, 2, 5, 10].map((amount) => (
              <button
                key={amount}
                className={`text-sm focus:outline-none rounded-3xl ${buttonClass}`}
                onClick={() => setBetAmount(amount)}
                disabled={isBetting}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">{renderButton()}</div>
      </div>
    </div>
  )
}

interface AutoSectionProps extends BetSectionProps {
  autoCashOut: boolean
  setAutoCashOut: React.Dispatch<React.SetStateAction<boolean>>
  autoCashOutAmount: number
  setAutoCashOutAmount: React.Dispatch<React.SetStateAction<number>>
}

const AutoSection: React.FC<AutoSectionProps> = ({
  gameStatus,
  isBetting,
  handleBet,
  handleCashOut,
  handleCancel,
  betAmount,
  setBetAmount,
  autoCashOut,
  setAutoCashOut,
  autoCashOutAmount,
  setAutoCashOutAmount,
  currentMultiplier,
}) => {
  const [inputValue, setInputValue] = useState(autoCashOutAmount.toFixed(2))

  const handleClearAutoCashOut = () => {
    setAutoCashOutAmount(0)
    setInputValue("0.00")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/^0+(?=\d)/, "")
    if (value === "") value = "0"
    setInputValue(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setAutoCashOutAmount(numValue)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <BetSection
        gameStatus={gameStatus}
        isBetting={isBetting}
        handleBet={handleBet}
        handleCashOut={handleCashOut}
        handleCancel={handleCancel}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        currentMultiplier={currentMultiplier}
      />
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center justify-center rounded-3xl px-3 py-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#9ea0a3] text-sm">Auto Cash Out</span>
            <Switch
              checked={autoCashOut}
              onCheckedChange={setAutoCashOut}
              className="border-2 border-gray-600 bg-transparent data-[state=checked]:border-[#60ae05] data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-transparent"
            />
          </div>

          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-[5.7rem] text-white border-none text-right h-auto bg-[#000000b3] outline-none rounded-3xl pr-8 py-1 font-bold focus:border-none focus:outline-none"
              disabled={!autoCashOut}
              aria-label="Auto Cash Out Amount"
            />
            {autoCashOut && (
              <button
                onClick={handleClearAutoCashOut}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface BetControlSectionProps {
  defaultTab?: string
  userId: string
  sectionId: string
}

const BetControlSection: React.FC<BetControlSectionProps> = ({
  defaultTab = "bet",
  userId,
  sectionId
}) => {
  const dispatch = useAppDispatch()
  const {
    currentMultiplier,
    gameStatus,
    sessionId,
  } = useAppSelector((state) => state.aviator)
  const [betAmount, setBetAmount] = useState<number>(1.0)
  const [isBetting, setIsBetting] = useState(false)
  const [autoCashOut, setAutoCashOut] = useState(false)
  const [autoCashOutAmount, setAutoCashOutAmount] = useState(2)
  const { socket, setPendingBet } = useSocket()

  const handleBet = () => {
    if (gameStatus === "waiting" && !isBetting) {
      setIsBetting(true)
      dispatch(placeBet({ userId, amount: betAmount, socket, sectionId }))
    } else if (gameStatus === "started") {
      setPendingBet({ userId, amount: betAmount, sectionId })
      setIsBetting(true)
    }
  }

  const handleCashOut = () => {
    if (isBetting && socket ) {
      dispatch(cashOut({ userId, currentMultiplier, socket, sessionId, sectionId }))
      setIsBetting(false)
    }
  }

  const handleCancel = () => {
    if (isBetting) {
      setPendingBet(null)
      setIsBetting(false)
    }
  }

  useEffect(() => {
    if (gameStatus === "waiting" && isBetting) {
      dispatch(placeBet({ userId, amount: betAmount, socket, sectionId }))
    }
  }, [gameStatus])

  useEffect(() => {
    if (
      autoCashOut &&
      isBetting &&
      gameStatus === "started" &&
      currentMultiplier >= autoCashOutAmount &&
      socket
    ) {
      dispatch(cashOut({ userId, currentMultiplier, socket, sessionId, sectionId }))
      setIsBetting(false)
    }
  }, [
    autoCashOut,
    autoCashOutAmount,
    currentMultiplier,
    dispatch,
    userId,
    isBetting,
    gameStatus,
    socket,
    sessionId,
    sectionId
  ])

  // useEffect(() => {
  //   if (gameStatus === "crashed") {
  //     setIsBetting(false)
  //   }
  // }, [gameStatus])

  return (
    <div
      className={`flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ${isBetting ? "border-2 border-red-500" : "border-2 border-transparent"
        }`}
    >
      <Tabs
        defaultValue={defaultTab}
        className="flex flex-col items-center justify-center gap-2"
      >
        <TabsList className="bg-[#141516] w-full max-w-[200px] rounded-3xl h-auto p-0">
          <TabsTrigger
            value="bet"
            className="w-1/2 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white py-0.5 px-4 flex-1"
          >
            Bet
          </TabsTrigger>
          <TabsTrigger
            value="auto"
            className="w-1/2 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white py-0.5 px-4 flex-1"
          >
            Auto
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bet" className="w-full">
          <BetSection
            gameStatus={gameStatus}
            isBetting={isBetting}
            handleBet={handleBet}
            handleCashOut={handleCashOut}
            handleCancel={handleCancel}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            currentMultiplier={currentMultiplier}
          />
        </TabsContent>
        <TabsContent value="auto" className="w-full">
          <AutoSection
            gameStatus={gameStatus}
            isBetting={isBetting}
            handleBet={handleBet}
            handleCashOut={handleCashOut}
            handleCancel={handleCancel}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            autoCashOut={autoCashOut}
            setAutoCashOut={setAutoCashOut}
            autoCashOutAmount={autoCashOutAmount}
            setAutoCashOutAmount={setAutoCashOutAmount}
            currentMultiplier={currentMultiplier}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BetControlProps {
  userId: string;
}

const BetControl: React.FC<BetControlProps> = ({ userId }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-end gap-2 pt-2 pb-2 lg:pb-0">
      <BetControlSection defaultTab="bet" userId={userId} sectionId="section1" />
      <BetControlSection defaultTab="bet" userId={userId} sectionId="section2" />
    </div>
  );
};

export default BetControl;
