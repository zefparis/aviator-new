import React from "react";
import Header from "./components/header";
import BetsUsers from "./components/bet-users";
import Main from "./components/Main";
import Payment from "./components/Payment";
// import { useCrashContext } from "./components/Main/context";
import propeller from "./assets/images/propeller.png";

import Context from "./context";
// import "./App.scss";

function App() {
  const { state } = React.useContext(Context);
  const { unityLoading, currentProgress, rechargeState } = state;
  return (
    <div className="main-container">
      {!unityLoading && (
        <div className="myloading">
          <div className="loading-container">
            <div className="rotation">
              <img alt="propeller" src={propeller}></img>
            </div>
            <div className="waiting">
              <div
                style={{ width: `${currentProgress * 1.111 + 0.01}%` }}
              ></div>
            </div>
            <p>{Number(currentProgress * 1.111 + 0.01).toFixed(2)}%</p>
          </div>
        </div>
      )}
      {rechargeState && (
        <div className="recharge">
          <div className="recharge-body">
            <div className="recharge-body-font">
              Insufficient balance amount
            </div>
            <a href="https://induswin.com/#/pages/recharge/recharge">
              Induswin.com
            </a>
          </div>
        </div>
      )}
      <Header />
      <div className="game-container">
        <BetsUsers />
        <Main />
      </div>
      <Payment />
    </div>
  );
}

export default App;
