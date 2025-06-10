/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";
import { useLocation } from "react-router";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { config } from "./config";

export interface BettedUserType {
  name: string;
  betAmount: number;
  cashOut: number;
  cashouted: boolean;
  target: number;
  img: string;
}

export interface UserType {
  balance: number;
  userType: boolean;
  img: string;
  userName: string;
  f: {
    auto: boolean;
    betted: boolean;
    cashouted: boolean;
    betAmount: number;
    cashAmount: number;
    target: number;
  };
  s: {
    auto: boolean;
    betted: boolean;
    cashouted: boolean;
    betAmount: number;
    cashAmount: number;
    target: number;
  };
}

export interface PlayerType {
  auto: boolean;
  betted: boolean;
  cashouted: boolean;
  betAmount: number;
  cashAmount: number;
  target: number;
}

interface GameStatusType {
  currentNum: number;
  currentSecondNum: number;
  GameState: string;
  time: number;
}

interface GameBetLimit {
  maxBet: number;
  minBet: number;
}

declare interface GameHistory {
  _id: number;
  name: string;
  betAmount: number;
  cashoutAt: number;
  cashouted: boolean;
  date: number;
}

interface UserStatusType {
  fbetState: boolean;
  fbetted: boolean;
  sbetState: boolean;
  sbetted: boolean;
}

interface ContextDataType {
  myBets: GameHistory[];
  width: number;
  userInfo: UserType;
  fautoCashoutState: boolean;
  fautoCound: number;
  finState: boolean;
  fdeState: boolean;
  fsingle: boolean;
  fincrease: number;
  fdecrease: number;
  fsingleAmount: number;
  fdefaultBetAmount: number;
  sautoCashoutState: boolean;
  sautoCound: number;
  sincrease: number;
  sdecrease: number;
  ssingleAmount: number;
  sinState: boolean;
  sdeState: boolean;
  ssingle: boolean;
  sdefaultBetAmount: number;
  myUnityContext: any;
}

interface ContextType extends GameBetLimit, UserStatusType, GameStatusType {
  state: ContextDataType;
  unityState: boolean;
  unityLoading: boolean;
  currentProgress: number;
  bettedUsers: BettedUserType[];
  previousHand: UserType[];
  history: number[];
  rechargeState: boolean;
  myUnityContext: any;
  currentTarget: number;
  setCurrentTarget(attrs: Partial<number>);
  update(attrs: Partial<ContextDataType>);
  getMyBets();
  updateUserBetState(attrs: Partial<UserStatusType>);
}


const init_state = {
  myBets: [],
  width: 1500,
  userInfo: {
    balance: 10000,
    userType: false,
    img: "",
    userName: "",
    f: {
      auto: false,
      betted: false,
      cashouted: false,
      cashAmount: 0,
      betAmount: 500,
      target: 2,
    },
    s: {
      auto: false,
      betted: false,
      cashouted: false,
      cashAmount: 0,
      betAmount: 500,
      target: 2,
    },
  },
  fautoCashoutState: false,
  fautoCound: 0,
  finState: false,
  fdeState: false,
  fsingle: false,
  fincrease: 0,
  fdecrease: 0,
  fsingleAmount: 0,
  fdefaultBetAmount: 500,
  sautoCashoutState: false,
  sautoCound: 0,
  sincrease: 0,
  sdecrease: 0,
  ssingleAmount: 0,
  sinState: false,
  sdeState: false,
  ssingle: false,
  sdefaultBetAmount: 500,
  myUnityContext: null,
} as ContextDataType;

const Context = React.createContext<ContextType>(null!);

const socket = io(config.wss);

export const callCashOut = (at: number, index: "f" | "s") => {
  let data = { type: index, endTarget: at };
  socket.emit("cashOut", data);
};

let fIncreaseAmount = 0;
let fDecreaseAmount = 0;
let sIncreaseAmount = 0;
let sDecreaseAmount = 0;


export const Provider = ({ children }: any) => {
  const {
    unityProvider,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "unity/AirCrash.loader.js",
    dataUrl: "unity/AirCrash.data.unityweb",
    frameworkUrl: "unity/AirCrash.framework.js.unityweb",
    codeUrl: "unity/AirCrash.wasm.unityweb",
  });
  const token = new URLSearchParams(useLocation().search).get("cert");
  const [state, setState] = React.useState<ContextDataType>(init_state);

  const [unity, setUnity] = React.useState({
    unityState: false,
    unityLoading: false,
    currentProgress: 0,
  });
  const [gameState, setGameState] = React.useState({
    currentNum: 0,
    currentSecondNum: 0,
    GameState: "",
    time: 0,
  });

  const [bettedUsers, setBettedUsers] = React.useState<BettedUserType[]>([]);
  const update = (attrs: Partial<ContextDataType>) => {
    setState({ ...state, ...attrs });
  };
  const [previousHand, setPreviousHand] = React.useState<UserType[]>([]);
  const [history, setHistory] = React.useState<number[]>([]);
  const [userBetState, setUserBetState] = React.useState<UserStatusType>({
    fbetState: false,
    fbetted: false,
    sbetState: false,
    sbetted: false,
  });
  const [rechargeState, setRechargeState] = React.useState(false);
  const [currentTarget, setCurrentTarget] = React.useState(0);
  const updateUserBetState = (attrs: Partial<UserStatusType>) => {
    setUserBetState({ ...userBetState, ...attrs });
  };

  const [betLimit, setBetLimit] = React.useState<GameBetLimit>({
    maxBet: 100000,
    minBet: 500,
  });
  React.useEffect(
    function () {
      const handleGameController = (message: any) => {
        if (message === "Ready") {
          setUnity({
            currentProgress: 100,
            unityLoading: true,
            unityState: true,
          });
        }
      };
      const handleProgress = (progression: any) => {
        const currentProgress = progression * 100;
        if (progression === 1) {
          setUnity({ currentProgress, unityLoading: true, unityState: true });
        } else {
          setUnity({ currentProgress, unityLoading: false, unityState: false });
        }
      };
      addEventListener("GameController", handleGameController);
      addEventListener("progress", handleProgress);
      return () => {
        removeEventListener("GameController", handleGameController);
        removeEventListener("progress", handleProgress);
      };
    },
    [addEventListener, removeEventListener]
  );

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.connected);
      socket.emit("enterRoom", { token });
    });

    socket.on("bettedUserInfo", (bettedUsers: BettedUserType[]) => {
      setBettedUsers(bettedUsers);
    });

    socket.on("myBetState", (user: UserType) => {
      setUserBetState(prevState => ({
        ...prevState,
        fbetState: false,
        fbetted: user.f.betted,
        sbetState: false,
        sbetted: user.s.betted,
      }));
    });

    socket.on("myInfo", (user: UserType) => {
      update({
        userInfo: {
          ...state.userInfo,
          balance: user.balance,
          userType: user.userType,
          userName: user.userName,
        }
      });
    });

    socket.on("history", (history: any) => {
      setHistory(history);
    });

    socket.on("gameState", (newGameState: GameStatusType) => {
      console.log("New GameState received:", newGameState);
      setGameState(newGameState);
    });

    socket.on("previousHand", (previousHand: UserType[]) => {
      setPreviousHand(previousHand);
    });

    socket.on("finishGame", (user: UserType) => {
      setState(prevState => {
        const fauto = prevState.userInfo.f.auto;
        const sauto = prevState.userInfo.s.auto;
        const fbetAmount = prevState.userInfo.f.betAmount;
        const sbetAmount = prevState.userInfo.s.betAmount;

        const newFAuto = { ...prevState.userInfo.f, auto: fauto, betAmount: fbetAmount };
        const newSAuto = { ...prevState.userInfo.s, auto: sauto, betAmount: sbetAmount };

        if (!user.f.betted && newFAuto.auto) {
          if (user.f.cashouted) {
            fIncreaseAmount += user.f.cashAmount;
            if ((prevState.finState && prevState.fincrease - fIncreaseAmount <= 0) || (prevState.fsingle && prevState.fsingleAmount <= user.f.cashAmount)) {
              newFAuto.auto = false;
              fIncreaseAmount = 0;
            }
          } else {
            fDecreaseAmount += user.f.betAmount;
            if (prevState.fdeState && prevState.fdecrease - fDecreaseAmount <= 0) {
              newFAuto.auto = false;
              fDecreaseAmount = 0;
            }
          }
        }

        if (!user.s.betted && newSAuto.auto) {
          if (user.s.cashouted) {
            sIncreaseAmount += user.s.cashAmount;
            if ((prevState.sinState && prevState.sincrease - sIncreaseAmount <= 0) || (prevState.ssingle && prevState.ssingleAmount <= user.s.cashAmount)) {
              newSAuto.auto = false;
              sIncreaseAmount = 0;
            }
          } else {
            sDecreaseAmount += user.s.betAmount;
            if (prevState.sdeState && prevState.sdecrease - sDecreaseAmount <= 0) {
              newSAuto.auto = false;
              sDecreaseAmount = 0;
            }
          }
        }

        setUserBetState(prevBetState => ({
          ...prevBetState,
          fbetted: user.f.betted,
          sbetted: user.s.betted,
          fbetState: newFAuto.auto,
          sbetState: newSAuto.auto,
        }));

        return {
          ...prevState,
          userInfo: {
            ...user,
            f: newFAuto,
            s: newSAuto,
          }
        };
      });
    });

    socket.on("getBetLimits", (betAmounts: { max: number; min: number }) => {
      setBetLimit({ maxBet: betAmounts.max, minBet: betAmounts.min });
    });

    socket.on("recharge", () => {
      setRechargeState(true);
    });

    socket.on("error", (data) => {
      setUserBetState({
        ...userBetState,
        [`${data.index}betted`]: false,
      });
      toast.error(data.message);
    });

    socket.on("success", (data) => {
      toast.success(data);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("myBetState");
      socket.off("myInfo");
      socket.off("history");
      socket.off("gameState");
      socket.off("previousHand");
      socket.off("finishGame");
      socket.off("getBetLimits");
      socket.off("recharge");
      socket.off("error");
      socket.off("success");
    };
  }, [socket, state, userBetState]);

  React.useEffect(() => {
    if (gameState.GameState === "BET" && (userBetState.fbetState || userBetState.sbetState)) {
      const processBet = (type: 'f' | 's') => {
        if (!userBetState[`${type}betState`]) return;

        const betAmount = state.userInfo[type].betAmount;
        // if (state.userInfo.balance < betAmount) {
        //   toast.error("Your balance is not enough");
        //   updateUserBetState({ [`${type}betState`]: false, [`${type}betted`]: false });
        //   return;
        // }

        const data = {
          betAmount: betAmount,
          target: state.userInfo[type].target,
          type,
          auto: state.userInfo[type].auto,
        };

        socket.emit("playBet", data);

        update({
          userInfo: {
            ...state.userInfo,
            balance: state.userInfo.balance - betAmount,
          }
        });

        updateUserBetState({
          [`${type}betState`]: false,
          [`${type}betted`]: true,
        });
      };

      if (userBetState.fbetState) {
        processBet('f');
      }
      if (userBetState.sbetState) {
        processBet('s');
      }
    }
  }, [gameState.GameState, userBetState.fbetState, userBetState.sbetState]);

  const getMyBets = async () => {
    try {
      const response = await fetch(`${config.api}/my-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: state.userInfo.userName }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          update({ myBets: data.data as GameHistory[] });
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.log("getMyBets", error);
    }
  };

  useEffect(() => {
    if (gameState.GameState === "BET") getMyBets();
  }, [gameState.GameState]);

  return (
    <Context.Provider
      value={{
        state: state,
        ...betLimit,
        ...userBetState,
        ...unity,
        ...gameState,
        currentTarget,
        rechargeState,
        myUnityContext: {
          unityProvider,
          sendMessage,
        },
        bettedUsers: [...bettedUsers],
        previousHand: [...previousHand],
        history: [...history],
        setCurrentTarget,
        update,
        getMyBets,
        updateUserBetState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
