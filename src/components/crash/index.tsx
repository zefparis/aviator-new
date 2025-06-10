/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
// import { useCrashContext } from "../Main/context";
import "./crash.scss";
import { Unity } from "react-unity-webgl";
import propeller from "../../assets/images/propeller.png"
import Context from "../../context";


export default function WebGLStarter() {
	const { GameState, currentNum, time, unityState, myUnityContext,setCurrentTarget } = React.useContext(Context)
	const [target, setTarget] = React.useState(1);
	const [waiting, setWaiting] = React.useState(0);
	const [flag, setFlag] = React.useState(1);

	const calculateMultiplier = (startTime) => {
		const currentTime = (Date.now() - startTime) / 1000;
		return 1 + 0.06 * currentTime + Math.pow((0.06 * currentTime), 2) - Math.pow((0.04 * currentTime), 3) + Math.pow((0.04 * currentTime), 4);
	}

	React.useEffect(() => {
		let myInterval;
		console.log("GameState changed to:", GameState);

		if (GameState === "PLAYING") {
			setFlag(2);
			const startTime = Date.now() - time;
			myInterval = setInterval(() => {
				const newTarget = calculateMultiplier(startTime);
				setTarget(newTarget);
				setCurrentTarget(newTarget);
			}, 20);
		} else if (GameState === "GAMEEND") {
			setFlag(5);
			setCurrentTarget(currentNum);
			setTarget(currentNum);
		} else if (GameState === "BET") {
			setFlag(1);
			const startWaiting = Date.now() - time;
			setTarget(1);
			setCurrentTarget(1);
			myInterval = setInterval(() => {
				setWaiting(Date.now() - startWaiting);
			}, 20);
		}

		return () => {
			if (myInterval) {
				clearInterval(myInterval);
			}
		};
	}, [GameState, time, currentNum, setCurrentTarget])

	React.useEffect(() => {
		console.log("Sending flag to Unity:", flag);
		myUnityContext?.sendMessage("GameManager", "RequestToken", JSON.stringify({
			gameState: flag
		}));
	}, [flag, myUnityContext]);

	return (
		<div className="crash-container">
			<div className="canvas">
				<Unity unityProvider={myUnityContext?.unityProvider} matchWebGLToCanvasSize={true} />
			</div>
			<div className="crash-text-container">
				{GameState === "BET" ? (
					<div className={`crashtext wait font-9`} >
						<div className="rotate">
							<img width={100} height={100} src={propeller} alt="propellar"></img>
						</div>
						<div className="waiting-font">EN ATTENTE DU PROCHAIN TOUR</div>
						<div className="waiting">
							<div style={{ width: `${(5000 - waiting) * 100 / 5000}%` }}></div>
						</div>
					</div>
				) : (
					<div className={`crashtext ${GameState === "GAMEEND" && "red"}`}>
						{GameState === "GAMEEND" && <div className="flew-away">L'AVION S'EST ENVOLÉ !</div>}
						<div>
							{target - 0.01 >= 1 ? Number(target - 0.01).toFixed(2) : "1.00"} <span className="font-[900]">x</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

