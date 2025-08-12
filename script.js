class MusicPlayer {
    constructor() {
        this.currentPlaylist = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.apiBase = 'https://hhlqilongzhu.cn/api/dg_kuwomusic.php';
        
        this.initializeElements();
        this.bindEvents();
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
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.currentTime = document.getElementById('currentTime');
        this.duration = document.getElementById('duration');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.currentSongTitleMobile = document.getElementById('currentSongTitleMobile');
        this.currentSongArtistMobile = document.getElementById('currentSongArtistMobile');
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
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        document.querySelector('h1').addEventListener('click', () => this.restoreMainSearch());

        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.downloadBtn.addEventListener('click', () => this.showDownloadModal());
        
        this.playPauseBtnMobile.addEventListener('click', () => this.togglePlayPause());
        this.prevBtnMobile.addEventListener('click', () => this.playPrevious());
        this.nextBtnMobile.addEventListener('click', () => this.playNext());
        
        this.compactSearchBtn.addEventListener('click', () => this.performCompactSearch());
        this.compactSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performCompactSearch();
            }
        });
        
        this.downloadMp3.addEventListener('click', () => this.downloadSong('mp3'));
        this.downloadFlac.addEventListener('click', () => this.downloadSong('flac'));
        this.cancelDownload.addEventListener('click', () => this.hideDownloadModal());

        this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('ended', () => this.playNext());
        this.audioElement.addEventListener('play', () => this.updatePlayButton(true));
        this.audioElement.addEventListener('pause', () => this.updatePlayButton(false));

        this.progressBar.parentElement.addEventListener('click', (e) => this.seekTo(e));
        this.progressBarMobile.parentElement.addEventListener('click', (e) => this.seekToMobile(e));
        
        this.audioElement.volume = 0.5;
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
        
        // Add download button event listener for mobile
        if (isMobile) {
            const downloadBtn = div.querySelector('.download-song-btn');
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent song from playing
                this.currentIndex = index;
                this.currentPlaylist = [song]; // Set current song for download
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
        
        // Always use the song's n property (1-based) from the API
        const songId = song.n;

        try {
            // Get the actual audio URL using the correct song ID
            // Use the original search query to ensure spaces are properly encoded
            const originalQuery = this.searchInput.value.trim();
            const response = await fetch(`${this.apiBase}?msg=${encodeURIComponent(originalQuery)}&n=${songId}&br=2&type=json`);
            const data = await response.json();

            if (data && data.flac_url) {
                this.audioElement.src = data.flac_url;
                this.currentAudioUrl = data.flac_url;
                this.currentSongData = data; // Store full song data for downloads
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
        // Remove active class from all songs
        const allSongs = document.querySelectorAll('.song-item');
        allSongs.forEach(song => {
            song.classList.remove('active');
            const playBtn = song.querySelector('.play-btn i');
            if (playBtn) {
                playBtn.className = 'fas fa-play';
            }
        });

        // Add active class to current song
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
        
        // Update desktop elements
        this.currentSongTitle.textContent = title;
        this.currentSongArtist.textContent = artist;
        
        // Update mobile elements
        this.currentSongTitleMobile.textContent = title;
        this.currentSongArtistMobile.textContent = artist;
        
        // Store additional info from play response if available
        if (playData) {
            this.currentSongCover = playData.cover;
            this.currentSongLink = playData.link;
            this.currentAudioUrl = playData.flac_url;
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
        const icon = this.playPauseBtn.querySelector('i');
        if (isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
        
        const iconMobile = this.playPauseBtnMobile.querySelector('i');
        if (isPlaying) {
            iconMobile.className = 'fas fa-pause';
        } else {
            iconMobile.className = 'fas fa-play';
        }
        
        this.isPlaying = isPlaying;
    }

    updateDuration() {
        const duration = this.audioElement.duration;
        if (!isNaN(duration)) {
            const formattedTime = this.formatTime(duration);
            this.duration.textContent = formattedTime;
            this.durationMobile.textContent = formattedTime;
        }
    }

    updateProgress() {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;

        if (!isNaN(currentTime)) {
            const formattedTime = this.formatTime(currentTime);
            this.currentTime.textContent = formattedTime;
            this.currentTimeMobile.textContent = formattedTime;
        }

        if (!isNaN(duration) && duration > 0) {
            const progress = (currentTime / duration) * 100;
            this.progressBar.style.width = `${progress}%`;
            this.progressBarMobile.style.width = `${progress}%`;
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
        if (isNaN(seconds)) return '0:00';
        
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
        this.audioPlayer.classList.remove('hidden');
        
        if (window.innerWidth <= 768) {
            document.querySelector('.desktop-player-layout').style.display = 'none';
            document.querySelector('.mobile-player-grid').classList.remove('hidden');
            document.body.style.paddingBottom = '120px';
        } else {
            document.querySelector('.desktop-player-layout').style.display = 'flex';
            document.querySelector('.mobile-player-grid').classList.add('hidden');
            document.body.style.paddingBottom = '80px';
        }
    }

    showDownloadModal() {
        if (!this.currentAudioUrl || this.currentIndex === -1) {
            alert('No song is currently playing');
            return;
        }
        this.downloadModal.classList.remove('hidden');
    }

    hideDownloadModal() {
        this.downloadModal.classList.add('hidden');
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