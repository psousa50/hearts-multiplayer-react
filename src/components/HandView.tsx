import React from "react"
import { Hand, Card } from "../hearts-game-core/Cards/model"
import { CardView, getHeight } from "./CardView"
import { PlayerId } from "../hearts-game-core/Players/model"

require("./HandView.css")

interface HandViewProp {
  playerId: PlayerId
  hand: Hand
  cardWidth: number
  orientation: "horizontal" | "vertical"
  onCardPlay: (playerId: PlayerId) => (card: Card) => void
}

export const HandView: React.FC<HandViewProp> = ({ cardWidth, hand, onCardPlay, orientation, playerId }) =>
  orientation === "horizontal" ? (
    <div className="hand-horizontal">
      {hand.map(card => (
        <div key={`${card.faceValue}-${card.suit}`} style={{ marginLeft: -cardWidth * 0.7 }}>
          <CardView card={card} width={cardWidth} onClick={onCardPlay(playerId)} />
        </div>
      ))}
    </div>
  ) : (
    <div className="hand-vertical">
      {hand.map(card => (
        <div key={`${card.faceValue}-${card.suit}`} style={{ marginTop: -getHeight(cardWidth) * 0.8 }}>
          <CardView card={card} width={cardWidth} onClick={onCardPlay(playerId)} />
        </div>
      ))}
    </div>
  )
