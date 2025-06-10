/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer } from "react";
import { useUnityContext } from "react-unity-webgl";
import { useLocation } from "react-router";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { config } from "./config";

// --- TYPE DEFINITIONS ---
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
  f: PlayerType;
  s: PlayerType;
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

interface AppState extends GameBetLimit, UserStatusType, GameStatusType {
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
  unityState: boolean;
  unityLoading: boolean;
  currentProgress: number;
  bettedUsers: BettedUserType[];
  previousHand: UserType[];
  history: number[];
  rechargeState: boolean;
  currentTarget: number;
}

// --- ACTION TYPES ---
type Action =
  | { type: 'SET_GAME_STATE'; payload: Partial<GameStatusType> }
  | { type: 'SET_USER_INFO'; payload: Partial<UserType> }
  | { type: 'SET_USER_BET_STATE'; payload: Partial<UserStatusType> }
  | { type: 'SET_UNITY_STATE'; payload: { unityState?: boolean; unityLoading?: boolean; currentProgress?: number } }
  | { type: 'SET_BETTED_USERS'; payload: BettedUserType[] }
  | { type: 'SET_PREVIOUS_HAND'; payload: UserType[] }
  | { type: 'SET_HISTORY'; payload: number[] }
  | { type: 'SET_RECHARGE_STATE'; payload: boolean }
  | { type: 'SET_CURRENT_TARGET'; payload: number }
  | { type: 'SET_BET_LIMITS'; payload: GameBetLimit }
  | { type: 'UPDATE_STATE'; payload: Partial<AppState> };

// --- INITIAL STATE ---
const initialState: AppState = {
  myBets: [],
  width: 1500,
  userInfo: {
    balance: 10000,
    userType: false,
    img: "",
    userName: "",
    f: { auto: false, betted: false, cashouted: false, cashAmount: 0, betAmount: 500, target: 2 },
    s: { auto: false, betted: false, cashouted: false, cashAmount: 0, betAmount: 500, target: 2 },
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
  unityState: false,
  unityLoading: false,
  currentProgress: 0,
  bettedUsers: [],
  previousHand: [],
  history: [],
  rechargeState: false,
  currentTarget: 0,
  maxBet: 100000,
  minBet: 500,
  fbetState: false,
  fbetted: false,
  sbetState: false,
  sbetted: false,
  currentNum: 0,
  currentSecondNum: 0,
  GameState: "",
  time: 0,
};

// --- REDUCER ---
const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return { ...state, ...action.payload };
    case 'SET_USER_INFO':
      return { ...state, userInfo: { ...state.userInfo, ...action.payload } };
    case 'SET_USER_BET_STATE':
      return { ...state, ...action.payload };
    case 'SET_UNITY_STATE':
      return { ...state, ...action.payload };
    case 'SET_BETTED_USERS':
      return { ...state, bettedUsers: action.payload };
    case 'SET_PREVIOUS_HAND':
      return { ...state, previousHand: action.payload };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'SET_RECHARGE_STATE':
      return { ...state, rechargeState: action.payload };
    case 'SET_CURRENT_TARGET':
      return { ...state, currentTarget: action.payload };
    case 'SET_BET_LIMITS':
        return { ...state, ...action.payload };
    case 'UPDATE_STATE':
        return { ...state, ...action.payload };
    default:
      return state;
  }
};

// --- CONTEXT ---
const Context = React.createContext<{ state: AppState; dispatch: React.Dispatch<Action>, myUnityContext: any, getMyBets: () => void, callCashOut: (at: number, index: "f" | "s") => void, update: (attrs: Partial<AppState>) => void, updateUserBetState: (attrs: Partial<UserStatusType>) => void, setCurrentTarget: (target: number) => void }>(null!);

const socket = io(config.wss);

export const callCashOut = (at: number, index: "f" | "s") => {
  let data = { type: index, endTarget: at };
  socket.emit("cashOut", data);
};

export const Provider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { 
    unityProvider, 
    sendMessage, 
    addEventListener, 
    removeEventListener
  } = useUnityContext({
    loaderUrl: "unity/AirCrash.loader.js",
    dataUrl: "unity/AirCrash.data.unityweb",
    frameworkUrl: "unity/AirCrash.framework.js.unityweb",
    codeUrl: "unity/AirCrash.wasm.unityweb",
  });
  const token = new URLSearchParams(useLocation().search).get("cert");

  const update = (payload: Partial<AppState>) => dispatch({ type: 'UPDATE_STATE', payload });
  const updateUserBetState = (payload: Partial<UserStatusType>) => dispatch({ type: 'SET_USER_BET_STATE', payload });
  const setCurrentTarget = (payload: number) => dispatch({ type: 'SET_CURRENT_TARGET', payload });

  useEffect(() => {
    const handleGameController = (message: any) => {
      if (message === "Ready") {
        dispatch({ type: 'SET_UNITY_STATE', payload: { currentProgress: 100, unityLoading: true, unityState: true } });
      }
    };
    const handleProgress = (progression: any) => {
      const currentProgress = progression * 100;
      if (progression === 1) {
        dispatch({ type: 'SET_UNITY_STATE', payload: { currentProgress, unityLoading: true, unityState: true } });
      } else {
        dispatch({ type: 'SET_UNITY_STATE', payload: { currentProgress, unityLoading: false, unityState: false } });
      }
    };
    addEventListener("GameController", handleGameController);
    addEventListener("progress", handleProgress);
    return () => {
      removeEventListener("GameController", handleGameController);
      removeEventListener("progress", handleProgress);
    };
  }, [addEventListener, removeEventListener]);

  useEffect(() => {
    // Gestionnaire de connexion
    const handleConnect = () => {
      console.log("Socket connected:", socket.connected);
      socket.emit("enterRoom", { token });
    };

    // Gestionnaire de démarrage du jeu
    const handleStartGame = (payload: any) => {
      console.log("Game started with payload:", payload);
      dispatch({ type: 'SET_GAME_STATE', payload: { GameState: "PLAYING" } });
      // Envoyer un message à Unity pour démarrer l'animation
      if (sendMessage) {
        sendMessage("GameManager", "StartGame");
      }
    };

    // Gestionnaire d'erreurs de connexion
    const handleConnectError = (error: any) => {
      console.error("Erreur de connexion au serveur:", error);
      toast.error("Impossible de se connecter au serveur de jeu");
    };

    // Gestionnaire de déconnexion
    const handleDisconnect = (reason: string) => {
      console.log("Déconnecté du serveur:", reason);
      if (reason === "io server disconnect") {
        // La déconnexion a été initiée par le serveur, on se reconnecte
        socket.connect();
      }
    };

    // Configuration des écouteurs d'événements
    socket.on("connect", handleConnect);
    socket.on("startGame", handleStartGame);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    
    // Autres écouteurs d'événements
    socket.on("bettedUserInfo", (payload) => dispatch({ type: 'SET_BETTED_USERS', payload }));
    socket.on("myBetState", (user) => dispatch({ type: 'SET_USER_BET_STATE', payload: { fbetState: false, fbetted: user.f.betted, sbetState: false, sbetted: user.s.betted } }));
    socket.on("myInfo", (user) => dispatch({ type: 'SET_USER_INFO', payload: { balance: user.balance, userType: user.userType, userName: user.userName } }));
    socket.on("history", (payload) => dispatch({ type: 'SET_HISTORY', payload }));
    socket.on("gameState", (payload) => {
      console.log("Game state updated:", payload);
      dispatch({ type: 'SET_GAME_STATE', payload });
    });
    socket.on("previousHand", (payload) => dispatch({ type: 'SET_PREVIOUS_HAND', payload }));
    socket.on("finishGame", (user) => {
      dispatch({ type: 'SET_USER_INFO', payload: user });
      dispatch({ type: 'SET_USER_BET_STATE', payload: { fbetted: false, sbetted: false } });
    });
    socket.on("getBetLimits", (payload) => dispatch({ type: 'SET_BET_LIMITS', payload }));
    socket.on("recharge", () => dispatch({ type: 'SET_RECHARGE_STATE', payload: true }));
    socket.on("error", (data) => {
      console.error("Erreur du serveur:", data);
      dispatch({ type: 'SET_USER_BET_STATE', payload: { [`${data.index}betted`]: false } });
      toast.error(data.message || "Une erreur est survenue");
    });
    socket.on("success", (data) => {
      console.log("Succès:", data);
      toast.success(data);
    });

    // Nettoyage des écouteurs lors du démontage du composant
    return () => {
      socket.off("connect", handleConnect);
      socket.off("startGame", handleStartGame);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("bettedUserInfo");
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
  }, [token, sendMessage, addEventListener, removeEventListener]);

  useEffect(() => {
    if (state.GameState === "BET" && (state.fbetState || state.sbetState)) {
      const processBet = (type: 'f' | 's') => {
        if (!state[`${type}betState`]) return;

        const betAmount = state.userInfo[type].betAmount;
        
        // Vérifier que le montant du pari est valide
        if (isNaN(betAmount) || betAmount <= 0) {
          toast.error("Montant de pari invalide");
          dispatch({ type: 'SET_USER_BET_STATE', payload: { [`${type}betState`]: false, [`${type}betted`]: false } });
          return;
        }

        // Vérifier le solde
        if (state.userInfo.balance < betAmount) {
          toast.error("Votre solde est insuffisant");
          dispatch({ type: 'SET_USER_BET_STATE', payload: { [`${type}betState`]: false, [`${type}betted`]: false } });
          return;
        }

        const data = {
          betAmount: betAmount,
          target: state.userInfo[type].target,
          type,
          auto: state.userInfo[type].auto,
        };

        console.log("Envoi du pari:", data);
        
        // Émettre l'événement de pari avec un callback de confirmation
        socket.emit("playBet", data, (response: { status: boolean, message?: string } = { status: false }) => {
          console.log("Réponse du serveur pour le pari:", response);
          
          if (response && response.status) {
            // Mettre à jour le solde uniquement si le serveur a confirmé le pari
            dispatch({ 
              type: 'UPDATE_STATE', 
              payload: { 
                userInfo: { 
                  ...state.userInfo, 
                  balance: state.userInfo.balance - betAmount 
                } 
              } 
            });
            
            dispatch({ 
              type: 'SET_USER_BET_STATE', 
              payload: { 
                [`${type}betState`]: false, 
                [`${type}betted`]: true 
              } 
            });
            
            toast.success("Pari placé avec succès!");
          } else {
            // En cas d'erreur, réinitialiser l'état du pari
            const errorMessage = response.message || "Erreur lors du placement du pari";
            console.error(errorMessage);
            toast.error(errorMessage);
            
            dispatch({ 
              type: 'SET_USER_BET_STATE', 
              payload: { 
                [`${type}betState`]: false, 
                [`${type}betted`]: false 
              } 
            });
          }
        });
      };

      // Traiter les paris pour chaque type (f ou s)
      if (state.fbetState) processBet('f');
      if (state.sbetState) processBet('s');
    }
  }, [state.GameState, state.fbetState, state.sbetState, state.userInfo, dispatch]);

  const getMyBets = async () => {
    try {
      const response = await fetch(`${config.api}/my-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.userInfo.userName }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          dispatch({ type: 'UPDATE_STATE', payload: { myBets: data.data } });
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.log("getMyBets", error);
    }
  };

  useEffect(() => {
    if (state.GameState === "BET") getMyBets();
  }, [state.GameState]);

  const myUnityContext = { unityProvider, sendMessage };

  return (
    <Context.Provider value={{ state, dispatch, myUnityContext, getMyBets, callCashOut, update, updateUserBetState, setCurrentTarget }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
