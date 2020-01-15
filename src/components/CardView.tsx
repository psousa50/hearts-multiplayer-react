import React from "react"
import { Card } from "../hearts-game-core/Cards/model"
import { getCardImages } from "../images/cards"

interface CardViewProps {
  card: Card
}

export const CardView: React.FC<CardViewProps> = ({ card }) => {
  return <div style={{ width:600, height:600, borderWidth:10, backgroundColor:"yellow"}}> <img src={getCardImages(card)} alt=""></img></div>
}
