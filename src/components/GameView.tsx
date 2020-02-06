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
import { Card } from "../hearts-game-core/Cards/model"
import { chain } from "fp-ts/lib/ReaderEither"
import { defaulEnvironment } from "../environment"
import { findBestMove } from "../hearts-game-core/AI/mcts"

require("./GameView.css")

interface GameViewProps {
  initialGame: GameModel.Game
}

interface GameState {
  game: GameModel.Game
  nextPlayerId: string
  move?: MoveModels.Move
  trickFinished: boolean
  error: string
}

enum PlayerType {
  Random = "Random",
  MCTS = "MCTS",
  Human = "Human",
}

const randomMove = (event: PlayerEvent) => {
  const validCards = event.playerState.hand.filter(card =>
    Game.isValidMove(event.gameState, event.playerState)(Move.createCardMove(card)),
  )

  return validCards.length > 0
    ? Move.createCardMove(validCards[Math.floor(Math.random() * validCards.length)])
    : undefined
}

const mctsMove = (event: PlayerEvent) => findBestMove(event.gameState, event.playerState, { timeLimitMs: 500} )

type PlayFunction = (event: PlayerEvent) => MoveModels.Move | undefined
type PlayFunctions = {
  [k: string]: PlayFunction
}

const play: PlayFunctions = {
  [PlayerType.Human]: () => undefined,
  [PlayerType.Random]: randomMove,
  [PlayerType.MCTS]: mctsMove,
}

const p1 = Player.create("p1", "Player 1", PlayerType.MCTS)
const p2 = Player.create("p2", "Player 2", PlayerType.MCTS)
const p3 = Player.create("p3", "Player 3", PlayerType.MCTS)
const p4 = Player.create("p4", "Player 4", PlayerType.MCTS)
const players = [p1, p2, p3, p4]

export const GameView: React.FC<GameViewProps> = ({ initialGame }) => {
  const [state, setState] = React.useState<GameState>({
    game: initialGame,
    error: "",
    nextPlayerId: "",
    trickFinished: false,
  })

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (state.game.stage === GameModel.GameStage.Playing && !state.trickFinished) {
        nextPlay()
      }
    }, 100)
    return () => clearTimeout(timer)
  })

  const mergeState = (newState: Partial<GameState>) => {
    setState(state => ({ ...state, ...newState }))
  }

  const playerEventDispatcher = (playerId: PlayerId, event: PlayerEvent) => {
    switch (event.type) {
      case PlayerEventType.Play:
        mergeState({ nextPlayerId: playerId })
        const move = play[event.playerState.type](event)
        if (move) {
          mergeState({ move })
        }
        break
      case PlayerEventType.TrickFinished:
        mergeState({ trickFinished: true })
        break
    }
    return undefined
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
    setGame(pipe(Game.create(players), chain(Game.start))(environment))
  }

  const nextPlay = () => {
    if (state.move && state.move.type === MoveModels.MoveType.Card && state.nextPlayerId) {
      mergeState({ move: undefined, trickFinished: false })
      onCardPlay(state.nextPlayerId)(state.move.card)
    }
  }

  const onCardPlay = (playerId: PlayerId) => (card: Card) => {
    doGameAction(Game.played(playerId, Move.createCardMove(card)))
  }

  const trick = state.game.currentTrick.cards.length === 0 ? state.game.lastTrick : state.game.currentTrick
  return (
    <div className="game">
      <button onClick={startGame}>{"START"}</button>
      <button onClick={nextPlay}>{"PLAY"}</button>
      <div>{state.error}</div>
      <div>{state.nextPlayerId}</div>
      <TableView game={state.game} trick={trick} onCardPlay={onCardPlay} />
    </div>
  )
}

