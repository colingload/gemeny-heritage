/**
 * Gemeny Heritage — Audio Player
 *
 * Custom audio player for oral history recordings.
 * Provides play/pause, seek, time display, and playback speed controls.
 */

const AudioPlayer = {
  /**
   * Create an audio player element for a given audio source.
   * @param {string} src - Path to audio file
   * @param {string} title - Display title
   * @returns {HTMLElement} The player container element
   */
  create(src, title) {
    const wrapper = document.createElement('div');
    wrapper.className = 'audio-player';
    wrapper.innerHTML = `
      <div class="audio-player-title">${title || 'Audio Recording'}</div>
      <audio preload="metadata">
        <source src="${src}">
        Your browser does not support audio playback.
      </audio>
      <div class="audio-controls">
        <button class="audio-play-btn" aria-label="Play">&#9654;</button>
        <span class="audio-time">0:00 / 0:00</span>
        <input type="range" class="audio-seek" min="0" max="100" value="0" step="0.1">
        <select class="audio-speed">
          <option value="0.75">0.75x</option>
          <option value="1" selected>1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
        </select>
      </div>
    `;

    const audio = wrapper.querySelector('audio');
    const playBtn = wrapper.querySelector('.audio-play-btn');
    const timeDisplay = wrapper.querySelector('.audio-time');
    const seekBar = wrapper.querySelector('.audio-seek');
    const speedSelect = wrapper.querySelector('.audio-speed');

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '&#9646;&#9646;';
      } else {
        audio.pause();
        playBtn.innerHTML = '&#9654;';
      }
    });

    audio.addEventListener('timeupdate', () => {
      const current = this._formatTime(audio.currentTime);
      const total = this._formatTime(audio.duration);
      timeDisplay.textContent = `${current} / ${total}`;
      if (audio.duration) {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
      }
    });

    audio.addEventListener('ended', () => {
      playBtn.innerHTML = '&#9654;';
    });

    seekBar.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
      }
    });

    speedSelect.addEventListener('change', () => {
      audio.playbackRate = parseFloat(speedSelect.value);
    });

    return wrapper;
  },

  _formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};
