# Web Music Player

A clean, monochrome web-based music player with Material Design-inspired UI using Tailwind CSS.

## Features

- **Search Functionality**: Search for music using the KuWo Music API
- **Clean UI**: Monochrome, Material Design-inspired interface
- **Audio Controls**: Play, pause, previous, next, volume control, and progress seeking
- **Responsive Design**: Works on desktop and mobile devices
- **Playlist Management**: Browse search results and play songs sequentially

## How to Use

1. **Search for Music**:
   - Enter a search term in the search box
   - Optionally adjust the number of results (10, 20, or 30)
   - Click "Search" or press Enter

2. **Play Music**:
   - Click on any song from the search results to start playing
   - The audio player will appear at the bottom of the screen
   - Use the controls to play/pause, skip tracks, adjust volume, or seek through the song

3. **Player Controls**:
   - **Play/Pause**: Click the center button
   - **Previous/Next**: Use the arrow buttons
   - **Volume**: Adjust the slider on the right
   - **Seek**: Click anywhere on the progress bar to jump to that position

## Technical Details

### API Used
- **KuWo Music API**: `https://hhlqilongzhu.cn/api/dg_kuwomusic.php`
- **Parameters**:
  - `msg`: Search query
  - `n`: Song number to play (based on search results)
  - `num`: Number of search results to return (default: 10)
  - `br`: Audio quality (set to 1 for 16Bit 44.1khz FLAC)

### Technologies
- **HTML5**: Structure and audio element
- **CSS3**: Custom styling and animations
- **JavaScript (ES6+)**: Application logic and API interactions
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Font Awesome**: Icons

### Files Structure
```
├── index.html          # Main HTML file
├── script.js           # JavaScript application logic
├── styles.css          # Custom CSS styles
└── README.md           # This documentation
```

## Setup

1. Clone or download the files
2. Open `index.html` in a web browser
3. Start searching and playing music!

## Browser Compatibility

- Modern browsers with HTML5 audio support
- JavaScript ES6+ support required
- Internet connection required for API access

## Notes

- The player uses a third-party API for music content
- Audio quality is set to high quality FLAC format
- The interface is optimized for both desktop and mobile use
- CORS may need to be handled depending on your browser and server setup

## Responsive Features

- Mobile-friendly design
- Touch-friendly controls
- Adaptive layout for different screen sizes
- Volume control hidden on small screens to save space