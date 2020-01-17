import React from "react"
import * as Player from "../hearts-game-core/Players/domain"
import * as GameModel from "../hearts-game-core/Game/model"
import * as Game from "../hearts-game-core/Game/domain"
import * as Move from "../hearts-game-core/Moves/domain"
import { TableView } from "./TableView"
import { actionOf } from "../hearts-game-core/utils/actions"
import { pipe } from "fp-ts/lib/pipeable"
import { Either, fold } from "fp-ts/lib/Either"
import * as Dealer from "../hearts-game-core/Dealer/domain"
import { Environment } from "../hearts-game-core/Environment/model"
import { PlayerEvent, PlayerEventType } from "../hearts-game-core/Events/model"
import { PlayerId } from "../hearts-game-core/Players/model"
import { Card } from "../hearts-game-core/Cards/model"
import { chain } from "fp-ts/lib/ReaderEither"

interface GameViewProps {
  game: GameModel.Game
}

interface GameState {
  game: GameModel.Game
  nextPlayerId: string
  error: string
}

const p1 = Player.create("p1", "Player 1")
const p2 = Player.create("p2", "Player 2")
const p3 = Player.create("p3", "Player 3")
const p4 = Player.create("p4", "Player 4")
const players = [p1, p2, p3, p4]

export const GameView: React.FC<GameViewProps> = ({ game }) => {
  const [state, setState] = React.useState<GameState>({ game, error: "", nextPlayerId: "" })

  console.log("=====>", state)
  
  const mergeState = (newState: Partial<GameState>) => {
    setState(state => ({ ...state, ...newState }))
  }

  const playerEventDispatcher = (playerId: PlayerId, event: PlayerEvent) => {
    switch (event.type) {
      case PlayerEventType.Play:
        mergeState({ nextPlayerId: playerId })
        break
    }
  }

  const environment: Environment = {
    dealer: Dealer,
    playerEventDispatcher,
    validateMove: Game.isValidMove,
  }

  const setGame = (gameResult: Either<GameModel.GameError, GameModel.Game>) =>
    pipe(
      gameResult,
      fold(
        e => {
          mergeState({ error: e.type.toString() })
          return actionOf(undefined)
        },
        g => {
          mergeState({ game: g, error: "" })
          return actionOf(undefined)
        },
      ),
    )

  const startGame = () => {
    const newGame = pipe(Game.create(players), chain(Game.start))(environment)
    setGame(newGame)
  }

  const onCardPlay = (playerId: PlayerId) => (card: Card) => {
    console.log("=====>", playerId, card)
    setGame(pipe(actionOf(state.game), chain(Game.played(playerId, Move.createCardMove(card))))(environment))
  }

  return (
    <div>
      <div>{state.error}</div>
      <div>{state.nextPlayerId}</div>
      <TableView game={state.game} onCardPlay={onCardPlay} />
      <button onClick={startGame}>{"START"}</button>
    </div>
  )
}
