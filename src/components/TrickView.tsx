import React from "react"
import { Trick } from "../hearts-game-core/Cards/model"
import { CardView } from "./CardView"

import "./TrickView.css"

interface TrickViewProps {
  trick: Trick
  firstPlayerIndex: number
  width: number
}

export const TrickView: React.FC<TrickViewProps> = ({ firstPlayerIndex: firstPlayedIndex, trick, width }) => {
  const Card = (player: number) => {
    const index = (player + firstPlayedIndex) % 4
    return index < trick.length ? <CardView card={trick[index]} width={width} /> : null
  }

  return (
    <div className="trick">
      <div className="top">{Card(2)}</div>
      <div className="middle">
        <div className="left">{Card(3)}</div>
        <div className="right">{Card(1)}</div>
      </div>
      <div className="bottom">{Card(0)}</div>
    </div>
  )
}
