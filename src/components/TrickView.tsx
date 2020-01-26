import React from "react"
import { CardView, getHeight } from "./CardView"
import { emptyCard } from "../images/cards"
import { Trick } from "../hearts-game-core/Tricks/model"

require( "./TrickView.css")

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
      <div>
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
