const B = require('../utils/Lotus.react')
const MoveCombos = require('./MoveCombos')
const Styles = require('../styles')
const bestMovesFor = require('../../src/best-moves')
const finalEvolutions = require('../../json/finalEvolutions')
const n = require('../utils/n')
const pokemonActions = require('../actions/pokemonActions')

function Results(props) {
  var bestMoves = null
  if (finalEvolutions[props.pokemon.name]) {
    bestMoves = bestMovesFor(props.pokemon.name, props.best.ivs.IndAtk)
  }

  console.log(props)

  return (
    n(B.View, [
      n(B.View, [
        n(B.Button, { size: 'sm', onClick: pokemonActions.resultsReset }, 'Check Another'),
      ]),

      n(B.View, { spacingVertical: 'md', style: Styles.resultsRow }, [
        n(B.Text, { style: Styles.bigText }, props.pokemon.name),
        n(B.Text, `CP: ${props.pokemon.cp} | HP: ${props.pokemon.hp}`),
        n(B.View, { style: Styles.pokemonImage }, [
          n(B.Image, { src: `images/${props.pokemon.name}.png`, height: 150, width: 150 }),
        ]),
        n(
          B.Text,
          { style: Styles.bigText },
          props.range.iv[0] === props.range.iv[1]
            ? `${props.range.iv[0]}%`
            : `${props.range.iv[0]}% - ${props.range.iv[1]}%`
        ),
        n(B.Text, { style: Styles.resultsRow }, [
          props.chance === 100
            ? `Keep your ${props.pokemon.cp}CP ${props.pokemon.name}`
            : props.chance === 0
              ? `Send this Pokemon to the grinder for candy.`
              : `Maybe you should keep this Pokemon around.`
        ]),
      ]),

      n(B.View, { spacingVertical: 'md' }, [
        n('h3', { style: Styles.resultsRow }, `Possible values (${props.values.length})`),
        n(B.Text, { style: Styles.resultsRow }, [
          props.values.length === 1
            ? n('span', 'Congrats, here are your Pokemon\'s values')
            : n('span', [
              'There are ',
              n('strong', props.values.length),
              ' possibilities and a ',
              n('strong', `${props.chance}%`),
              ` chance you will have a good ${props.pokemon.name}. `,
              'Highlighted rows show even levels since you can only catch even leveled Pokemon.',
            ]),
        ]),
        n(B.Table, { clean: true, border: true }, [
          n('thead', [
            n('tr', [
              n('th', 'IV'),
              n('th', 'Level'),
              n('th', 'CP %'),
              n('th', 'HP %'),
              n('th', 'Battle %'),
            ]),
          ]),
          n('tbody', props.values.map((value) => (
            n('tr', {
              style: {
                backgroundColor: Number(value.Level) % 1 === 0 ? '#fef4f4' : '',
              },
            }, [
              n('td', [
                n(B.Text, {
                  className: 'label',
                  style: value.percent.PerfectIV > 80
                    ? Styles.good
                    : value.percent.PerfectIV > 69
                    ? Styles.ok
                    : Styles.bad,
                }, `${value.percent.PerfectIV}%`),
                ' ',
                n('strong', value.strings.iv),
              ]),
              n('td', value.Level),
              n('td', value.percent.PercentCP),
              n('td', value.percent.PercentHP),
              n('td', value.percent.PercentBatt),
            ])
          ))),
        ]),
      ]),

      // We should only show best moveset if it is in its final evolved form...
      bestMoves && (
        n(B.View, { spacingVertical: 'md' }, [
          n('h3', { style: Styles.resultsRow }, `Best moveset combos for ${props.pokemon.name}`),
          n(MoveCombos, { moves: bestMoves }),
        ])
      ),

      props.best.meta.EvolveCP && (
        n(B.View, { spacingVertical: 'md', style: Styles.resultsRow }, [
          n('h3', 'Evolution'),
          n(B.Panel, [
            n(B.Text, `If evolved it would have a CP of about ${props.best.meta.EvolveCP}`),
          ]),
        ])
      ),

      props.best.meta.Stardust > 0 && (
        n(B.View, { spacingVertical: 'md', style: Styles.resultsRow }, [
          n('h3', { style: Styles.resultsRow }, `Maxing out to level ${props.best.meta.MaxLevel}`),
          props.pokemon.level === null && (
            n(B.Text, `Assuming that your Pokemon's current level is ${props.best.Level}. The information below is just an estimate.`)
          ),
          n(B.View, [
            n(B.Panel, `Current level: ${props.best.Level}`),
            n(B.Panel, `Candy cost: ${props.best.meta.Candy}`),
            n(B.Panel, `Stardust cost: ${props.best.meta.Stardust}`),
            n(B.Panel, `CP: ${props.best.meta.MaxCP}`),
            n(B.Panel, `HP: ${props.best.meta.MaxHP}`),
          ]),
        ])
      ),

      n(B.View, { spacingVertical: 'md' }, [
        n('h3', { style: Styles.resultsRow }, 'Yours vs Perfect by level'),
        n(B.Table, [
          n('thead', [
            n('tr', [
              n('th', 'Level'),
              n('th', 'Your CP'),
              n('th', 'Best CP'),
              n('th', 'Your HP'),
              n('th', 'Best HP'),
            ]),
          ]),
          n('tbody', props.values.reduce((o, value) => {
            if (o._[value.Level]) return o
            o._[value.Level] = 1
            o.rows.push(value)
            return o
          }, { rows: [], _: {} }).rows
          .sort((a, b) => a.Level > b.Level ? 1 : -1)
          .map((value) => (
            n('tr', [
              n('td', value.Level),
              n('td', value.CP),
              n('td', value.meta.MaxLevelCP),
              n('td', value.HP),
              n('td', value.meta.MaxLevelHP),
            ])
          ))),
        ]),
      ]),
    ])
  )
}

module.exports = Results
