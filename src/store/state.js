import { playMode } from '../common/js/config'
// console.log(playmode)

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode['sequence'],
  currentIndex: -1
}

export default state