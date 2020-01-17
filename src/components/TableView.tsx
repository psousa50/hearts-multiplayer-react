import React from "react"
import { Game } from "../hearts-game-core/Game/model"
import { HandView } from "./HandView"
import { TrickView } from "./TrickView"
import { Card } from "../hearts-game-core/Cards/model"
import { PlayerId } from "../hearts-game-core/Players/model"

import "./TableView.css"

interface TableViewProps {
  game: Game
  onCardPlay: (playerId: PlayerId) => (card: Card) => void
}

const cardWidth = 100

export const TableView: React.FC<TableViewProps> = ({ game, onCardPlay }) => {

  const bottomPlayer = game.players[0]
  const leftPlayer = game.players[1]
  const topPlayer = game.players[2]
  const rightPlayer = game.players[3]

  return (
    <div className="table">
      <div className="top-row">
        <HandView playerId={topPlayer.id} hand={topPlayer.hand} orientation="horizontal" cardWidth={cardWidth} onCardPlay={onCardPlay} />
      </div>
      <div className="mid-row">
          <HandView playerId={leftPlayer.id} hand={leftPlayer.hand} orientation="vertical" cardWidth={cardWidth} onCardPlay={onCardPlay} />
          <TrickView trick={game.currentTrick} width={cardWidth} />
          <HandView playerId={rightPlayer.id} hand={rightPlayer.hand} orientation="vertical" cardWidth={cardWidth} onCardPlay={onCardPlay} />
      </div>
      <div  className="bottom-row">
        <HandView playerId={bottomPlayer.id} hand={bottomPlayer.hand} orientation="horizontal" cardWidth={cardWidth} onCardPlay={onCardPlay} />
      </div>
    </div>
  )
}
