import React from "react"
import { Trick } from "../hearts-game-core/Cards/model"
import { CardView, getHeight } from "./CardView"

import "./TrickView.css"
import { emptyCard } from "../images/cards"

interface TrickViewProps {
  trick: Trick
  width: number
}

export const TrickView: React.FC<TrickViewProps> = ({ trick, width }) => {
  const Card = (player: number) => {
    const index = (player - trick.firstPlayerIndex + 4) % 4
    return index < trick.cards.length ? (
      <CardView card={trick.cards[index]} width={width} />
    ) : (
      <div style={{ backgroundColor: "yellow", borderWidth: 1, border: "solid"}}>
        <img width={width} height={getHeight(width)} src={emptyCard} alt=""></img>
      </div>
    )
  }

  console.log("TRICK=====>", trick)

  return (
    <div className="trick">
      <div className="top">{Card(2)}</div>
      <div className="middle">
        <div className="left">{Card(1)}</div>
        <div className="right">{Card(3)}</div>
      </div>
      <div className="bottom">{Card(0)}</div>
    </div>
  )
}