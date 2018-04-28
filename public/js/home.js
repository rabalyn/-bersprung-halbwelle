const socket = io()
localStorage.debug = 'home:*'
const loginfo = debug('home:info')
const logdebug = debug('home:debug')
const logerror = debug('home:error')

socket.on('connection', () => {
  logdebug('socket connected')
})

function POSTsync(data) {
  socket.emit('sync', data)
}

let plus = 4
let minus = 5
const maxVal = plus + minus

let playStimmungkippt = false
let playCheer = false

function playVideo() {
  const vid = document.getElementById('videoStimmung')
  vid.play()
}

function playAudioCheer() {
  const audio = document.getElementById('audioCheer')
  audio.play()
}

document.addEventListener('DOMContentLoaded', () => {
  logdebug('DOM loaded')
  document.getElementById('minus').addEventListener('click', (e) => {
    e.preventDefault()
    if(minus < maxVal && plus > 0) {
      minus++
      plus--
      playCheer = false

      if( minus > maxVal / 2 && minus < (maxVal / 2) + 1.1 ) {
        playStimmungkippt = true
      } else {
        playStimmungkippt = false
      }

      chart.data.datasets[0].data[0] = minus
      chart.data.datasets[0].data[1] = plus
      chart.update()
      POSTsync({plus: plus, minus: minus, playStimmungkippt: playStimmungkippt, playCheer: playCheer})
    }

    if(playStimmungkippt) {
      playVideo()
    }
  })

  document.getElementById('plus').addEventListener('click', (e) => {
    e.preventDefault()
    if(plus < maxVal && minus > 0) {
      plus++
      minus--
      playStimmungkippt = false

      if( plus > maxVal / 2 && plus < (maxVal / 2) + 1.1 ) {
        playCheer = true
      } else {
        playCheer = false
      }

      chart.data.datasets[0].data[0] = minus
      chart.data.datasets[0].data[1] = plus
      chart.update()
      POSTsync({plus: plus, minus: minus, playStimmungkippt: playStimmungkippt, playCheer: playCheer})

      if(playCheer) {
        playAudioCheer()
      }
    }
  })

  const ctx = document.getElementById('scale').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['🙁', '🙂'],
      datasets: [{
        data: [minus, plus],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 245, 67, 0.2)'
        ]
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      }
    }
  })

  socket.on('pushSync', (data) => {
    logdebug(data)
    minus = data.minus
    plus = data.plus
    playStimmungkippt = data.playStimmungkippt
    playCheer = data.playCheer
    
    chart.data.datasets[0].data[0] = minus
    chart.data.datasets[0].data[1] = plus
    chart.update()
    if(playStimmungkippt) {
      playVideo()
    }

    if(playCheer) {
      playAudioCheer()
    }
  })
})
