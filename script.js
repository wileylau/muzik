class MuzikPlayer {
    constructor() {
        this.currentPlaylist = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.apiBase = 'https://hhlqilongzhu.cn/api/dg_kuwomusic.php';
        this.lyricsApiBase = 'https://www.hhlqilongzhu.cn/api/dg_geci.php';
        this.currentLyrics = [];
        this.currentLyricsText = '';
        this.lyricsScrollTimeout = null;
        this.isUserScrolling = false;
        this.apiStatus = {
            music: false,
            lyrics: false
        };
        
        this.initializeElements();
        this.bindEvents();
        this.showPlayerByDefault();
        this.checkAPIStatus();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.searchResults = document.getElementById('searchResults');
        this.resultsList = document.getElementById('resultsList');

        this.audioPlayer = document.getElementById('audioPlayer');
        this.audioElement = document.getElementById('audioElement');
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.currentSongArtist = document.getElementById('currentSongArtist');
        this.currentSongAlbumArt = document.getElementById('currentSongAlbumArt');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.currentTime = document.getElementById('currentTime');
        this.duration = document.getElementById('duration');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.currentSongTitleMobile = document.getElementById('currentSongTitleMobile');
        this.currentSongArtistMobile = document.getElementById('currentSongArtistMobile');
        this.currentSongAlbumArtMobile = document.getElementById('currentSongAlbumArtMobile');
        this.playPauseBtnMobile = document.getElementById('playPauseBtnMobile');
        this.prevBtnMobile = document.getElementById('prevBtnMobile');
        this.nextBtnMobile = document.getElementById('nextBtnMobile');
        this.progressBarMobile = document.getElementById('progressBarMobile');
        this.currentTimeMobile = document.getElementById('currentTimeMobile');
        this.durationMobile = document.getElementById('durationMobile');
        
        this.compactSearch = document.getElementById('compactSearch');
        this.compactSearchInput = document.getElementById('compactSearchInput');
        this.compactSearchBtn = document.getElementById('compactSearchBtn');
        this.mainSearchSection = document.getElementById('mainSearchSection');
        
        this.downloadModal = document.getElementById('downloadModal');
        this.downloadMp3 = document.getElementById('downloadMp3');
        this.downloadFlac = document.getElementById('downloadFlac');
        this.download24Bit = document.getElementById('download24Bit');
        this.cancelDownload = document.getElementById('cancelDownload');
        
        this.currentSongInfo = document.getElementById('currentSongInfo');
        this.currentSongInfoMobile = document.getElementById('currentSongInfoMobile');
        
        // Fullscreen elements
        this.fullscreenNowPlaying = document.getElementById('fullscreenNowPlaying');
        this.closeFullscreenBtn = document.getElementById('closeFullscreenBtn');
        this.collapseFullscreenBtn = document.getElementById('collapseFullscreenBtn');
        this.fullscreenAlbumArt = document.getElementById('fullscreenAlbumArt');
        this.fullscreenSongTitle = document.getElementById('fullscreenSongTitle');
        this.fullscreenSongArtist = document.getElementById('fullscreenSongArtist');
        this.fullscreenProgressBar = document.getElementById('fullscreenProgressBar');
        this.fullscreenCurrentTime = document.getElementById('fullscreenCurrentTime');
        this.fullscreenDuration = document.getElementById('fullscreenDuration');
        this.fullscreenPlayPauseBtn = document.getElementById('fullscreenPlayPauseBtn');
        this.fullscreenPrevBtn = document.getElementById('fullscreenPrevBtn');
        this.fullscreenNextBtn = document.getElementById('fullscreenNextBtn');
        this.fullscreenDownloadBtn = document.getElementById('fullscreenDownloadBtn');
        this.mobileFullscreenLyricsBtn = document.getElementById('mobileFullscreenLyricsBtn');
        
        // Fullscreen lyrics elements
        this.fullscreenLyricsContainer = document.getElementById('fullscreenLyricsContainer');
        this.fullscreenLyricsList = document.getElementById('fullscreenLyricsList');
        
        // Lyrics elements
        this.lyricsContainer = document.getElementById('lyricsContainer');
        this.lyricsList = document.getElementById('lyricsList');
        this.mobileLyricsBtn = document.getElementById('mobileLyricsBtn');
        this.lyricsView = document.getElementById('lyricsView');
        this.closeLyricsBtn = document.getElementById('closeLyricsBtn');
        this.lyricsAlbumArt = document.getElementById('lyricsAlbumArt');
        this.lyricsSongTitle = document.getElementById('lyricsSongTitle');
        this.lyricsSongArtist = document.getElementById('lyricsSongArtist');
        this.lyricsProgressContainer = document.getElementById('lyricsProgressContainer');
        this.lyricsProgressBar = document.getElementById('lyricsProgressBar');
        this.lyricsCurrentTime = document.getElementById('lyricsCurrentTime');
        this.lyricsDuration = document.getElementById('lyricsDuration');
        this.lyricsPlayPauseBtn = document.getElementById('lyricsPlayPauseBtn');
        this.lyricsPrevBtn = document.getElementById('lyricsPrevBtn');
        this.lyricsNextBtn = document.getElementById('lyricsNextBtn');
        this.downloadLyricsBtn = document.getElementById('downloadLyricsBtn');
        
        // 24-bit API endpoint
        this.api24BitBase = 'https://www.hhlqilongzhu.cn/api/dg_mgmusic_24bit.php';
        
        // API Status elements
        this.apiStatusChip = document.getElementById('apiStatusChip');
        this.apiStatusDot = document.getElementById('apiStatusDot');
        this.apiStatusText = document.getElementById('apiStatusText');
        
        // Download notification elements
        this.downloadNotification = document.getElementById('downloadNotification');
        this.downloadNotificationText = document.getElementById('downloadNotificationText');
    }

    bindEvents() {
        if (this.searchBtn) this.searchBtn.addEventListener('click', () => this.performSearch());
        if (this.searchInput) this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        const header = document.querySelector('h1');
        if (header) header.addEventListener('click', () => location.reload());

        if (this.playPauseBtn) this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.playPrevious());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.playNext());
        if (this.downloadBtn) this.downloadBtn.addEventListener('click', () => this.showDownloadModal());
        
        if (this.playPauseBtnMobile) this.playPauseBtnMobile.addEventListener('click', () => this.togglePlayPause());
        if (this.prevBtnMobile) this.prevBtnMobile.addEventListener('click', () => this.playPrevious());
        if (this.nextBtnMobile) this.nextBtnMobile.addEventListener('click', () => this.playNext());
        
        if (this.compactSearchBtn) this.compactSearchBtn.addEventListener('click', () => this.performCompactSearch());
        if (this.compactSearchInput) this.compactSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performCompactSearch();
            }
        });
        
        if (this.downloadMp3) {
            this.downloadMp3.addEventListener('click', () => {
                this.prepareAndDownload('mp3');
            });
        }
        
        if (this.downloadFlac) {
            this.downloadFlac.addEventListener('click', () => {
                this.prepareAndDownload('flac');
            });
        }
        
        if (this.download24Bit) {
            this.download24Bit.addEventListener('click', () => {
                this.prepareAndDownload('24bit');
            });
        }
        
        if (this.downloadLyricsBtn) {
            this.downloadLyricsBtn.addEventListener('click', () => {
                this.downloadLyrics();
            });
        }
        
        if (this.cancelDownload) this.cancelDownload.addEventListener('click', () => this.hideDownloadModal());

        if (this.audioElement) {
            this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
            this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
            this.audioElement.addEventListener('timeupdate', () => this.updateLyricsHighlight());
            this.audioElement.addEventListener('ended', () => this.playNext());
            this.audioElement.addEventListener('play', () => this.updatePlayButton(true));
            this.audioElement.addEventListener('pause', () => this.updatePlayButton(false));
        }

        if (this.progressBar && this.progressBar.parentElement) {
            this.progressBar.parentElement.addEventListener('click', (e) => this.seekTo(e));
        }
        if (this.progressBarMobile && this.progressBarMobile.parentElement) {
            this.progressBarMobile.parentElement.addEventListener('click', (e) => this.seekToMobile(e));
        }
        
        if (this.audioElement) this.audioElement.volume = 0.5;
        
        if (this.currentSongInfo) this.currentSongInfo.addEventListener('click', () => this.showFullscreenNowPlaying());
        if (this.currentSongInfoMobile) this.currentSongInfoMobile.addEventListener('click', () => this.showFullscreenNowPlaying());
        if (this.closeFullscreenBtn) this.closeFullscreenBtn.addEventListener('click', () => this.hideFullscreenNowPlaying());
        if (this.collapseFullscreenBtn) this.collapseFullscreenBtn.addEventListener('click', () => this.hideFullscreenNowPlaying());
        
        if (this.fullscreenPlayPauseBtn) this.fullscreenPlayPauseBtn.addEventListener('click', () => this.togglePlayPause());
        if (this.fullscreenPrevBtn) this.fullscreenPrevBtn.addEventListener('click', () => this.playPrevious());
        if (this.fullscreenNextBtn) this.fullscreenNextBtn.addEventListener('click', () => this.playNext());
        if (this.fullscreenDownloadBtn) this.fullscreenDownloadBtn.addEventListener('click', () => this.showDownloadModal());
        
        // Lyrics event bindings
        if (this.mobileLyricsBtn) this.mobileLyricsBtn.addEventListener('click', () => this.showLyricsView());
        if (this.closeLyricsBtn) this.closeLyricsBtn.addEventListener('click', () => this.hideLyricsView());
        if (this.lyricsPlayPauseBtn) this.lyricsPlayPauseBtn.addEventListener('click', () => this.togglePlayPause());
        if (this.lyricsPrevBtn) this.lyricsPrevBtn.addEventListener('click', () => this.playPrevious());
        if (this.lyricsNextBtn) this.lyricsNextBtn.addEventListener('click', () => this.playNext());
        if (this.downloadLyricsBtn) this.downloadLyricsBtn.addEventListener('click', () => this.downloadLyrics());
        if (this.mobileFullscreenLyricsBtn) this.mobileFullscreenLyricsBtn.addEventListener('click', () => this.showLyricsView());
        
        if (this.lyricsProgressContainer && this.lyricsProgressContainer.parentElement) {
            this.lyricsProgressContainer.parentElement.addEventListener('click', (e) => this.seekToLyrics(e));
        }
        
        if (this.fullscreenProgressBar && this.fullscreenProgressBar.parentElement) {
            this.fullscreenProgressBar.parentElement.addEventListener('click', (e) => this.seekToFullscreen(e));
        }
        
        if (this.lyricsList) {
            this.lyricsList.addEventListener('scroll', () => this.handleLyricsScroll());
            this.lyricsList.addEventListener('touchstart', () => this.handleLyricsInteraction());
            this.lyricsList.addEventListener('mousedown', () => this.handleLyricsInteraction());
        }
        
        if (this.fullscreenLyricsList) {
            this.fullscreenLyricsList.addEventListener('scroll', () => this.handleLyricsScroll());
            this.fullscreenLyricsList.addEventListener('touchstart', () => this.handleLyricsInteraction());
            this.fullscreenLyricsList.addEventListener('mousedown', () => this.handleLyricsInteraction());
        }
    }

    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            alert('Please enter a search term');
            return;
        }

        this.showLoading(true);
        this.hideSearchResults();

        try {
            const apiUrl = `${this.apiBase}?msg=${encodeURIComponent(query)}&num=30&br=1&type=json`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const songsArray = (data && data.data && Array.isArray(data.data)) ? data.data : [];
            
            this.displaySearchResults(songsArray);
            this.shrinkSearchBar();
            this.moveSearchToNavbar();
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displaySearchResults(data) {
        if (!data || !Array.isArray(data) || data.length === 0) {
            this.resultsList.innerHTML = '<div class="p-6 text-gray-600 text-center">No results found</div>';
            this.showSearchResults();
            return;
        }

        this.currentPlaylist = data;
        this.resultsList.innerHTML = '';

        data.forEach((song, index) => {
            const songElement = this.createSongElement(song, index);
            this.resultsList.appendChild(songElement);
        });

        this.showSearchResults();
        
        this.scrollToSearchResultsTop();
    }

    scrollToSearchResultsTop() {
        if (this.searchResults) {
            this.searchResults.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
            }
        }
        
        if (this.resultsList) {
            this.resultsList.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        }
    }

    createSongElement(song, index) {
        const div = document.createElement('div');
        div.className = 'p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200 song-item group';
        div.dataset.index = index;
        div.addEventListener('click', () => this.playSong(index));

        const isMobile = window.innerWidth <= 768;
        
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 flex-1 min-w-0">
                    <div class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        ${song.n || index + 1}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-lg font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                            ${this.escapeHtml(song.songname || 'Unknown Title')}
                        </div>
                        <div class="text-sm text-gray-600 truncate">
                            ${this.escapeHtml(song.singer || 'Unknown Artist')}
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-3 ml-4">
                    <button class="download-song-btn w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 flex items-center justify-center" data-index="${index}" title="Download Song">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 flex items-center justify-center play-btn group-hover:bg-gray-200">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        `;
        
        const downloadBtn = div.querySelector('.download-song-btn');
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prepareDownloadForSong(song, index);
        });

        return div;
    }

    async playSong(index) {
        if (index < 0 || index >= this.currentPlaylist.length) {
            return;
        }

        this.currentIndex = index;
        const song = this.currentPlaylist[index];
        
        const songId = song.n;

        try {
            const originalQuery = this.searchInput.value.trim();
            let response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=2&type=json`);
            let data = await response.json();

            let retryCount = 0;
            const maxRetries = 3;
            while (data && data.flac_url && !data.flac_url.includes('trackmedia') && retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                retryCount++;
                response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=2&type=json`);
                data = await response.json();
            }
            
            if (retryCount >= maxRetries && data && data.flac_url && !data.flac_url.includes('trackmedia')) {
                throw new Error('Play failed, try again later');
            }

            if (data && data.flac_url) {
                this.audioElement.src = data.flac_url;
                this.currentAudioUrl = data.flac_url;
                this.currentSongData = {
                    ...song,
                    ...data
                };
                this.updateCurrentSongInfo(song, data);
                this.updateActiveSong(index);
                this.showPlayer();
                this.audioElement.play();
                
                // Fetch lyrics after song is loaded
                await this.fetchLyrics(song.songname, song.singer);
                
                
                await this.checkEarly24BitInfo(song);
            } else {
                throw new Error('No audio URL found');
            }
        } catch (error) {
            console.error('Play error:', error);
            alert('Failed to play song. Please try another one.');
        }
    }

    transformKuWoCoverUrl(originalUrl) {
        if (!originalUrl || typeof originalUrl !== 'string') {
            return null;
        }
                
        try {
            const url = new URL(originalUrl);
            
            if (url.hostname.includes('kuwo.cn') || url.hostname.includes('kwcdn.kuwo.cn')) {
                url.protocol = 'https:';
                url.hostname = 'img3.kuwo.cn';
                
                url.pathname = url.pathname.replace('/320/', '/500/');
                
                return url.toString();
            }
            
            return originalUrl;
        } catch (error) {
            return originalUrl;
        }
    }
    
    updateAlbumArtWithCover(coverUrl) {
        if (this.currentSongAlbumArt) {
            this.preloadAndSetAlbumArt(this.currentSongAlbumArt, coverUrl);
        }
        
        if (this.currentSongAlbumArtMobile) {
            this.preloadAndSetAlbumArt(this.currentSongAlbumArtMobile, coverUrl);
        }
        
        if (this.fullscreenAlbumArt) {
            this.preloadAndSetAlbumArt(this.fullscreenAlbumArt, coverUrl);
        }
        
        if (this.lyricsAlbumArt) {
            this.preloadAndSetAlbumArt(this.lyricsAlbumArt, coverUrl);
        }
    }

    async checkEarly24BitInfo(song) {
        const songName = song.songname || '';
        const songArtist = song.singer || '';
        
        if (!songName || !songArtist) {
            return;
        }

        try {
            const query = `${songName} ${songArtist}`;
            
            const apiUrl = `${this.api24BitBase}?msg=${encodeURIComponent(query)}&n=1&type=json`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                return;
            }
            
            const data = await response.json();
            
            if (!data) {
                return;
            }
            
            if (data.code === 200 && data.title && data.singer && data.quality) {
                const track = data;
                
                const normalizeString = (str) => {
                    if (typeof str !== 'string') return '';
                    return str.trim().toLowerCase().replace(/\s+/g, ' ');
                };
                
                const removeBrackets = (str) => {
                    if (typeof str !== 'string') return '';
                    return str.replace(/\[.*?\]|\(.*?\)|{.*?}|\（.*?\）|\【.*?\】/g, '').trim();
                };
                
                const normalizedSongName = normalizeString(removeBrackets(songName));
                const normalizedTrackTitle = normalizeString(removeBrackets(track.title));
                const normalizedSongArtist = normalizeString(removeBrackets(songArtist));
                const normalizedTrackSinger = normalizeString(removeBrackets(track.singer));
                const normalizedQuality = normalizeString("24bit至臻");
                const normalizedTrackQuality = normalizeString(track.quality);
                
                const titleMatch = normalizedSongName === normalizedTrackTitle;
                const singerMatch = normalizedSongArtist === normalizedTrackSinger;
                const qualityMatch = normalizedQuality === normalizedTrackQuality;
                
                if (this.currentSongData) {
                    this.currentSongData.has24Bit = (titleMatch && singerMatch && qualityMatch);
                    this.currentSongData.musicUrl24Bit = track.music_url || null;
                }
            }
        } catch (error) {
            return;
        }
    }

    updateActiveSong(index) {
        const allSongs = document.querySelectorAll('.song-item');
        allSongs.forEach(song => {
            song.classList.remove('active');
            const playBtn = song.querySelector('.play-btn i');
            if (playBtn) {
                playBtn.className = 'fas fa-play';
            }
        });

        const currentSong = document.querySelector(`.song-item[data-index="${index}"]`);
        if (currentSong) {
            currentSong.classList.add('active');
            const playBtn = currentSong.querySelector('.play-btn i');
            if (playBtn) {
                playBtn.className = 'fas fa-pause';
            }
        }
    }

    updateCurrentSongInfo(song, playData = null) {
        const title = song.songname || 'Unknown Title';
        const artist = song.singer || 'Unknown Artist';
        
        if (this.currentSongTitle) this.currentSongTitle.textContent = title;
        if (this.currentSongArtist) this.currentSongArtist.textContent = artist;
        
        if (this.currentSongTitleMobile) this.currentSongTitleMobile.textContent = title;
        if (this.currentSongArtistMobile) this.currentSongArtistMobile.textContent = artist;
        
        if (this.fullscreenSongTitle) this.fullscreenSongTitle.textContent = title;
        if (this.fullscreenSongArtist) this.fullscreenSongArtist.textContent = artist;
        
        if (this.lyricsSongTitle) this.lyricsSongTitle.textContent = title;
        if (this.lyricsSongArtist) this.lyricsSongArtist.textContent = artist;
        
        if (playData) {
            this.currentSongCover = playData.cover;
            this.currentSongLink = playData.link;
            this.currentAudioUrl = playData.flac_url;
            
            if (playData.cover) {
                const transformedCoverUrl = this.transformKuWoCoverUrl(playData.cover);
                if (transformedCoverUrl) {
                    this.updateAlbumArtWithCover(transformedCoverUrl);
                }
            }
        }
    }

    preloadAndSetAlbumArt(element, src) {
        if (!element || !src) {
            if (element) this.hideAlbumArt(element);
            return;
        }

        element.classList.add('hidden');
        const container = element.closest('.album-art-container');
        if (container) container.classList.remove('has-album-art');

        const img = new Image();
        
        img.onload = () => {
            element.src = src;
            element.classList.remove('hidden');
            if (container) {
                container.classList.add('has-album-art');
                element.style.opacity = '0';
                element.offsetHeight; // Trigger reflow
                element.style.opacity = '1';
                
                setTimeout(() => {
                    element.style.willChange = 'opacity';
                    element.style.transform = 'translateZ(0)';
                    container.style.willChange = 'opacity';
                    container.style.transform = 'translateZ(0)';
                }, 0);
            }
        };
        
        img.onerror = () => {
            element.classList.add('hidden');
            if (container) container.classList.remove('has-album-art');
        };
        
        img.src = src;
    }

    hideAlbumArt(element) {
        if (element) {
            element.classList.add('hidden');
            const container = element.closest('.album-art-container');
            if (container) {
                container.classList.remove('has-album-art');
                // Force reflow to ensure proper rendering
                element.offsetHeight;
            }
        }
    }

    togglePlayPause() {
        if (this.audioElement.paused) {
            this.audioElement.play();
        } else {
            this.audioElement.pause();
        }
    }

    playPrevious() {
        if (this.currentIndex > 0) {
            this.playSong(this.currentIndex - 1);
        }
    }

    playNext() {
        if (this.currentIndex < this.currentPlaylist.length - 1) {
            this.playSong(this.currentIndex + 1);
        }
    }

    updatePlayButton(isPlaying) {
        if (this.playPauseBtn) {
            const icon = this.playPauseBtn.querySelector('i');
            if (icon) {
                if (isPlaying) {
                    icon.className = 'fas fa-pause';
                } else {
                    icon.className = 'fas fa-play';
                }
            }
        }
        
        if (this.playPauseBtnMobile) {
            const iconMobile = this.playPauseBtnMobile.querySelector('i');
            if (iconMobile) {
                if (isPlaying) {
                    iconMobile.className = 'fas fa-pause';
                } else {
                    iconMobile.className = 'fas fa-play';
                }
            }
        }
        
        if (this.fullscreenPlayPauseBtn) {
            const iconFullscreen = this.fullscreenPlayPauseBtn.querySelector('i');
            if (iconFullscreen) {
                if (isPlaying) {
                    iconFullscreen.className = 'fas fa-pause';
                } else {
                    iconFullscreen.className = 'fas fa-play';
                }
            }
        }
        
        if (this.lyricsPlayPauseBtn) {
            const iconLyrics = this.lyricsPlayPauseBtn.querySelector('i');
            if (iconLyrics) {
                if (isPlaying) {
                    iconLyrics.className = 'fas fa-pause';
                } else {
                    iconLyrics.className = 'fas fa-play';
                }
            }
        }
        
        this.isPlaying = isPlaying;
    }

    updateDuration() {
        const duration = this.audioElement.duration;
        if (!isNaN(duration)) {
            const formattedTime = this.formatTime(duration);
            if (this.duration) this.duration.textContent = formattedTime;
            if (this.durationMobile) this.durationMobile.textContent = formattedTime;
            if (this.fullscreenDuration) this.fullscreenDuration.textContent = formattedTime;
            if (this.lyricsDuration) this.lyricsDuration.textContent = formattedTime;
        }
    }

    updateProgress() {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;

        if (!isNaN(currentTime)) {
            const formattedTime = this.formatTime(currentTime);
            if (this.currentTime) this.currentTime.textContent = formattedTime;
            if (this.currentTimeMobile) this.currentTimeMobile.textContent = formattedTime;
            if (this.fullscreenCurrentTime) this.fullscreenCurrentTime.textContent = formattedTime;
            if (this.lyricsCurrentTime) this.lyricsCurrentTime.textContent = formattedTime;
        }

        if (!isNaN(duration) && duration > 0) {
            const progress = (currentTime / duration) * 100;
            if (this.progressBar) this.progressBar.style.width = `${progress}%`;
            if (this.progressBarMobile) this.progressBarMobile.style.width = `${progress}%`;
            if (this.fullscreenProgressBar) this.fullscreenProgressBar.style.width = `${progress}%`;
            if (this.lyricsProgressBar) this.lyricsProgressBar.style.width = `${progress}%`;
        }
    }

    seekTo(event) {
        const progressContainer = event.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const duration = this.audioElement.duration;

        if (!isNaN(duration)) {
            this.audioElement.currentTime = duration * percentage;
        }
    }

    seekToMobile(event) {
        const progressContainer = event.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const duration = this.audioElement.duration;

        if (!isNaN(duration)) {
            this.audioElement.currentTime = duration * percentage;
        }
    }

    showPlayer() {
        if (this.audioPlayer) this.audioPlayer.classList.remove('hidden');
        
        const mainElement = document.querySelector('main');
        if (mainElement) {
            if (window.innerWidth <= 768) {
                mainElement.style.height = 'calc(100vh - 120px)';
                mainElement.style.paddingBottom = '120px';
            } else {
                mainElement.style.height = 'calc(100vh - 70px)';
                mainElement.style.paddingBottom = '70px';
            }
        }
        
        if (window.innerWidth <= 768) {
            const desktopLayout = document.querySelector('.desktop-player-layout');
            const mobileLayout = document.querySelector('.mobile-player-grid');
            if (desktopLayout) desktopLayout.style.display = 'none';
            if (mobileLayout) mobileLayout.classList.remove('hidden');
        } else {
            const desktopLayout = document.querySelector('.desktop-player-layout');
            const mobileLayout = document.querySelector('.mobile-player-grid');
            if (desktopLayout) desktopLayout.style.display = 'flex';
            if (mobileLayout) mobileLayout.classList.add('hidden');
        }
    }

    hidePlayer() {
        if (this.audioPlayer) this.audioPlayer.classList.add('hidden');
        
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.style.height = 'calc(100vh - 120px)';
            mainElement.style.paddingBottom = '120px';
        }
    }

    showSearchResults() {
        this.searchResults.classList.remove('hidden');
    }

    hideSearchResults() {
        this.searchResults.classList.add('hidden');
    }

    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds) || seconds === undefined || seconds === null) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    moveSearchToNavbar() {
        if (window.innerWidth <= 768) {
            return;
        }
        
        const header = document.querySelector('header');
        
        if (this.compactSearch.classList.contains('hidden')) {
            this.mainSearchSection.style.transform = 'translateY(-30px) scale(0.95)';
            this.mainSearchSection.style.opacity = '0';
            
            setTimeout(() => {
                this.mainSearchSection.style.display = 'none';
                
                this.compactSearch.classList.remove('hidden');
                this.compactSearch.style.transform = 'translateX(50px) scale(0.9)';
                this.compactSearch.style.opacity = '0';
                
                this.compactSearch.offsetHeight;
                
                setTimeout(() => {
                    this.compactSearch.style.transform = 'translateX(0) scale(1)';
                    this.compactSearch.style.opacity = '1';
                    
                    if (header) {
                        header.classList.add('header-with-compact-search');
                    }
                }, 50);
            }, 250);
        }
    }

    restoreMainSearch() {
        const header = document.querySelector('header');
        
        if (!this.compactSearch.classList.contains('hidden')) {
            this.compactSearch.style.transform = 'translateX(50px) scale(0.9)';
            this.compactSearch.style.opacity = '0';
            
            setTimeout(() => {
                this.compactSearch.classList.add('hidden');
                
                this.mainSearchSection.style.display = 'block';
                this.mainSearchSection.style.transform = 'translateY(-30px) scale(0.95)';
                this.mainSearchSection.style.opacity = '0';
                
                this.mainSearchSection.offsetHeight;
                
                setTimeout(() => {
                    this.mainSearchSection.style.transform = 'translateY(0) scale(1)';
                    this.mainSearchSection.style.opacity = '1';
                    
                    if (header) {
                        header.classList.remove('header-with-compact-search');
                    }
                }, 50);
            }, 250);
        }
    }

    async performCompactSearch() {
        const query = this.compactSearchInput.value.trim();
        if (!query) {
            alert('Please enter a search term');
            return;
        }

        this.searchInput.value = query;
        await this.performSearch();
        
        // Scroll to top of search results after compact search
        this.scrollToSearchResultsTop();
    }

    shrinkSearchBar() {
        const searchHeader = document.querySelector('.search-header');
        const searchContent = document.querySelector('.search-content');
        const searchButton = document.querySelector('.search-button');
        const searchButtonText = document.querySelector('.search-button-text');
        
        if (searchHeader) searchHeader.classList.add('hidden');
        if (searchContent) searchContent.classList.add('py-2');
        
        // On mobile, make the button even more compact
        if (window.innerWidth <= 768) {
            if (searchButton) searchButton.classList.remove('px-8', 'py-4', 'px-4', 'py-4');
            if (searchButton) searchButton.classList.add('px-3', 'py-4');
        } else {
            if (searchButton) searchButton.classList.remove('px-8', 'py-4');
            if (searchButton) searchButton.classList.add('px-4', 'py-4');
        }
        
        if (searchButtonText) searchButtonText.classList.add('hidden');
    }
    
    expandSearchBar() {
        const searchHeader = document.querySelector('.search-header');
        const searchContent = document.querySelector('.search-content');
        const searchButton = document.querySelector('.search-button');
        const searchButtonText = document.querySelector('.search-button-text');
        
        if (searchHeader) searchHeader.classList.remove('hidden');
        if (searchContent) searchContent.classList.remove('py-2');
        if (searchButton) searchButton.classList.remove('px-3', 'py-4', 'px-4', 'py-4');
        if (searchButton) searchButton.classList.add('px-8', 'py-4');
        if (searchButtonText) searchButtonText.classList.remove('hidden');
    }

    showPlayerByDefault() {
        if (this.audioPlayer) {
            this.audioPlayer.classList.remove('hidden');
            this.showPlayer();
        }
    }

    // Fullscreen view methods
    showFullscreenNowPlaying() {
        if (this.fullscreenNowPlaying) {
            this.fullscreenNowPlaying.classList.remove('hidden');
        }
        
        // Show/hide mobile fullscreen lyrics button based on lyrics availability and screen size
        if (this.mobileFullscreenLyricsBtn) {
            if (this.currentLyrics.length > 0 && window.innerWidth <= 768) {
                this.mobileFullscreenLyricsBtn.classList.remove('hidden');
            } else {
                this.mobileFullscreenLyricsBtn.classList.add('hidden');
            }
        }
        
        if (window.innerWidth <= 768) {
            if (this.collapseFullscreenBtn) this.collapseFullscreenBtn.classList.remove('hidden');
            if (this.closeFullscreenBtn) this.closeFullscreenBtn.classList.add('hidden');
        } else {
            if (this.collapseFullscreenBtn) this.collapseFullscreenBtn.classList.add('hidden');
            if (this.closeFullscreenBtn) this.closeFullscreenBtn.classList.remove('hidden');
        }
        
        document.body.style.overflow = 'hidden';
    }

    hideFullscreenNowPlaying() {
        if (this.fullscreenNowPlaying) {
            this.fullscreenNowPlaying.classList.add('hidden');
        }
        document.body.style.overflow = 'auto';
    }

    seekToFullscreen(event) {
        const progressContainer = event.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const duration = this.audioElement.duration;

        if (!isNaN(duration)) {
            this.audioElement.currentTime = duration * percentage;
        }
    }

    // Lyrics methods
    async fetchLyrics(songName, artist) {
        try {
            const query = `${songName} ${artist}`;
            const apiUrl = `${this.lyricsApiBase}?msg=${encodeURIComponent(query)}&n=1&type=2`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.text();
            this.currentLyricsText = data;
            this.parseLyrics(data);
            this.displayLyrics();
        } catch (error) {
            console.error('Lyrics fetch error:', error);
            // Clear lyrics if fetch fails
            this.currentLyrics = [];
            this.currentLyricsText = '';
            if (this.lyricsList) this.lyricsList.innerHTML = '<div class="text-center text-gray-500 py-8">Lyrics not available</div>';
        }
    }
    
    parseLyrics(lyricsText) {
        this.currentLyrics = [];
        const lines = lyricsText.split('\n');
        
        lines.forEach(line => {
            if (line.match(/^\[(ti|ar|al|by|offset):.*\]$/)) {
                return;
            }
            
            // Match lines that start with timestamp like [00:17.81]
            const timestampMatch = line.match(/^\[(\d{1,2}):(\d{2})\.(\d{2})\](.*)$/);
            if (timestampMatch) {
                const minutes = parseInt(timestampMatch[1]);
                const seconds = parseInt(timestampMatch[2]);
                const centiseconds = parseInt(timestampMatch[3]);
                const text = timestampMatch[4].trim();
                
                if (text.length === 0) {
                    return;
                }
                
                const decodedText = this.decodeHtmlEntities(text);
                
                // Convert to total seconds
                const timeInSeconds = minutes * 60 + seconds + centiseconds / 100;
                
                this.currentLyrics.push({
                    time: timeInSeconds,
                    text: decodedText
                });
            }
        });
        
        // Sort by time just in case
        this.currentLyrics.sort((a, b) => a.time - b.time);
    }
    
    displayLyrics() {
        // Check if lyrics exist
        const hasLyrics = this.currentLyrics.length > 0;
        
        // Show/hide mobile fullscreen lyrics button based on lyrics availability and screen size
        if (this.mobileFullscreenLyricsBtn) {
            if (hasLyrics && window.innerWidth <= 768) {
                this.mobileFullscreenLyricsBtn.classList.remove('hidden');
            } else {
                this.mobileFullscreenLyricsBtn.classList.add('hidden');
            }
        }
        
        // Display lyrics in mobile view (lyricsView)
        if (this.lyricsList) {
            if (!hasLyrics) {
                this.lyricsList.innerHTML = '<div class="text-center text-gray-500 py-8">Lyrics not available</div>';
            } else {
                this.lyricsList.innerHTML = '';
                this.currentLyrics.forEach((lyric, index) => {
                    const lyricElement = document.createElement('div');
                    lyricElement.className = 'lyric-line py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100';
                    lyricElement.dataset.time = lyric.time;
                    lyricElement.textContent = lyric.text;
                    lyricElement.addEventListener('click', () => this.seekToLyricTime(lyric.time));
                    this.lyricsList.appendChild(lyricElement);
                });
            }
        }
        
        // Display lyrics in fullscreen view (always show container on desktop when lyrics exist)
        if (this.fullscreenLyricsList) {
            if (!hasLyrics) {
                this.fullscreenLyricsList.innerHTML = '<div class="text-center text-gray-500 py-8">Lyrics not available</div>';
            } else {
                this.fullscreenLyricsList.innerHTML = '';
                this.currentLyrics.forEach((lyric, index) => {
                    const lyricElement = document.createElement('div');
                    lyricElement.className = 'lyric-line py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100';
                    lyricElement.dataset.time = lyric.time;
                    lyricElement.textContent = lyric.text;
                    lyricElement.addEventListener('click', () => this.seekToLyricTime(lyric.time));
                    this.fullscreenLyricsList.appendChild(lyricElement);
                });
            }
        }
    }
    
    updateLyricsHighlight() {
        if (this.currentLyrics.length === 0) return;
        
        const currentTime = this.audioElement.currentTime;
        
        // Update mobile lyrics
        if (this.lyricsList) {
            const lyricLines = this.lyricsList.querySelectorAll('.lyric-line');
            
            // Set all lines to dimmed color initially
            lyricLines.forEach((line, index) => {
                line.classList.remove('text-3xl', 'text-gray-900');
                line.classList.add('text-gray-400'); // More dimmed color
                line.style.transform = 'scale(1)';
                line.style.transformOrigin = 'center'; // Center transform origin for mobile
            });
            
            // Find and highlight the current lyric line
            let currentLyricIndex = -1;
            for (let i = this.currentLyrics.length - 1; i >= 0; i--) {
                if (currentTime >= this.currentLyrics[i].time) {
                    currentLyricIndex = i;
                    break;
                }
            }
            
            // Highlight the current lyric line with larger size and default text color
            if (currentLyricIndex >= 0 && lyricLines[currentLyricIndex]) {
                const currentLine = lyricLines[currentLyricIndex];
                currentLine.classList.remove('text-gray-400');
                currentLine.classList.add('text-gray-900');
                currentLine.style.transform = 'scale(1.2)';
                currentLine.style.transformOrigin = 'center'; // Center transform origin for mobile
                
                if (!this.isUserScrolling) {
                    currentLine.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }
        
        // Update fullscreen lyrics
        if (this.fullscreenLyricsList) {
            const lyricLines = this.fullscreenLyricsList.querySelectorAll('.lyric-line');
            
            // Set all lines to dimmed color initially
            lyricLines.forEach((line, index) => {
                line.classList.remove('text-3xl', 'text-gray-900');
                line.classList.add('text-gray-400'); // More dimmed color
                line.style.transform = 'scale(1)';
                line.style.transformOrigin = 'center'; // Center transform origin for desktop
            });
            
            // Find and highlight the current lyric line
            let currentLyricIndex = -1;
            for (let i = this.currentLyrics.length - 1; i >= 0; i--) {
                if (currentTime >= this.currentLyrics[i].time) {
                    currentLyricIndex = i;
                    break;
                }
            }
            
            // Highlight the current lyric line with larger size and default text color
            if (currentLyricIndex >= 0 && lyricLines[currentLyricIndex]) {
                const currentLine = lyricLines[currentLyricIndex];
                currentLine.classList.remove('text-gray-400');
                currentLine.classList.add('text-gray-900');
                currentLine.style.transform = 'scale(1.2)';
                currentLine.style.transformOrigin = 'center'; // Center transform origin for desktop
                
                // Only scroll to the active lyric if user is not scrolling
                if (!this.isUserScrolling) {
                    currentLine.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }
    }
    
    showLyricsView() {
        if (this.lyricsView) {
            this.lyricsView.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Update lyrics view with current song info
            if (this.lyricsSongTitle) {
                const title = (this.currentSongData && this.currentSongData.songname) || 
                             (this.currentSongData && this.currentSongData.title) || 
                             'Unknown Title';
                this.lyricsSongTitle.textContent = title;
            }
            if (this.lyricsSongArtist) {
                const artist = (this.currentSongData && this.currentSongData.singer) || 
                              (this.currentSongData && this.currentSongData.artist) || 
                              'Unknown Artist';
                this.lyricsSongArtist.textContent = artist;
            }
            
            // Update album art
            if (this.lyricsAlbumArt && this.currentSongData && this.currentSongData.cover) {
                const transformedCoverUrl = this.transformKuWoCoverUrl(this.currentSongData.cover);
                this.preloadAndSetAlbumArt(this.lyricsAlbumArt, transformedCoverUrl);
            } else if (this.lyricsAlbumArt) {
                this.hideAlbumArt(this.lyricsAlbumArt);
            }
            
            // Update duration
            if (this.lyricsDuration && this.audioElement && !isNaN(this.audioElement.duration)) {
                this.lyricsDuration.textContent = this.formatTime(this.audioElement.duration);
            }
        }
    }
    
    hideLyricsView() {
        if (this.lyricsView) {
            this.lyricsView.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
    
    seekToLyrics(event) {
        const progressContainer = event.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const duration = this.audioElement.duration;
        
        if (!isNaN(duration)) {
            this.audioElement.currentTime = duration * percentage;
        }
    }
    
    seekToLyricTime(time) {
        if (this.audioElement && !isNaN(time)) {
            this.audioElement.currentTime = time;
        }
    }
    
    handleLyricsScroll() {
        this.handleLyricsInteraction();
    }
    
    handleLyricsInteraction() {
        this.isUserScrolling = true;
        
        if (this.lyricsScrollTimeout) {
            clearTimeout(this.lyricsScrollTimeout);
        }
        
        this.lyricsScrollTimeout = setTimeout(() => {
            this.isUserScrolling = false;
        }, 5000);
    }
    
    downloadLyrics() {
        if (!this.currentLyricsText) {
            alert('No lyrics available for download');
            return;
        }
        
        try {
            const song = this.currentPlaylist[this.currentIndex];
            const artist = (song && song.singer) || 'Unknown Artist';
            const title = (song && song.songname) || 'Unknown Title';
            const fileName = `${artist} - ${title} (Lyrics).txt`;
            
            const blob = new Blob([this.currentLyricsText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.target = '_blank';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Lyrics download error:', error);
            alert('Failed to download lyrics. Please try again.');
        }
    }
    
    async showDownloadModal() {
        if (this.downloadModal) {
            this.downloadModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            if (this.download24Bit) this.download24Bit.classList.add('hidden');
            
            if (this.currentSongData && this.currentSongData.has24Bit && this.currentSongData.musicUrl24Bit) {
                if (this.download24Bit) {
                    this.download24Bit.classList.remove('hidden');
                    const artist = this.currentSongData.singer || 'Unknown Artist';
                    const title = this.currentSongData.songname || 'Unknown Title';
                    const fileName = `${artist} - ${title} (24Bit).flac`;
                    this.download24Bit.href = this.currentSongData.musicUrl24Bit;
                    this.download24Bit.download = fileName;
                    this.download24Bit.target = '_blank';
                }
            } else {
                await this.check24BitAvailability();
            }
        }
    }
    
    async check24BitAvailability() {
        if (this.currentSongData && this.currentSongData.has24Bit) {
            if (this.currentSongData.musicUrl24Bit) {
                if (this.download24Bit) {
                    this.download24Bit.classList.remove('hidden');
                    const artist = this.currentSongData.singer || 'Unknown Artist';
                    const title = this.currentSongData.songname || 'Unknown Title';
                    const fileName = `${artist} - ${title} (24Bit).flac`;
                    this.download24Bit.href = this.currentSongData.musicUrl24Bit;
                    this.download24Bit.download = fileName;
                    this.download24Bit.target = '_blank';
                }
            } else {
                if (this.download24Bit) this.download24Bit.classList.add('hidden');
            }
            return;
        }
        
        if (this.currentIndex < 0 || this.currentIndex >= this.currentPlaylist.length) {
            if (this.download24Bit) this.download24Bit.classList.add('hidden');
            return;
        }

        const song = this.currentPlaylist[this.currentIndex];
        const songName = song.songname || '';
        const songArtist = song.singer || '';
        
        if (!songName || !songArtist) {
            if (this.download24Bit) this.download24Bit.classList.add('hidden');
            return;
        }

        try {
            const query = `${songName} ${songArtist}`;
            
            const apiUrl = `${this.api24BitBase}?msg=${encodeURIComponent(query)}&n=1&type=json`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data) {
                if (this.download24Bit) this.download24Bit.classList.add('hidden');
                return;
            }
            
            if (data.code === 200 && data.title && data.singer && data.quality) {
                const track = data;
                
                const normalizeString = (str) => {
                    if (typeof str !== 'string') return '';
                    return str.trim().toLowerCase().replace(/\s+/g, ' ');
                };
                
                const removeBrackets = (str) => {
                    if (typeof str !== 'string') return '';
                    return str.replace(/\[.*?\]|\(.*?\)|{.*?}|\（.*?\）|\【.*?\】/g, '').trim();
                };
                
                const normalizedSongName = normalizeString(removeBrackets(songName));
                const normalizedTrackTitle = normalizeString(removeBrackets(track.title));
                const normalizedSongArtist = normalizeString(removeBrackets(songArtist));
                const normalizedTrackSinger = normalizeString(removeBrackets(track.singer));
                const normalizedQuality = normalizeString("24bit至臻");
                const normalizedTrackQuality = normalizeString(track.quality);
                
                const titleMatch = normalizedSongName === normalizedTrackTitle;
                const singerMatch = normalizedSongArtist === normalizedTrackSinger;
                const qualityMatch = normalizedQuality === normalizedTrackQuality;
                
                if (titleMatch && singerMatch && qualityMatch) {
                    if (this.download24Bit) {
                        this.download24Bit.classList.remove('hidden');
                        if (track.music_url) {
                            const artist = song.singer || 'Unknown Artist';
                            const title = song.songname || 'Unknown Title';
                            const fileName = `${artist} - ${title} (24Bit).flac`;
                            this.download24Bit.href = track.music_url;
                            this.download24Bit.download = fileName;
                            this.download24Bit.target = '_blank';
                        }
                    }
                    return;
                } else if (qualityMatch) {
                    if (this.download24Bit) {
                        this.download24Bit.classList.remove('hidden');
                        if (track.music_url) {
                            const artist = song.singer || 'Unknown Artist';
                            const title = song.songname || 'Unknown Title';
                            const fileName = `${artist} - ${title} (24Bit).flac`;
                            this.download24Bit.href = track.music_url;
                            this.download24Bit.download = fileName;
                            this.download24Bit.target = '_blank';
                        }
                    }
                    return;
                }
            }
            
            if (this.download24Bit) this.download24Bit.classList.add('hidden');
        } catch (error) {
            if (this.download24Bit) this.download24Bit.classList.add('hidden');
        }
    }
    
    hideDownloadModal() {
        if (this.downloadModal) {
            this.downloadModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
    
    async prepareDownloadForSong(song, index) {
        const originalCurrentIndex = this.currentIndex;
        const originalCurrentSongData = this.currentSongData;
        const originalCurrentPlaylist = this.currentPlaylist;
        
        this.currentIndex = index;
        this.currentSongData = { 
            songname: song.songname, 
            singer: song.singer, 
            n: song.n,
            ...song
        };
        
        if (!this.currentPlaylist.includes(song)) {
            this.currentPlaylist = [...this.currentPlaylist];
            if (this.currentPlaylist.length === 0) {
                this.currentPlaylist = [song];
                this.currentIndex = 0;
            }
        }
        
        try {
            await this.showDownloadModal();
        } finally {
            if (originalCurrentIndex === -1) {
                this.currentIndex = originalCurrentIndex;
                this.currentSongData = originalCurrentSongData;
                this.currentPlaylist = originalCurrentPlaylist;
            }
        }
    }

    async prepareAndDownload(format) {
        if (this.currentIndex < 0 || this.currentIndex >= this.currentPlaylist.length) {
            alert('No song selected for download');
            return;
        }

        const song = this.currentPlaylist[this.currentIndex];
        const songId = song.n;
        
        if (!songId && format !== '24bit') {
            alert('Unable to download song: Missing song ID');
            return;
        }

        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMuzikApp = userAgent.includes('MuzikApp');

        try {
            let downloadDiv;
            if (format === 'mp3') {
                downloadDiv = this.downloadMp3;
            } else if (format === 'flac') {
                downloadDiv = this.downloadFlac;
            } else if (format === '24bit') {
                downloadDiv = this.download24Bit;
            } else {
                alert('Unsupported format');
                return;
            }
            
            const originalHtml = downloadDiv.innerHTML;
            downloadDiv.innerHTML = '<div class="flex items-center space-x-3"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div><span>Preparing download...</span></div>';
            downloadDiv.style.pointerEvents = 'none';

            let downloadUrl;
            let fileName;
            
            if (format === '24bit') {
                const songName = song.songname || 'Unknown Title';
                const songArtist = song.singer || 'Unknown Artist';
                const query = `${songName} ${songArtist}`;
                
                const response = await fetch(`${this.api24BitBase}?msg=${encodeURIComponent(query)}&n=1&type=json`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data && data.code === 200 && data.title && data.singer && data.quality && data.music_url) {
                    const track = data;
                    
                    const normalizeString = (str) => {
                        if (typeof str !== 'string') return '';
                        return str.trim().toLowerCase().replace(/\s+/g, ' ');
                    };
                    
                    const removeBrackets = (str) => {
                        if (typeof str !== 'string') return '';
                        return str.replace(/\[.*?\]|\(.*?\)|{.*?}|\（.*?）|\【.*?】/g, '').trim();
                    };
                    
                    const normalizedSongName = normalizeString(removeBrackets(songName));
                    const normalizedTrackTitle = normalizeString(removeBrackets(track.title));
                    const normalizedSongArtist = normalizeString(removeBrackets(songArtist));
                    const normalizedTrackSinger = normalizeString(removeBrackets(track.singer));
                    const normalizedQuality = normalizeString("24bit至臻");
                    const normalizedTrackQuality = normalizeString(track.quality);
                    
                    const titleMatch = normalizedSongName === normalizedTrackTitle;
                    const singerMatch = normalizedSongArtist === normalizedTrackSinger;
                    const qualityMatch = normalizedQuality === normalizedTrackQuality;
                    const hasMusicUrl = !!track.music_url;
                    
                    if ((titleMatch && singerMatch && qualityMatch && hasMusicUrl) || 
                        (qualityMatch && hasMusicUrl)) {
                        downloadUrl = track.music_url;
                        fileName = `${songArtist} - ${songName} (24Bit).flac`;
                    } else {
                        throw new Error('24-bit track validation failed - mismatch in track data');
                    }
                } else {
                    throw new Error('24-bit track not found in API response or missing required fields');
                }
            } else {
                const br = format === 'flac' ? 1 : 2;
                
                const originalQuery = this.searchInput.value.trim();
                
                let response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=${br}&type=json`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                let data = await response.json();
                
                // Keep resending request until flac_url contains "trackmedia" or we've tried 3 times
                let retryCount = 0;
                const maxRetries = 5;
                while (data && data.flac_url && !data.flac_url.includes('trackmedia') && retryCount < maxRetries) {
                    console.log('Ad Detected; resending request');
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                    response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=${br}&type=json`);
                    data = await response.json();
                }
                
                if (retryCount >= maxRetries && data && data.flac_url && !data.flac_url.includes('trackmedia')) {
                    throw new Error('Download failed, try again later');
                }
                
                if (format === 'flac') {
                    downloadUrl = data.flac_url;
                } else {
                    downloadUrl = data.mp3_url || data.flac_url;
                }
                
                if (!downloadUrl) {
                    throw new Error('Download URL not found in API response');
                }
                
                const artist = song.singer || 'Unknown Artist';
                const title = song.songname || 'Unknown Title';
                fileName = `${artist} - ${title}.${format}`;
            }
            
            if (!downloadUrl) {
                throw new Error('Download URL not found');
            }
            
            if (isMuzikApp) {
                const jsonData = {
                    title: song.songname || 'Unknown Title',
                    artist: song.singer || 'Unknown Artist',
                    albumArt: this.transformKuWoCoverUrl(song.cover || this.currentSongCover || ''),
                    downloadUrl: downloadUrl,
                    format: format
                };
                
                const jsonContent = JSON.stringify(jsonData, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonContent);
                
                const link = document.createElement('a');
                link.href = dataUri;
                link.download = `${song.singer || 'Unknown Artist'} - ${song.songname || 'Unknown Title'}.json`;
                link.target = '_blank';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = fileName || `song.${format}`;
                link.target = '_blank';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            this.hideDownloadModal();
            
            this.showDownloadNotification(`Download Started: ${fileName || 'song'}`);
            
        } catch (error) {
            this.showDownloadNotification(`Download Failed: ${error.message}`);
        } finally {
            setTimeout(() => {
                let downloadDiv;
                if (format === 'mp3') {
                    downloadDiv = this.downloadMp3;
                } else if (format === 'flac') {
                    downloadDiv = this.downloadFlac;
                } else if (format === '24bit') {
                    downloadDiv = this.download24Bit;
                }
                
                if (downloadDiv) {
                    downloadDiv.style.pointerEvents = 'auto';
                    if (format === 'mp3') {
                        downloadDiv.innerHTML = '<div class="flex items-center space-x-3"><i class="fas fa-music text-lg text-gray-700"></i><div class="text-left"><div class="font-semibold">MP3 (Lossy)</div><div class="text-sm text-gray-600">Smaller file size, good quality</div></div></div><i class="fas fa-download text-gray-600"></i>';
                    } else if (format === 'flac') {
                        downloadDiv.innerHTML = '<div class="flex items-center space-x-3"><i class="fas fa-compact-disc text-lg text-gray-700"></i><div class="text-left"><div class="font-semibold">FLAC (Lossless)</div><div class="text-sm text-gray-600">Larger file size, best quality</div></div></div><i class="fas fa-download text-gray-600"></i>';
                    } else if (format === '24bit') {
                        downloadDiv.innerHTML = '<div class="flex items-center space-x-3"><i class="fas fa-crown text-lg text-yellow-500"></i><div class="text-left"><div class="font-semibold">24Bit 至臻无损</div><div class="text-sm text-gray-600">最高品质音频</div></div></div><i class="fas fa-download text-gray-600"></i>';
                    }
                }
            }, 1000);
        }
    }
    
    async checkAPIStatus() {
        this.updateAPIStatusDisplay('checking');
        
        // Check all APIs concurrently
        const checks = await Promise.allSettled([
            this.checkMusicAPI(),
            this.checkLyricsAPI()
        ]);
        
        this.apiStatus.music = checks[0].status === 'fulfilled' && checks[0].value;
        this.apiStatus.lyrics = checks[1].status === 'fulfilled' && checks[1].value;
        
        this.updateAPIStatusDisplay('complete');
    }
    
    async checkMusicAPI() {
        try {
            const response = await fetch(`${this.apiBase}?msg=test&num=1&br=1&type=json`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    async checkLyricsAPI() {
        try {
            const response = await fetch(`${this.lyricsApiBase}?msg=test&n=1&type=2`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    
    updateAPIStatusDisplay(state) {
        if (!this.apiStatusChip || !this.apiStatusDot || !this.apiStatusText) return;
        
        if (state === 'checking') {
            this.apiStatusChip.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-yellow-100 text-yellow-800';
            this.apiStatusDot.className = 'w-2 h-2 rounded-full bg-yellow-500 animate-pulse';
            this.apiStatusText.textContent = 'Checking APIs...';
        } else if (state === 'complete') {
            const onlineCount = Object.values(this.apiStatus).filter(status => status).length;
            const totalCount = Object.keys(this.apiStatus).length;
            
            if (onlineCount === totalCount) {
                this.apiStatusChip.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-green-100 text-green-800';
                this.apiStatusDot.className = 'w-2 h-2 rounded-full bg-green-500';
            } else if (onlineCount > 0) {
                this.apiStatusChip.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-yellow-100 text-yellow-800';
                this.apiStatusDot.className = 'w-2 h-2 rounded-full bg-yellow-500';
            } else {
                this.apiStatusChip.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-red-100 text-red-800';
                this.apiStatusDot.className = 'w-2 h-2 rounded-full bg-red-500';
            }
            
            this.apiStatusText.textContent = `${onlineCount}/${totalCount} APIs Online`;
        }
    }
    
    showDownloadNotification(message = 'Download Started!') {
        if (!this.downloadNotification || !this.downloadNotificationText) return;
        
        this.downloadNotificationText.textContent = message;
        this.downloadNotification.classList.remove('hidden');
        
        setTimeout(() => {
            this.downloadNotification.classList.remove('translate-x-full');
            this.downloadNotification.classList.add('translate-x-0');
        }, 10);
        
        setTimeout(() => {
            this.downloadNotification.classList.remove('translate-x-0');
            this.downloadNotification.classList.add('translate-x-full');
            
            setTimeout(() => {
                this.downloadNotification.classList.add('hidden');
            }, 300);
        }, 10000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const player = new MuzikPlayer();
    
    window.addEventListener('resize', () => {
        if (player.audioPlayer && !player.audioPlayer.classList.contains('hidden')) {
            player.showPlayer();
        }
        
        // Update fullscreen view layout on resize
        if (player.fullscreenNowPlaying && !player.fullscreenNowPlaying.classList.contains('hidden')) {
            if (window.innerWidth <= 768) {
                if (player.collapseFullscreenBtn) player.collapseFullscreenBtn.classList.remove('hidden');
                if (player.closeFullscreenBtn) player.closeFullscreenBtn.classList.add('hidden');
            } else {
                if (player.collapseFullscreenBtn) player.collapseFullscreenBtn.classList.add('hidden');
                if (player.closeFullscreenBtn) player.closeFullscreenBtn.classList.remove('hidden');
            }
            
            // Update mobile fullscreen lyrics button visibility on resize
            if (player.mobileFullscreenLyricsBtn) {
                if (player.currentLyrics.length > 0 && window.innerWidth <= 768) {
                    player.mobileFullscreenLyricsBtn.classList.remove('hidden');
                } else {
                    player.mobileFullscreenLyricsBtn.classList.add('hidden');
                }
            }
        }
    });
});