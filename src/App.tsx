import * as Card from "./hearts-game-core/Cards/domain"
import React from 'react'
import { CardView } from './components/CardView'
import { Suit } from "./hearts-game-core/Cards/model"

const App: React.FC = () => {

  return (
    <div style={{width: 200}} >
      <CardView card={Card.create(Suit.Clubs, 2)} />
      <CardView card={Card.create(Suit.Hearts, 2)} />
      <CardView card={Card.create(Suit.Diamonds, 2)} />
      <CardView card={Card.create(Suit.Spades, 2)} />
    </div>
  )
}

export default App;
