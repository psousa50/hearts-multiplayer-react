import React from "react"
import { Trick } from "../hearts-game-core/Cards/model"
import { CardView } from "./CardView"

import "./TrickView.css"

const width = 167.0869141
const height = 242.6669922
const aspectRatio = height / width

export const getHeight = (width: number) => aspectRatio * width

interface TrickViewProps {
  trick: Trick
  width: number
}

export const TrickView: React.FC<TrickViewProps> = ({ trick, width }) => (
  <div className="trick">
    {trick.map(card => <div key={`${card.faceValue}-${card.suit}`} className="trick-card"><CardView card={card} width={width} /></div>)}
  </div>
)
