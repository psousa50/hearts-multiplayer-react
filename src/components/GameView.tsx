import React from "react"
import * as Player from "../hearts-game-core/Players/domain"
import * as GameModel from "../hearts-game-core/Game/model"
import * as Game from "../hearts-game-core/Game/domain"
import * as Move from "../hearts-game-core/Moves/domain"
import * as MoveModels from "../hearts-game-core/Moves/model"
import { TableView } from "./TableView"
import { actionOf, GameAction } from "../hearts-game-core/utils/actions"
import { pipe } from "fp-ts/lib/pipeable"
import { Either, fold } from "fp-ts/lib/Either"
import { Environment } from "../hearts-game-core/Environment/model"
import { PlayerEvent, PlayerEventType } from "../hearts-game-core/Events/model"
import { PlayerId } from "../hearts-game-core/Players/model"
import { Card, Trick } from "../hearts-game-core/Cards/model"
import { chain } from "fp-ts/lib/ReaderEither"
import { defaulEnvironment } from "../environment"

interface GameViewProps {
  initialGame: GameModel.Game
}

interface GameState {
  game: GameModel.Game
  lastTrick: Trick | undefined
  nextPlayerId: string
  move?: MoveModels.Move
  error: string
}

const p1 = Player.create("p1", "Player 1")
const p2 = Player.create("p2", "Player 2")
const p3 = Player.create("p3", "Player 3")
const p4 = Player.create("p4", "Player 4")
const players = [p1, p2, p3, p4]

export const GameView: React.FC<GameViewProps> = ({ initialGame }) => {
  const [state, setState] = React.useState<GameState>({
    game: initialGame,
    error: "",
    nextPlayerId: "",
    lastTrick: undefined,
  })

  console.log("=====>", state)

  const mergeState = (newState: Partial<GameState>) => {
    setState(state => ({ ...state, ...newState }))
  }

  const playerEventDispatcher = (playerId: PlayerId, event: PlayerEvent) => {
    console.log("EVENT=====>", event)
    switch (event.type) {
      case PlayerEventType.Play:
        mergeState({ nextPlayerId: playerId })
        const validCards = event.playerState.hand.filter(card =>
          Game.isValidMove(event.gameState, event.playerState, Move.createCardMove(card)),
        )
        mergeState({ move: Move.createCardMove(validCards[0])})
        break
      case PlayerEventType.TrickFinished:
        mergeState({ lastTrick: event.gameState.currentTrick })
        break
    }
  }

  const environment: Environment = {
    ...defaulEnvironment,
    playerEventDispatcher,
  }

  const setGame = (gameResult: Either<GameModel.GameError, GameModel.Game>) =>
    pipe(
      gameResult,
      fold(
        e => {
          mergeState({ error: e.type.toString() })
          return actionOf(undefined)
        },
        game => {
          mergeState({ game, error: "" })
          return actionOf(undefined)
        },
      ),
    )

  const doGameAction = (gameAction: GameAction) => {
    setGame(pipe(actionOf(state.game), chain(gameAction))(environment))
  }

  const startGame = () => {
    mergeState({ lastTrick: undefined})
    setGame(pipe(Game.create(players), chain(Game.start))(environment))
  }

  const nextPlay = () => {
    if (state.move && state.move.type === MoveModels.MoveType.Card &&  state.nextPlayerId){
      onCardPlay(state.nextPlayerId)(state.move.card)
    }
  }

  const onCardPlay = (playerId: PlayerId) => (card: Card) => {
    console.log("onCardPlay=====>", playerId, card)
    mergeState({ lastTrick: undefined })
    doGameAction(Game.played(playerId, Move.createCardMove(card)))
  }

  const trick = state.lastTrick || state.game.currentTrick
  return (
    <div>
      <button onClick={startGame}>{"START"}</button>
      <button onClick={nextPlay}>{"PLAY"}</button>
      <div>{state.error}</div>
      <div>{state.nextPlayerId}</div>
      <TableView game={state.game} trick={trick} onCardPlay={onCardPlay} />
    </div>
  )
}
