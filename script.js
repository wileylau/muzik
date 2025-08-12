class MusicPlayer {
    constructor() {
        this.currentPlaylist = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.apiBase = 'https://hhlqilongzhu.cn/api/dg_kuwomusic.php';
        
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
    }

    bindEvents() {
        if (this.searchBtn) this.searchBtn.addEventListener('click', () => this.performSearch());
        if (this.searchInput) this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        const header = document.querySelector('h1');
        if (header) header.addEventListener('click', () => this.restoreMainSearch());

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
        
        if (isMobile) {
            const downloadBtn = div.querySelector('.download-song-btn');
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentIndex = index;
                this.currentPlaylist = [song];
                this.currentSongData = { songname: song.songname, singer: song.singer, n: song.n };
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
                this.currentSongData = data;
                this.updateCurrentSongInfo(song, data);
                this.updateActiveSong(index);
                this.showPlayer();
                this.audioElement.play();
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
        
        if (playData) {
            this.currentSongCover = playData.cover;
            this.currentSongLink = playData.link;
            this.currentAudioUrl = playData.flac_url;
            
            if (this.currentSongAlbumArt && playData.cover) {
                this.currentSongAlbumArt.src = playData.cover;
                this.currentSongAlbumArt.classList.remove('hidden');
                const container = this.currentSongAlbumArt.closest('.album-art-container');
                if (container) container.classList.add('has-album-art');
            } else if (this.currentSongAlbumArt) {
                this.currentSongAlbumArt.classList.add('hidden');
                const container = this.currentSongAlbumArt.closest('.album-art-container');
                if (container) container.classList.remove('has-album-art');
            }
            
            if (this.currentSongAlbumArtMobile && playData.cover) {
                this.currentSongAlbumArtMobile.src = playData.cover;
                this.currentSongAlbumArtMobile.classList.remove('hidden');
                const container = this.currentSongAlbumArtMobile.closest('.album-art-container');
                if (container) container.classList.add('has-album-art');
            } else if (this.currentSongAlbumArtMobile) {
                this.currentSongAlbumArtMobile.classList.add('hidden');
                const container = this.currentSongAlbumArtMobile.closest('.album-art-container');
                if (container) container.classList.remove('has-album-art');
            }
            
            if (this.fullscreenAlbumArt && playData.cover) {
                this.fullscreenAlbumArt.src = playData.cover;
                this.fullscreenAlbumArt.classList.remove('hidden');
                const container = this.fullscreenAlbumArt.closest('.album-art-container');
                if (container) container.classList.add('has-album-art');
            } else if (this.fullscreenAlbumArt) {
                this.fullscreenAlbumArt.classList.add('hidden');
                const container = this.fullscreenAlbumArt.closest('.album-art-container');
                if (container) container.classList.remove('has-album-art');
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
        
        this.isPlaying = isPlaying;
    }

    updateDuration() {
        const duration = this.audioElement.duration;
        if (!isNaN(duration)) {
            const formattedTime = this.formatTime(duration);
            if (this.duration) this.duration.textContent = formattedTime;
            if (this.durationMobile) this.durationMobile.textContent = formattedTime;
            if (this.fullscreenDuration) this.fullscreenDuration.textContent = formattedTime;
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
        }

        if (!isNaN(duration) && duration > 0) {
            const progress = (currentTime / duration) * 100;
            if (this.progressBar) this.progressBar.style.width = `${progress}%`;
            if (this.progressBarMobile) this.progressBarMobile.style.width = `${progress}%`;
            if (this.fullscreenProgressBar) this.fullscreenProgressBar.style.width = `${progress}%`;
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

    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }

    showSearchResults() {
        this.searchResults.classList.remove('hidden');
    }

    hideSearchResults() {
        this.searchResults.classList.add('hidden');
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
    
    shrinkSearchBar() {
        const searchHeader = document.querySelector('.search-header');
        const searchContent = document.querySelector('.search-content');
        const searchButton = document.querySelector('.search-button');
        const searchButtonText = document.querySelector('.search-button-text');
        
        if (searchHeader) searchHeader.classList.add('hidden');
        if (searchContent) searchContent.classList.add('py-2');
        if (searchButton) searchButton.classList.remove('px-8', 'py-4');
        if (searchButton) searchButton.classList.add('px-4', 'py-4');
        if (searchButtonText) searchButtonText.classList.add('hidden');
    }
    
    expandSearchBar() {
        const searchHeader = document.querySelector('.search-header');
        const searchContent = document.querySelector('.search-content');
        const searchButton = document.querySelector('.search-button');
        const searchButtonText = document.querySelector('.search-button-text');
        
        if (searchHeader) searchHeader.classList.remove('hidden');
        if (searchContent) searchContent.classList.remove('py-2');
        if (searchButton) searchButton.classList.remove('px-4', 'py-4');
        if (searchButton) searchButton.classList.add('px-8', 'py-4');
        if (searchButtonText) searchButtonText.classList.remove('hidden');
    }

    showFullscreenNowPlaying() {
        if (this.fullscreenNowPlaying) {
            this.fullscreenNowPlaying.classList.remove('hidden');
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

    updateFullscreenProgress() {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;

        if (!isNaN(currentTime)) {
            const formattedTime = this.formatTime(currentTime);
            this.fullscreenCurrentTime.textContent = formattedTime;
        }

        if (!isNaN(duration) && duration > 0) {
            const progress = (currentTime / duration) * 100;
            this.fullscreenProgressBar.style.width = `${progress}%`;
        }
    }

    updateFullscreenDuration() {
        const duration = this.audioElement.duration;
        if (!isNaN(duration)) {
            const formattedTime = this.formatTime(duration);
            this.fullscreenDuration.textContent = formattedTime;
        }
    }

    updateFullscreenSongInfo() {
        if (this.currentSongData) {
            const title = this.currentSongData.songname || 'Unknown Title';
            const artist = this.currentSongData.singer || 'Unknown Artist';
            
            this.fullscreenSongTitle.textContent = title;
            this.fullscreenSongArtist.textContent = artist;
            
            if (this.currentSongData.cover) {
                this.fullscreenAlbumArt.src = this.currentSongData.cover;
                this.fullscreenAlbumArt.classList.remove('hidden');
                const container = this.fullscreenAlbumArt.closest('.album-art-container');
                if (container) container.classList.add('has-album-art');
            } else {
                this.fullscreenAlbumArt.classList.add('hidden');
                const container = this.fullscreenAlbumArt.closest('.album-art-container');
                if (container) container.classList.remove('has-album-art');
            }
        }
    }

    showPlayerByDefault() {
        if (this.audioPlayer) {
            this.audioPlayer.classList.remove('hidden');
            this.showPlayer();
        }
    }
    
    shrinkSearchBar() {
        const searchHeader = document.querySelector('.search-header');
        const searchContent = document.querySelector('.search-content');
        const searchButton = document.querySelector('.search-button');
        const searchButtonText = document.querySelector('.search-button-text');
        
        if (searchHeader) searchHeader.classList.add('hidden');
        if (searchContent) searchContent.classList.add('py-2');
        
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

    showDownloadModal() {
        if (!this.currentAudioUrl || this.currentIndex === -1) {
            alert('No song is currently playing');
            return;
        }
        if (this.downloadModal) this.downloadModal.classList.remove('hidden');
        this.hideFullscreenNowPlaying();
    }

    hideDownloadModal() {
        if (this.downloadModal) this.downloadModal.classList.add('hidden');
    }

    async downloadSong(format) {
        if (!this.currentSongData || this.currentIndex === -1) {
            alert('No song is currently playing');
            return;
        }

        try {
            const song = this.currentPlaylist[this.currentIndex];
            const songId = song.n;
            const originalQuery = this.searchInput.value.trim();
            let downloadUrl;
            let fileExtension;

            if (format === 'mp3') {
                const response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=2&type=json`);
                const data = await response.json();
                downloadUrl = data.flac_url;
                fileExtension = 'mp3';
            } else {
                const response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=1&type=json`);
                const data = await response.json();
                downloadUrl = data.flac_url;
                fileExtension = 'flac';
            }

            if (!downloadUrl) {
                throw new Error(`No ${format.toUpperCase()} URL found`);
            }

            const artist = song.singer || 'Unknown Artist';
            const title = song.songname || 'Unknown Title';
            const fileName = `${artist} - ${title}.${fileExtension}`;
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.target = '_blank';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.hideDownloadModal();
            
        } catch (error) {
            console.error('Download error:', error);
            alert(`Failed to download ${format.toUpperCase()}. Please try again.`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
    
    window.addEventListener('resize', () => {
        if (player.audioPlayer && !player.audioPlayer.classList.contains('hidden')) {
            player.showPlayer();
        }
    });
});