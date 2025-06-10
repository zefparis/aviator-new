import React from "react";

import logo from "../assets/images/logo.svg";
import refound from "../assets/images/refund.png";
import "../index.scss";
import Context from "../context";
export default function Header() {
  const { state } = React.useContext(Context)

  const [howto, setHowto] = React.useState<'howto' | 'short' | 'more' | ''>("howto");
  const [, setFireSystem] = React.useState(false);

  const Refound = async () => {
      setTimeout(() => {
        window.open("https://induswin.com/#/", "_self");
      }, 1000)
  }

  return (
    <div className="header flex-none items-center">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo"></img>
        </div>
        <div className="second-block">
          {state.userInfo.userType &&
            <div className="center" onClick={Refound}>
            REBACK&nbsp;
            <button className="refound">
              <img width={23} src={refound} alt="refound"></img>
            </button>
          </div>
          }
          <button className="howto" onClick={() => setHowto("short")}>
            <div className="help-logo"></div>
            <div className="help-msg">Comment jouer ?</div>
          </button>
          <div className="d-flex">
            <div className="balance">
              <span className="amount">{Number(state.userInfo.balance).toFixed(2)} </span>
              <span className="currency">&nbsp;CDF</span>
            </div>
          </div>
        </div>
      </div>
      {howto === "short" && <div className="modal">
        <div className="back" onClick={() => setHowto("howto")}></div>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header modal-bg text-uppercase">
              <span>Comment Jouer ?</span>
              <button onClick={() => setHowto('')} className="close modal-close">
                <span>×</span>
              </button>
            </div>
            <div className="modal-body m-body-bg">
              <div className="youtube">
                <div className="embed-responsive">
                  <iframe title="tutorial" className="embed-responsive-item" src="https://www.youtube.com/embed/PZejs3XDCSY?playsinline=1" />
                  {/* <iframe className="embed-responsive-item" src="https://www.youtube.com/watch?v=bBeZSuHI4Qc" /> */}
                </div>
              </div>
              <div className="step">
                <div className="bullet">01</div>
                <p>Faites un pari, ou même deux en même temps et attendez que le tour commence.</p>
              </div>
              <div className="step">
                <div className="bullet bullet-2">02</div>
                <p>Surveillez l'avion de la chance, votre gain est le pari multiplié par un coefficient de l'avion de la chance. Encaissez avant que l'avion ne s'envole et l'argent est à vous !</p>
              </div>
              <div className="step">
                <div className="bullet bullet-3">03</div>
                <p>Encaissez avant que l'avion ne s'envole et l'argent est à vous !</p>
              </div>
            </div>
            <div className="modal-footer m-f-bg">
              <button onClick={() => setHowto("more")}>
                règles détaillées
              </button>
            </div>
          </div>
        </div>
      </div>}

      {howto === "more" && <div className="modal">
        <div className="back" onClick={() => setHowto("howto")}></div>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header ">
              <span className="text-uppercase">Règles du jeu</span>
              <button onClick={() => setHowto("howto")} className="close">
                <span>×</span>
              </button>
            </div>
            <div className="modal-body p-1r">
              <p className="text-gray">
                Aviator est une nouvelle génération de divertissement iGaming. Vous pouvez gagner beaucoup plus, en quelques secondes ! Aviator est construit sur un système prouvablement équitable, qui est actuellement la seule véritable garantie d'honnêteté dans l'industrie du jeu.
              </p>
              <button className="under-a" onClick={() => setFireSystem(true)}> En savoir plus sur le système prouvablement équitable </button>
              <h6 className="title-2"> Comment jouer </h6>
              <div className="youtube w-99">
                <div className="embed-responsive">
                  <iframe title="tutorial" className="embed-responsive-item" src="https://www.youtube.com/embed/PZejs3XDCSY?playsinline=1" />
                </div>
              </div>
              <h6 className="pt-5"> Aviator est aussi facile à jouer que 1-2-3 : </h6>
              <div className="steps-container">
                <div className="step-item">
                  <h3>01</h3>
                  <div className="step-bg-img"></div>
                  <div className="step-text pt-2">
                    <span>parier</span>   avant le décollage
                  </div>
                </div>
                <div className="step-item">
                  <h3>02</h3>
                  <div className="step-bg-img-2"></div>
                  <div className="step-text">
                    <span>Regardez</span> votre avion porte-bonheur décoller et vos gains augmenter.
                  </div>
                </div>
                <div className="step-item">
                  <h3>03</h3>
                  <div className="step-bg-img-3"></div>
                  <div className="step-text">
                    <span>Encaissez</span>  avant que l'avion ne disparaisse et gagnez X fois plus !
                  </div>
                </div>
              </div>
              <p className="text-grey mt-20"> Mais n'oubliez pas que si vous n'avez pas eu le temps d'encaisser avant que l'avion porte-bonheur ne s'envole, votre mise sera perdue. Aviator, c'est de l'excitation à l'état pur ! Risquez et gagnez. Tout est entre vos mains ! </p>
              <div className="rules-list">
                <div className="rules-list-title"> Plus de détails</div>
                <ul className="list-group">
                  <li className="list-group-item">
                    Le multiplicateur de gain commence à 1x et augmente de plus en plus à mesure que l'avion porte-bonheur décolle.
                  </li>
                  <li className="list-group-item">
                    Vos gains sont calculés au multiplicateur auquel vous avez effectué un encaissement, multiplié par votre mise.
                  </li>
                  <li className="list-group-item">
                    Avant le début de chaque tour, notre générateur de nombres aléatoires prouvablement équitable génère le multiplicateur auquel l'avion porte-bonheur s'envolera. Vous pouvez vérifier l'honnêteté de cette génération en cliquant sur l'icône <span className="icon-fair"></span>, en face du résultat, dans l'onglet Historique
                  </li>
                </ul>
              </div>
              <h6> FONCTIONS DU JEU </h6>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Parier & encaisser </div>
                <ul className="list-group">
                  <li className="list-group-item"> Sélectionnez un montant et appuyez sur le bouton "Parier" pour faire un pari. </li>
                  <li className="list-group-item"> Vous pouvez faire deux paris simultanément, en ajoutant un deuxième panneau de pari. Pour ajouter un deuxième panneau de pari, appuyez sur l'icône plus, qui se trouve dans le coin supérieur droit du premier panneau de pari. </li>
                  <li className="list-group-item"> Appuyez sur le bouton "Encaissement" pour encaisser vos gains. Votre gain est votre mise multipliée par le multiplicateur d'encaissement. </li>
                  <li className="list-group-item"> Votre pari est perdu si vous n'encaissez pas avant que l'avion ne s'envole. </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Jeu automatique et encaissement automatique </div>
                <ul className="list-group">
                  <li className="list-group-item"> Le jeu automatique est activé à partir de l'onglet "Auto" du panneau de pari, en appuyant sur le bouton "Jeu automatique". </li>
                  <li className="list-group-item"> Dans le panneau de jeu automatique, l'option "Arrêter si l'argent diminue de" arrête le jeu automatique si le solde diminue du montant sélectionné. </li>
                  <li className="list-group-item"> Dans le panneau de jeu automatique, l'option "Arrêter si l'argent augmente de" arrête le jeu automatique si le solde augmente du montant sélectionné. </li>
                  <li className="list-group-item"> Dans le panneau de lecture automatique, l'option "Arrêter si un seul gain dépasse" arrête la lecture automatique si un seul gain dépasse le montant sélectionné. </li>
                  <li className="list-group-item"> L'encaissement automatique est disponible dans l'onglet "Auto" du panneau de pari. Après activation, votre mise sera automatiquement encaissée lorsqu'elle atteindra le multiplicateur saisi </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Paris en direct et statistiques </div>
                <ul className="list-group">
                  <li className="list-group-item"> Sur le côté gauche de l'interface de jeu (ou sous le panneau de pari sur mobile), se trouve le panneau des paris en direct. Vous pouvez y voir tous les paris qui sont en cours dans le tour actuel. </li>
                  <li className="list-group-item"> Dans le panneau "Mes paris", vous pouvez voir tous vos paris et les informations sur les encaissements. </li>
                  <li className="list-group-item"> Dans le panneau "Top", les statistiques du jeu sont situées. Vous pouvez parcourir les gains par montant, ou par multiplicateur de Cash Out, et voir les plus grands multiplicateurs de tours. </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Paris gratuits </div>
                <ul className="list-group">
                  <li className="list-group-item">{" Vous pouvez vérifier le statut des paris gratuits, dans le menu du jeu > Paris gratuits. Les paris gratuits sont attribués par l'opérateur, ou par la fonction Pluie. "}</li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Randomisation </div>
                <ul className="list-group">
                  <li className="list-group-item"> Le multiplicateur de chaque tour est généré par un algorithme "Provably Fair" et est entièrement transparent et 100% équitable. <button className="under-a" onClick={() => setFireSystem(true)}> En savoir plus sur le système prouvablement équitable </button> </li>
                  <li className="list-group-item"> {"Vous pouvez vérifier et modifier les paramètres de Provably Fair dans le menu du jeu > Paramètres de Provably Fair."} </li>
                  <li className="list-group-item"> Vous pouvez vérifier l'équité de chaque tour en appuyant sur l'icône <span className="icon-fair"></span>, en face des résultats dans les onglets "Mes paris" ou "Top". </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Retour au joueur </div>
                <ul className="list-group">
                  <li className="list-group-item"> Le retour théorique global au joueur est de 97%. Cela signifie qu'en moyenne, sur 100 tours, 3 tours se terminent avec l'avion porte-bonheur qui s'envole au tout début du tour. </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Autre </div>
                <ul className="list-group">
                  <li className="list-group-item"> Si la connexion Internet est interrompue lorsque le pari est actif, le jeu encaissera automatiquement avec le multiplicateur actuel, et le montant gagnant sera ajouté à votre solde. </li>
                  <li className="list-group-item"> En cas de dysfonctionnement du matériel/logiciel de jeu, tous les paris et paiements de jeu concernés sont annulés et tous les paris concernés sont remboursés. </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
