/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / Pause / Seek
 * 4. CD rotate - Animation web API
 * 5. Next prev
 * 6. Random - toggle
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const playBnt = $('.btn-toggle-play')
const prevBnt = $('.btn-prev')
const nextBnt = $('.btn-next')
const repeatBnt = $('.btn-repeat')
const randomBnt = $('.btn-random')
const progress = $('#progress')
const audio = $('#audio')
const playlist = $('.playlist')


const app = {
  cdWidth: cd.offsetWidth,
  currentIndex: 0,
  isRandom: false,
  isRepeat: false,

  songs: [
    {
      id: 0,
      name: 'Counting Stars',
      singer: 'OneRepublic',
      image: './data/img/1.jpg',
      src: './data/mp3/1.mp3'
    },
    {
      id: 1,
      name: 'Happy For You',
      singer: 'Lukas Graham',
      image: './data/img/2.jpg',
      src: './data/mp3/2.mp3'
    },
    {
      id: 2,
      name: 'Run ',
      singer: 'OneRepublic',
      image: './data/img/3.jpg',
      src: './data/mp3/3.mp3'
    },
    {
      id: 3,
      name: 'TO THE MOON',
      singer: 'hooligan',
      image: './data/img/4.jpg',
      src: './data/mp3/4.mp3'
    },
    {
      id: 4,
      name: 'Paris In The Rain',
      singer: 'Lauv ',
      image: './data/img/5.jpg',
      src: './data/mp3/5.mp3'
    },
    {
      id: 5,
      name: 'I Like Me Better',
      singer: 'Lauv ',
      image: './data/img/6.jpg',
      src: './data/mp3/6.mp3'
    },
    {
      id: 6,
      name: 'Camila Cabello',
      singer: 'Bam Bam Ft. Ed Sheeran',
      image: './data/img/7.jpg',
      src: './data/mp3/7.mp3'
    },
    {
      id: 7,
      name: 'I\'m Yours',
      singer: 'Chill Vibes',
      image: './data/img/8.jpg',
      src: './data/mp3/8.mp3'
    },
    {
      id: 8,
      name: 'Enemy ',
      singer: 'Imagine Dragons & JID',
      image: './data/img/9.jpg',
      src: './data/mp3/9.mp3'
    },
    {
      id: 9,
      name: 'What Are Words',
      singer: 'Chris Medina',
      image: './data/img/10.jpg',
      src: './data/mp3/10.mp3'
    }
  ],
  renderSongs: function() {
    let html = this.songs.map((song, index) => {
      return `
        <div class="song${index == this.currentIndex ? ' active' : ''}" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    })
    playlist.innerHTML = html.join('\n')
  },
  handleEvents: function() {
    const _this = app
    document.onscroll = function() {
      let newCdWidth = _this.cdWidth - window.scrollY
      newCdWidth = Math.max(newCdWidth, 0)
      cd.style.width = newCdWidth + 'px'
      cd.style.opacity = newCdWidth / _this.cdWidth
    }

    playBnt.onclick = function() {
      if (audio.paused) {
        audio.play()
      }
      else {
        audio.pause()
      }
    }

    audio.ontimeupdate = function() {
      const progressPercent = audio.currentTime / audio.duration * 100
      progress.value = progressPercent
    }

    // handle when seek song in progress
    progress.onchange = function() {
      const newTime = progress.value / 100 * audio.duration
      audio.currentTime = newTime
    }

    // handle prev button
    prevBnt.onclick = function() {
      _this.currentIndex--
      _this.currentIndex += _this.songs.length
      _this.currentIndex %= _this.songs.length
      _this.loadCurrentSong()
      audio.play()
    }

    // handle next button
    nextBnt.onclick = function() {
      if (_this.isRandom) {
        let nextSongIndex
        do {
          nextSongIndex = Math.floor(Math.random() * _this.songs.length)
        } while (nextSongIndex == _this.currentIndex)
        _this.currentIndex = nextSongIndex
      }
      else {
        _this.currentIndex++
        _this.currentIndex %= _this.songs.length
      }

      _this.loadCurrentSong()
      audio.play()
    }

    audio.onplay = function() {
      // rotate CD when radio playing
      cd.animate(
        [
          { transform: 'rotate(0)' },
          { transform: 'rotate(360deg)' }
        ], {
          duration: 8000,
          iterations: Infinity
        }
      )

      player.classList.add('playing')
    }

    audio.onpause = function() {
      cd.animate(
        [
          { transform: 'rotate(0)' },
          { transform: 'rotate(360deg)' }
        ], {
          duration: 8000,
          iterations: Infinity
        }
      ).pause()
      player.classList.remove('playing')
    }

    audio.onended = function() {
      if (!_this.isRepeat) {
        nextBnt.click()
      }
      audio.play()
    }

    randomBnt.onclick = function() {
      _this.isRandom = !_this.isRandom
      if (_this.isRandom) {
        randomBnt.classList.add('active')
      }
      else {
        randomBnt.classList.remove('active')
      }
    }

    repeatBnt.onclick = function() {
      _this.isRepeat = !_this.isRepeat
      if (_this.isRepeat) {
        repeatBnt.classList.add('active')
      }
      else {
        repeatBnt.classList.remove('active')
      }
    }

    // handle when play by click song
    playlist.onclick = function(e) {
      const element = e.target
      const song = e.target.closest('.song')
      if (
        element.closest('.song') && 
        !element.closest('.song.active') &&
        !element.closest('.option')
      ) {
        const index = parseInt(song.dataset.index)
        _this.currentIndex = index
        _this.loadCurrentSong()
        audio.play()
      }
    }
  },
  loadCurrentSong: function() {
    const song = this.songs[this.currentIndex]
    const header = $('.dashboard h2')
    const cdThumb = $('.cd-thumb')
    
    header.innerText = song.name
    cdThumb.style.backgroundImage = `url('${song.image}')`
    audio.src = song.src

    this.renderSongs()
    $('.song.active').scrollIntoView({ 
      behavior: 'smooth',
      block: 'center' 
    })
  },
  start: function() {
    this.handleEvents()
    this.loadCurrentSong()

    this.renderSongs()
  }
}

app.start();