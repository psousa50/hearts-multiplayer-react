import React from "react"
import { Card } from "../hearts-game-core/Cards/model"
import { getCardImages } from "../images/cards"

import "./CardView.css"

const width = 167.0869141
const height = 242.6669922
const aspectRatio = height / width

export const getHeight = (width: number) => aspectRatio * width

interface CardViewProps {
  card: Card
  width: number
  onClick?: (card: Card) => void
}

export const CardView: React.FC<CardViewProps> = ({ card, onClick, width }) => (
  <div className="card" onClick={() => onClick && onClick(card)}>
    <img width={width} height={getHeight(width)} src={getCardImages(card)} alt=""></img>
  </div>
)
