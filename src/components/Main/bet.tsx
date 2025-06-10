import React, { useEffect } from "react";
// import { useCrashContext } from "../context";
import { toast } from 'react-toastify';
import Context, { callCashOut } from "../../context";

interface BetProps {
	index: 'f' | 's'
	add: boolean
	setAdd: any
}
type FieldNameType = 'betAmount' | 'decrease' | 'increase' | 'singleAmount'
type BetOptType = '500' | '1000' | '2500' | '5000'
type GameType = 'manual' | 'auto'

const Bet = ({ index, add, setAdd }: BetProps) => {
	const context = React.useContext(Context)
	const { state,
		fbetted, sbetted,
		fbetState, sbetState,
		GameState,
		minBet, maxBet,
		currentTarget,
		update,
		updateUserBetState
	} = context;
	const [cashOut, setCashOut] = React.useState(2);

	const auto = index === 'f' ? state.userInfo.f.auto : state.userInfo.s.auto
	const betted = index === 'f' ? fbetted : sbetted
	const deState = index === 'f' ? state.fdeState : state.sdeState
	const inState = index === 'f' ? state.finState : state.sinState
	const betState = index === 'f' ? fbetState : sbetState
	const decrease = index === 'f' ? state.fdecrease : state.sdecrease
	const increase = index === 'f' ? state.fincrease : state.sincrease
	const autoCound = index === 'f' ? state.fautoCound : state.sautoCound
	const betAmount = index === 'f' ? state.userInfo.f.betAmount : state.userInfo.s.betAmount
	const autoCashoutState = index === 'f' ? state.fautoCashoutState : state.sautoCashoutState
	const single = index === 'f' ? state.fsingle : state.ssingle
	const singleAmount = index === 'f' ? state.fsingleAmount : state.ssingleAmount

	const [gameType, setGameType] = React.useState<GameType>("manual");
	const [betOpt, setBetOpt] = React.useState<BetOptType>("500");
	const [showModal, setShowModal] = React.useState(false);
	const [myBetAmount, setMyBetAmount] = React.useState(500);
	// const { index } = props;

	const minus = (type: FieldNameType) => {
		let value = state;
		if (type === "betAmount") {
			if (betAmount - 0.1 < minBet) {
				value.userInfo[index][type] = minBet
			} else {
				value.userInfo[index][type] = Number((Number(betAmount) - 1).toFixed(2))
			}
		} else {
			if (value[`${index + type}`] - 0.1 < 0.1) {
				value[`${index + type}`] = 0.1
			} else {
				value[`${index + type}`] = Number((Number(value[`${index + type}`]) - 0.1).toFixed(2))
			}
		}
		update(value);
	}

	const plus = (type: FieldNameType) => {
		let value = state;
		if (type === "betAmount") {
			if (value.userInfo[index][type] + 0.1 > state.userInfo.balance) {
				value.userInfo[index][type] = Math.round(state.userInfo.balance * 100) / 100
			} else {
				if (value.userInfo[index][type] + 0.1 > maxBet) {
					value.userInfo[index][type] = maxBet;
				} else {
					value.userInfo[index][type] = Number((Number(betAmount) + 0.1).toFixed(2))
				}
			}
		} else {
			if (value[`${index + type}`] + 0.1 > state.userInfo.balance) {
				value[`${index + type}`] = Math.round(state.userInfo.balance * 100) / 100
			} else {
				value[`${index + type}`] = Number((Number(value[`${index + type}`]) + 0.1).toFixed(2))
			}
		}
		update(value);
	}

	const manualPlus = (amount: number, btnNum: BetOptType) => {
		let value = state
		if (betOpt === btnNum) {
			if (Number((betAmount + amount)) > maxBet) {
				value.userInfo[index].betAmount = maxBet
			} else {
				value.userInfo[index].betAmount = Number((betAmount + amount).toFixed(2))
			}
		} else {
			value.userInfo[index].betAmount = Number(Number(amount).toFixed(2))
			setBetOpt(btnNum);
		}
		update(value);
	}

	const changeBetType = (e: GameType) => {
		updateUserBetState({ [`${index}betState`]: false });
		setGameType(e);
	}

	const onChangeBlur = (e: number, type: 'cashOutAt' | 'decrease' | 'increase' | 'singleAmount') => {
		let value = state;
		if (type === "cashOutAt") {
			if (e < 1.01) {
				value.userInfo[index]['target'] = 1.01;
				setCashOut(1.01);
			} else {
				value.userInfo[index]['target'] = Math.round(e * 100) / 100
				setCashOut(Math.round(e * 100) / 100);
			}
		} else {
			if (e < 0.1) {
				value[`${index + type}`] = 0.1;
			} else {
				value[`${index + type}`] = Math.round(e * 100) / 100;
			}
		}
		update(value);
	}

	const onBetClick = (s: boolean) => {
		updateUserBetState({ [`${index}betState`]: s })
	}
	const setCount = (amount: number) => {
		let attrs = state;
		attrs[`${index}autoCound`] = amount;
		update(attrs);
	}

	const reset = () => {
		update({
			[`${index}autoCound`]: 0,
			[`${index}decrease`]: 0,
			[`${index}increase`]: 0,
			[`${index}singleAmount`]: 0,
			[`${index}deState`]: false,
			[`${index}inState`]: false,
			[`${index}single`]: false,
		})
	}

	const onAutoBetClick = (_betState: boolean) => {
		let attrs = state;
		attrs.userInfo[index].auto = _betState;
		update(attrs);

		updateUserBetState({ [`${index}betState`]: _betState });

		if (!state) {
			setCount(0);
		}
	}

	const onStartBtnClick = () => {
		if (autoCound > 0) {
			if (deState || inState || single) {
				if (singleAmount > 0 || decrease > 0 || increase > 0) {
					if (inState || deState || single) {
						onAutoBetClick(true);
						setShowModal(false);
					} else {
						toast.error("Please, specify decrease or exceed stop point");
					}
				} else {
					toast.error("Can't see 0.00 as stop point");
				}
			} else {
				toast.error("Please, specify decrease or exceed stop point");
			}
		} else {
			toast.error("Please, set number of rounds");
		}
	}

	useEffect(() => {
		if (fbetted) {
			if (state.fautoCashoutState) {
				if (cashOut < currentTarget) {
					updateUserBetState({ [`${index}betted`]: false });
					callCashOut(cashOut, index);
				}
			}
		}
	}, [currentTarget, fbetted, state.fautoCashoutState, state.userInfo.f.target, cashOut, index, updateUserBetState])

	useEffect(() => {
		if (sbetted) {
			if (state.sautoCashoutState) {
				if (cashOut < currentTarget) {
					updateUserBetState({ [`${index}betted`]: false });
					callCashOut(cashOut, index);
				}
			}
		}
	}, [currentTarget, sbetted, state.sautoCashoutState, state.userInfo.s.target, cashOut, index, updateUserBetState])

	useEffect(() => {
		setMyBetAmount(betAmount);
	},[betAmount])

	return (
		<div className="bet-control">
			<div className="controls">
				{index === 'f' ? !add && (
					<button aria-label="Add second bet" className="sec-hand-btn add" onClick={() => setAdd(true)}></button>
				) : add &&
				<button aria-label="Remove second bet" className="sec-hand-btn minus" onClick={() => setAdd(false)}></button>
				}
				<div className="navigation">
					<div className="navigation-switcher">
						{(betted || betState) ?
							<>
								<button className={gameType === "manual" ? "active" : ""} >Bet</button>
								<button className={gameType === "auto" ? "active" : ""} >Auto</button>
							</> :
							<>
								<button className={gameType === "manual" ? "active" : ""} onClick={() => changeBetType("manual")}>Bet</button>
								<button className={gameType === "auto" ? "active" : ""} onClick={() => changeBetType("auto")}>Auto</button>
							</>
						}
					</div>
				</div>
				<div className="first-row">
					<div className="bet-block">
						<div className="bet-spinner">
							<div className={`spinner ${betState || betted ? "disabled" : ""}`}>
								<div className="buttons">
									<button className="minus" onClick={() => minus("betAmount")} disabled={betState || betted} aria-label="Decrease bet amount"></button>
								</div>
								<div className="input">
									{betState || betted ?
										<input type="number" value={Number(myBetAmount)} readOnly aria-label="Bet amount"></input>
										:
										<input type="number" value={Number(myBetAmount)}
											aria-label="Bet amount"
											onChange={e => {
												Number(e.target.value) > maxBet ? update({ ...state, userInfo: { ...state.userInfo, [`${index}`]: { betAmount: maxBet } } }) : Number(e.target.value) < 0 ? update({ ...state, userInfo: { ...state.userInfo, [`${index}`]: { betAmount: 0 } } }) :
													update({ ...state, userInfo: { ...state.userInfo, [`${index}`]: { betAmount: Number(e.target.value) } } });
											}}></input>
									}
								</div>
								<div className="buttons">
									<button className="plus" onClick={() => plus("betAmount")} disabled={betState || betted} aria-label="Increase bet amount"></button>
								</div>
							</div>
						</div>
						{betState || betted ?
							<div className="bet-opt-list">
								<button className="bet-opt disabled">
									<span>500</span>
								</button>
								<button className="bet-opt disabled">
									<span>1000</span>
								</button>
								<button className="bet-opt disabled">
									<span>2500</span>
								</button>
								<button className="bet-opt disabled">
									<span>5000</span>
								</button>
							</div>
							:
							<div className="bet-opt-list">
								<button onClick={() => manualPlus(500, "500")} className="bet-opt">
									<span>500</span>
								</button>
								<button onClick={() => manualPlus(1000, "1000")} className="bet-opt">
									<span>1000</span>
								</button>
								<button onClick={() => manualPlus(2500, "2500")} className="bet-opt">
									<span>2500</span>
								</button>
								<button onClick={() => manualPlus(5000, "5000")} className="bet-opt">
									<span>5000</span>
								</button>
							</div>
						}
					</div>
					<div className="buttons-block">
						{betted ? GameState === "PLAYING" ?
							<button className="btn-waiting" onClick={() => { callCashOut(currentTarget, index) }}>
								<span>
									<label>CASHOUT</label>
									<label className="amount">
										<span>{Number(betAmount * currentTarget).toFixed(2)}</span>
										<span className="currency">CDF</span>
									</label>
								</span>
							</button>
							: <button className="btn-danger">WAITING</button> : betState ?
							<>
								<div className="btn-tooltip">Waiting for next round</div>
								<button className="btn-danger h-[70%]" onClick={() => {
									onBetClick(false);
									update({ ...state, [`${index}autoCound`]: 0, userInfo: { ...state.userInfo, [index]: { ...state.userInfo[index], auto: false } } })
								}}><label>CANCEL</label></button>
							</> :
							<button onClick={() => onBetClick(true)} className="btn-success">
								<span>
									<label>BET</label>
									<label className="amount">
										<span>{Number(betAmount).toFixed(2)}</span>
										<span className="currency">CDF</span>
									</label>
								</span>
							</button>
						}
					</div>
				</div>
				{/* Auto */}
				{
					gameType === "auto" &&
					<>
						<div className="border-line"></div>
						<div className="second-row">
							<div className="auto-bet-wrapper">
								<div className="auto-bet">
									{auto ? (
										<button onClick={() => onAutoBetClick(false)} className="auto-play-btn btn-danger" >{autoCound}</button>
									) : (
										<button onClick={() => { setShowModal(true); }} className="auto-play-btn btn-primary">AUTO PLAY</button>
									)}
								</div>
							</div>
							<div className="cashout-block">
								<div className="cashout-switcher">
									<label id={`${index}-auto-cashout-label`} className="label">Auto Cash Out</label>
									{betted || betState ? (
										<button
											type="button"
											aria-labelledby={`${index}-auto-cashout-label`}
											disabled
											className={`input-switch ${autoCashoutState ? "" : "off"}`}
										>
											<span className="oval"></span>
										</button>
									) : (
										<button
											type="button"
											aria-labelledby={`${index}-auto-cashout-label`}
											onClick={() => { update({ [`${index}autoCashoutState`]: !autoCashoutState }) }}
											className={`input-switch ${autoCashoutState ? "" : "off"}`}
										>
											<span className="oval"></span>
										</button>
									)}
								</div>
								<div className="cashout-snipper-wrapper">
									<div className="cashout-snipper">
										<div className={`snipper small ${autoCashoutState && !betState ? "" : "disabled"}`}>
											<div className="input">
												{autoCashoutState && !betState ? (
													<input type="number"
														aria-label="Auto cash out at"
														onChange={(e) => { update({ ...state, userInfo: { ...state.userInfo, [`${index}`]: { ...state.userInfo[index], target: Number(e.target.value) } } }); setCashOut(Number(e.target.value)) }}
														value={cashOut}
														onBlur={(e) => onChangeBlur(Number(e.target.value) || 0, "cashOutAt")}
													/>
												) : (
													<input type="number" value={cashOut.toFixed(2)} readOnly aria-label="Auto cash out at" />
												)}
											</div>
											<span className="text">x</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				}
			</div >
			{showModal &&
				<div className="modal">
					<div onClick={() => setShowModal(false)} className="back"></div>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<span>Auto play options</span>
								<button aria-label="Close auto play options" className="close" onClick={() => setShowModal(false)}>
									<span>x</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="content-part content-part-1">
									<span>Number of Rounds:</span>
									<div className="rounds-wrap">
										<button
											className={`btn-secondary ${autoCound === 10 ? "onClick" : ""}`}
											onClick={() => setCount(10)}>
											10</button>
										<button
											className={`btn-secondary ${autoCound === 20 ? "onClick" : ""}`}
											onClick={() => setCount(20)}>
											20</button>
										<button
											className={`btn-secondary ${autoCound === 50 ? "onClick" : ""}`}
											onClick={() => setCount(50)}>
											50</button>
										<button
											className={`btn-secondary ${autoCound === 100 ? "onClick" : ""}`}
											onClick={() => setCount(100)}>
											100</button>
									</div>
								</div>
								<div className="content-part">
									<button
										onClick={() => {
											update({ [`${index}deState`]: !deState, [`${index}decrease`]: 0 });
										}}
										className={`input-switch ${deState ? "" : "off"}`}
										aria-labelledby={`${index}-decrease-label`}
									>
										<span className="oval"></span>
									</button>
									<span id={`${index}-decrease-label`} className="title">Stop if cash decreases by</span>
									<div className="spinner">
										{deState ?
											<div className="m-spinner">
												<div className="buttons">
													<button aria-label="Decrease stop amount" onClick={() => minus("decrease")} className="minus"></button>
												</div>
												<div className="input">
													<input aria-labelledby={`${index}-decrease-label`} type="number" onChange={(e) => update({ [`${index}decrease`]: Number(e.target.value) })} value={decrease}
														onBlur={(e) => onChangeBlur(Number(e.target.value) || 0, "decrease")}
													/>
												</div>
												<div className="buttons">
													<button aria-label="Increase stop amount" onClick={() => plus("decrease")} className="plus"></button>
												</div>
											</div> :
											<div className="m-spinner disabled">
												<div className="buttons">
													<button aria-label="Decrease stop amount" disabled className="minus"></button>
												</div>
												<div className="input">
													<input aria-labelledby={`${index}-decrease-label`} type="number" readOnly value={Number(decrease).toFixed(2)} />
												</div>
												<div className="buttons">
													<button aria-label="Increase stop amount" disabled className="plus"></button>
												</div>
											</div>}
									</div>
									<span >CDF</span>
								</div>
								<div className="content-part">
									<button
										onClick={() => {
											update({ [`${index}inState`]: !inState, [`${index}increase`]: 0 });
										}}
										className={`input-switch ${inState ? "" : "off"}`}
										aria-labelledby={`${index}-increase-label`}
									>
										<span className="oval"></span>
									</button>
									<span id={`${index}-increase-label`} className="title">Stop if cash increases by</span>
									<div className="spinner">
										{inState ? <div className="m-spinner">
											<div className="buttons">
												<button aria-label="Decrease stop amount" onClick={() => minus("increase")} className="minus"></button>
											</div>
											<div className="input">
												<input aria-labelledby={`${index}-increase-label`} type="number" onChange={(e) => update({ [`${index}increase`]: Number(e.target.value) })} value={increase}
													onBlur={(e) => onChangeBlur(Number(e.target.value), "increase")}
												/>
											</div>
											<div className="buttons">
												<button aria-label="Increase stop amount" onClick={() => plus("increase")} className="plus"></button>
											</div>
										</div> : <div className="m-spinner disabled">
											<div className="buttons">
												<button aria-label="Decrease stop amount" disabled className="minus"></button>
											</div>
											<div className="input">
												<input aria-labelledby={`${index}-increase-label`} type="number" readOnly value={Number(increase).toFixed(2)} />
											</div>
											<div className="buttons">
												<button aria-label="Increase stop amount" disabled className="plus"></button>
											</div>
										</div>}
									</div>
									<span >CDF</span>
								</div>
								<div className="content-part">
									<button
										onClick={() => {
											update({ [`${index}single`]: !single, [`${index}singleAmount`]: 0 });
										}}
										className={`input-switch ${single ? "" : "off"}`}
										aria-labelledby={`${index}-single-win-label`}
									>
										<span className="oval"></span>
									</button>
									<span id={`${index}-single-win-label`} className="title">Stop if single win exceeds</span>
									<div className="spinner">
										{!!single ?
											<div className="m-spinner">
												<div className="buttons">
													<button aria-label="Decrease stop amount" onClick={() => minus("singleAmount")} className="minus"></button>
												</div>
												<div className="input">
													<input aria-labelledby={`${index}-single-win-label`} type="number" onChange={(e) => update({ [`${index}singleAmount`]: Number(e.target.value) })} value={singleAmount}
														onBlur={(e) => onChangeBlur(Number(e.target.value), "singleAmount")}
													/>
												</div>
												<div className="buttons">
													<button aria-label="Increase stop amount" onClick={() => plus("singleAmount")} className="plus" ></button>
												</div>
											</div> :
											<div className="m-spinner disabled">
												<div className="buttons ">
													<button aria-label="Decrease stop amount" disabled className="minus"></button>
												</div>
												<div className="input">

													<input aria-labelledby={`${index}-single-win-label`} type="number" readOnly value={singleAmount.toFixed(2)} />
												</div>
												<div className="buttons">
													<button aria-label="Increase stop amount" disabled className="plus"></button>
												</div>
											</div>
										}
									</div>
									<span >CDF</span>
								</div>
							</div>
							<div className="modal-footer">
								<div className="btns-wrapper">
									<button className="reset-btn btn-waiting" onClick={reset}>Reset</button>
									<button className="start-btn btn-success" onClick={onStartBtnClick}>Start</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			}
		</div >
	)
}

export default Bet