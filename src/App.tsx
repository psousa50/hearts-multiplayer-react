import React from "react"
import * as Dealer from "./hearts-game-core/Dealer/domain"
import * as Game from "./hearts-game-core/Game/domain"
import * as Player from "./hearts-game-core/Players/domain"
import { pipe } from "fp-ts/lib/pipeable"
import { GameView } from "./components/GameView"
import { getOrElse, Either } from "fp-ts/lib/Either"

const p1 = Player.create("p1", "Player 1")
const p2 = Player.create("p2", "Player 2")
const p3 = Player.create("p3", "Player 3")
const p4 = Player.create("p4", "Player 4")
const players = [p1, p2, p3, p4]

const environment = {
  dealer: Dealer,
  playerEventDispatcher: () => undefined,
  validateMove: () => true,
}

const getRight = <L, A>(fa: Either<L, A>) =>
  pipe(
    fa,
    getOrElse<L, A>(e => {
      throw new Error(`Should be Right => ${JSON.stringify(e)}`)
    }),
  )

const App: React.FC = () => {

  console.log("=====>", "APP")
  const game = getRight(pipe(Game.create(players)(environment)))

  return <GameView game={game} />
}

export default App
