const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const next = $('.btn-next')
const prev = $('.btn-prev')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const playlist = $('.playlist')
const volumeIcon = $('.volume-change');
const volumeBar = $('.volume');
const currentTime = $('.currentTime');
const durationTime = $('.durationTime');




const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    currentVolume: 0.0,
    //currentIndex : chỉ mục đầu tiên của mảng//
    
    songs: [
        {
            name: 'Đại Thiên Bồng',
            singer: 'Thanh Thủy',
            path: './music/1.mp3',
            image: './image/daithienbong.jpg'
        },
        {
            name: 'Du Sơn Luyến',
            singer: 'Hải Luân',
            path: './music/2.mp3',
            image: './image/dusonluen.jpg'
        },
        {
            name: 'Head In The Clouds',
            singer: 'Hayd',
            path: './music/3.mp3',
            image: './image/headintheclouds.jpg'
        },
        {
            name: 'Hôm Nay Em Cưới Rồi',
            singer: 'Khải Đăng - Thanh Hưng',
            path: './music/4.mp3',
            image: './image/homnayemcuoi.jpg'
        },
        {
            name: 'CÓ CHƠI CÓ CHỊU',
            singer: 'KARIK x ONLY C',
            path: './music/5.mp3',
            image: './image/cochoicochiu.jpg'
        },
        {
            name: 'Mạc Vấn Quy Kỳ',
            singer: 'Tưởng Tuyết Nhi-Là Thất Thúc Đây',
            path: './music/6.mp3',
            image: './image/macvanquyky.jpg'
        },
        {
            name: 'Waiting For You',
            singer: 'MONO',
            path: './music/7.mp3',
            image: './image/waitingforyou.jpg'
        },
        {
            name: 'Một Bước Yêu, Vạn Dặm Đau',
            singer: 'Mr. Siro',
            path: './music/8.mp3',
            image: './image/1buocyeuvandamdau.jpg'
        },
        {
            name: 'Người Ấy',
            singer: 'Trịnh Thăng Bình',
            path: './music/9.mp3',
            image: './image/nguoiay.jpg'
        },
        {
            name: 'Ta Tên Trường An',
            singer: 'Chàng Tên Cố Lý - Doãn Tích Miên',
            path: './music/10.mp3',
            image: './image/tatentruongan.jpg'
        },
        {
            name: 'TÌNH ĐẦU',
            singer: 'Tăng Duy Tân',
            path: './music/11.mp3',
            image: './image/tinhdau.jpg'
        },
    ],



    render: function() {
       const htmls = this.songs.map((song, index) => {
        return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index='${index}'>
            <div class="thumb"
                style="background-image: url('${song.image}')">
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
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', 
        {get: function() {
            return app.songs[this.currentIndex]
        }})
    },

    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth 

        // xử lý cd quay vs dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ],{
            duration : 10000,
            iterations: Infinity
        }
        )
        cdThumbAnimate.pause()
        //phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }
       //xủ lý khi onclick play
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()  
            }else{
                audio.play()
            }
            
            audio.onplay = function() {
                _this.isPlaying = true
                playBtn.classList.add('playing')
                cdThumbAnimate.play()
                _this.activeSong();
			    if (_this.isMute) {
				    audio.volume = 0;
				    volumeBar.Value = 0;
		    	} else {
	     			audio.volume = _this.currentVolume;
		    		volumeBar.value = _this.currentVolume * 100;
			}
                
            }
            audio.onpause = function() {
                _this.isPlaying = false
                playBtn.classList.remove('playing')
                cdThumbAnimate.pause()

            }
            

            audio.ontimeupdate = function () {
                // Do khi vừa tải video thì nó là naN
                if (audio.duration) {
                    const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                    progress.value = progressPercent;
                    currentTime.textContent = _this.timeFormat(this.currentTime);
                    durationTime.textContent = _this.timeFormat(this.duration);
                }
            };

            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }

            
        }
        
        next.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }else{
                _this.nextSong()
                
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            _this.activeSong();
        }
        prev.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            _this.activeSong();
        }

        random.onclick = function() {
            _this.isRandom = !_this.isRandom
            random.classList.toggle('active',  _this.isRandom)
        }

        repeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            
            repeat.classList.toggle('active',  _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat);
        }
        
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else{

                next.click()
            }
        }

        playlist.onclick = function(e) {
            const songNote = e.target.closest('.song:not(.active)')
            //target : mục tiêu đc click trong $('.playlist')
            if (songNote || e.target.closest('.option')){
                if (songNote){
                    _this.currentIndex = Number(songNote.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                    _this.activeSong();
                }
            }
        }

        volumeIcon.onclick = function () {
			_this.isMute = !_this.isMute;
			// console.log({ volumeBar });
			_this.setConfig('isMute', _this.isMute);
			volumeIcon.classList.toggle('active', _this.isMute);
			if (_this.isMute) {
				audio.volume = 0;
				volumeBar.value = 0;
			} else {
				volumeBar.value = _this.currentVolume * 100;
				audio.volume = _this.currentVolume;
			}
		};
		volumeBar.onchange = function (e) {
			_this.currentVolume = e.target.value / 100;
			audio.volume = _this.currentVolume;
			_this.setConfig('currentVolume', _this.currentVolume);
			audio.play();
			if (audio.volume === 0) {
				volumeIcon.classList.add('active');
			} else {
				_this.isMute = false;
				_this.setConfig('isMute', _this.isMute);
				volumeIcon.classList.remove('active');
			}
		};
            
     
    }, 
    loadCurrentSong: function() {
       
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    timeFormat(seconds) {
		const date = new Date(null);
		date.setSeconds(seconds);
		return date.toISOString().slice(14, 19);
	},
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 400)
    },
    
    loadConfig: function () {
		this.isRandom = this.config.isRandom;
		this.isRepeat = this.config.isRepeat;
		this.currentVolume = this.config.currentVolume;
		this.isMute = this.config.isMute;
		this.currentIndex = this.config.currentIndex;
		// Hiển thị trạng thái bang đầu của button repeat và random
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeat);
		volumeIcon.classList.toggle('active', this.isMute);
	},
    activeSong: function () {
		const songs = $$('.song');
		songs.forEach((song, index) => {
			if (index === this.currentIndex) {
				song.classList.add('active');
				this.setConfig('currentIndex', this.currentIndex);
				setTimeout(() => {
					song.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center',
					});
				}, 300);
			} else song.classList.remove('active');
		});
	},
    start:  function() {
        //định nghĩa thuộc tính cho object bằng hàm defineProperty
        this.defineProperties()
        //Lắng nghe và xử lý sự kiện Dom event
        this.handleEvent()
        //tải thông bai hát đầu tiên vào giao diện (UI) khi chạy ứng dụng
        this.loadCurrentSong()
        //kết xuất playlist
        this.render()
        this.loadConfig();
    }
}
app.start()


