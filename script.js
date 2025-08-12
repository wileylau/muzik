class MuzikPlayer {
    constructor() {
        this.currentPlaylist = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.apiBase = 'https://hhlqilongzhu.cn/api/dg_kuwomusic.php';
        this.lyricsApiBase = 'https://www.hhlqilongzhu.cn/api/dg_geci.php';
        this.currentLyrics = [];
        this.currentLyricsText = '';
        
        this.initializeElements();
        this.bindEvents();
        this.showPlayerByDefault();
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
        
        if (this.downloadMp3) this.downloadMp3.addEventListener('click', () => this.downloadSong('mp3'));
        if (this.downloadFlac) this.downloadFlac.addEventListener('click', () => this.downloadSong('flac'));
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
                    ${isMobile ? `
                        <button class="download-song-btn w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 flex items-center justify-center" data-index="${index}" title="Download Song">
                            <i class="fas fa-download"></i>
                        </button>
                    ` : ''}
                    <button class="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 flex items-center justify-center play-btn group-hover:bg-gray-200">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add download button event listener for mobile
        if (isMobile) {
            const downloadBtn = div.querySelector('.download-song-btn');
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentIndex = index;
                this.currentPlaylist = [song];
                this.currentSongData = { 
                    songname: song.songname, 
                    singer: song.singer, 
                    n: song.n,
                    ...song
                };
                this.showDownloadModal();
            });
        }

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
            const response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=2&type=json`);
            const data = await response.json();

            if (data && data.flac_url) {
                this.audioElement.src = data.flac_url;
                this.currentAudioUrl = data.flac_url;
                // Preserve song info while adding API data
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
            } else {
                throw new Error('No audio URL found');
            }
        } catch (error) {
            console.error('Play error:', error);
            alert('Failed to play song. Please try another one.');
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
                this.preloadAndSetAlbumArt(this.currentSongAlbumArt, playData.cover);
                this.preloadAndSetAlbumArt(this.currentSongAlbumArtMobile, playData.cover);
                this.preloadAndSetAlbumArt(this.fullscreenAlbumArt, playData.cover);
                this.preloadAndSetAlbumArt(this.lyricsAlbumArt, playData.cover);
            } else {
                this.hideAlbumArt(this.currentSongAlbumArt);
                this.hideAlbumArt(this.currentSongAlbumArtMobile);
                this.hideAlbumArt(this.fullscreenAlbumArt);
                this.hideAlbumArt(this.lyricsAlbumArt);
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
                mainElement.style.height = 'calc(100vh - 80px)';
                mainElement.style.paddingBottom = '80px';
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

    moveSearchToNavbar() {
        if (window.innerWidth <= 768) {
            return;
        }
        
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
                }, 50);
            }, 250);
        }
    }

    restoreMainSearch() {
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
            // Match lines that start with timestamp like [00:17.81]
            const timestampMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/);
            if (timestampMatch) {
                const minutes = parseInt(timestampMatch[1]);
                const seconds = parseInt(timestampMatch[2]);
                const centiseconds = parseInt(timestampMatch[3]);
                const text = timestampMatch[4].trim();
                
                // Convert to total seconds
                const timeInSeconds = minutes * 60 + seconds + centiseconds / 100;
                
                this.currentLyrics.push({
                    time: timeInSeconds,
                    text: text
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
                    lyricElement.className = 'lyric-line py-2 px-4 rounded-lg transition-all duration-200';
                    lyricElement.dataset.time = lyric.time;
                    lyricElement.textContent = lyric.text;
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
                    lyricElement.className = 'lyric-line py-2 px-4 rounded-lg transition-all duration-200';
                    lyricElement.dataset.time = lyric.time;
                    lyricElement.textContent = lyric.text;
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
                
                // Scroll to the active lyric
                currentLine.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
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
                
                // Scroll to the active lyric
                currentLine.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
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
                this.lyricsAlbumArt.src = this.currentSongData.cover;
                this.lyricsAlbumArt.classList.remove('hidden');
                const container = this.lyricsAlbumArt.closest('.album-art-container');
                if (container) container.classList.add('has-album-art');
            } else if (this.lyricsAlbumArt) {
                this.lyricsAlbumArt.classList.add('hidden');
                const container = this.lyricsAlbumArt.closest('.album-art-container');
                if (container) container.classList.remove('has-album-art');
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
    
    showDownloadModal() {
        if (this.downloadModal) {
            this.downloadModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideDownloadModal() {
        if (this.downloadModal) {
            this.downloadModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    async downloadSong(format) {
        if (this.currentIndex < 0 || this.currentIndex >= this.currentPlaylist.length) {
            alert('No song selected for download');
            return;
        }

        const song = this.currentPlaylist[this.currentIndex];
        const songId = song.n;
        
        if (!songId) {
            alert('Unable to download song: Missing song ID');
            return;
        }

        try {
            const downloadBtn = format === 'mp3' ? this.downloadMp3 : this.downloadFlac;
            const originalHtml = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<div class="flex items-center space-x-3"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div><span>Preparing download...</span></div>';
            downloadBtn.disabled = true;

            const br = format === 'flac' ? 1 : 2;
            
            const originalQuery = this.searchInput.value.trim();
            
            const response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=${br}&type=json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            let downloadUrl;
            if (format === 'flac') {
                downloadUrl = data.flac_url;
            } else {
                downloadUrl = data.mp3_url || data.flac_url;
            }
            
            if (!downloadUrl) {
                throw new Error('Download URL not found');
            }
            
            const artist = song.singer || 'Unknown Artist';
            const title = song.songname || 'Unknown Title';
            const fileName = `${artist} - ${title}.${format}`;
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.target = '_blank';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.hideDownloadModal();
            
            alert(`Download started: ${fileName}`);
            
        } catch (error) {
            console.error('Download error:', error);
            alert(`Failed to download song: ${error.message}`);
        } finally {
            setTimeout(() => {
                const downloadBtn = format === 'mp3' ? this.downloadMp3 : this.downloadFlac;
                if (downloadBtn) {
                    downloadBtn.disabled = false;
                    downloadBtn.innerHTML = format === 'mp3' ? 
                        '<div class="flex items-center space-x-3"><i class="fas fa-music text-lg text-gray-700"></i><div class="text-left"><div class="font-semibold">MP3 (Lossy)</div><div class="text-sm text-gray-600">Smaller file size, good quality</div></div></div><i class="fas fa-download text-gray-600"></i>' :
                        '<div class="flex items-center space-x-3"><i class="fas fa-compact-disc text-lg text-gray-700"></i><div class="text-left"><div class="font-semibold">FLAC (Lossless)</div><div class="text-sm text-gray-600">Larger file size, best quality</div></div></div><i class="fas fa-download text-gray-600"></i>';
                }
            }, 1000);
        }
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