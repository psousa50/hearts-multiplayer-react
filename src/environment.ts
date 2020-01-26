import { Environment } from "./hearts-game-core/Environment/model"
import { Dealer } from "./hearts-game-core/dealer"
import * as Game from "./hearts-game-core/Game/domain"

export const defaulEnvironment: Environment = {
  config: {
    auto: true,
  },
  dealer: Dealer,
  playerEventDispatcher: () => undefined,
  validateMove: Game.isValidMove,
}

