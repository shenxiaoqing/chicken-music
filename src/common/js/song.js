export default class Song {
  constructor({
    id,mid,singer,name,album,duration,image,url,song
  }) {
    // console.log(id, mid, singer, name, album, duration, image, url)
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}
export function createSong(musicData){
  // console.log(musicData.songmid)
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer:filterSinger(musicData.singer),
    name: musicData.songname,
    album:musicData.albumname,
    duration:musicData.interval,
    image: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+musicData.albummid+'.jpg?max_age=2592000',
    url:'http://ws.stream.qqmusic.qq.com/C100'+musicData.songmid+'.m4a?fromtag=0&guid=126548448'
  })
}

function filterSinger(singer){
  let ret=[]
  if(!singer){
    return ''
  }
  singer.forEach((n)=>{
    ret.push(n.name)
  })
  return ret.join('/')
}

// http://y.gtimg.cn/music/photo_new/T002R300x300M000003y8dsH2wBHlo.jpg?max_age=2592000
// http://dl.stream.qqmusic.qq.com/C400 0026DBoG28Y4Hz .m4a?vkey=1FFC6A65F710B2DB09A6A56854F19F37DD429AA1DEBA8E6A775626C1EDD0CCC259E74F5FDA9FF6C110B806124AE61E417CCCCC3941AC214C&guid=8151237400&uin=0&fromtag=66


// https://thirdparty.gtimg.com/102636799.m4a?fromtag=38