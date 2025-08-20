// Music Player Elements
        const audioPlayer = document.getElementById('audioPlayer');
        const globalPlayer = document.getElementById('globalPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        const currentTimeSpan = document.getElementById('currentTime');
        const totalTimeSpan = document.getElementById('totalTime');
        const playerTitle = document.getElementById('playerTitle');
        const playerArtist = document.getElementById('playerArtist');
        const playerThumbnail = document.getElementById('playerThumbnail');
        const heroPlayBtn = document.getElementById('heroPlayBtn');
        const heroTrackInfo = document.getElementById('heroTrackInfo');
        const heroTrackTitle = document.getElementById('heroTrackTitle');
        const volumeBtn = document.getElementById('volumeBtn');
        const volumeOnIcon = document.getElementById('volumeOnIcon');
        const volumeOffIcon = document.getElementById('volumeOffIcon');

        // Track data with actual MP3 file names
        const tracks = {
            'Hathpethi_Mal': {
                src: 'music/Hathpethi Mal.mp3',
                title: 'Hathpethi Mal',
                artist: 'Iman Fernando',
                symbol: '♪',
                image: 'images/album_arts/Hathpethi_Mal.jpg'
            },
            'Paalu_Yaame': {
                src: 'music/Paalu_yaame.mp3',
                title: 'Paalu Yaame',
                artist: 'Iman Fernando',
                symbol: '☀',
                image: 'images/album_arts/Paalu_Yaame.jpeg'
            },
            'Hangannada_Adare': {
                src: 'music/Hangannada_adare.mp3',
                title: 'Hangannada Adare',
                artist: 'Iman Fernando',
                symbol: '∿',
                image: 'images/album_arts/Hangannada_Adare.jpeg'
            },
            'Ralu_Nethu': {
                src: 'music/Ralu_nethu.mp3',
                title: 'Ralu Nethu',
                artist: 'Iman Fernando',
                symbol: '◆',
                image: 'images/album_arts/Ralu_Nethu.jpg'
            },
            'Ape_kathawa': {
                src: 'music/Ape_kathawa.mp3',
                title: 'Ape Kathawa',
                artist: 'Iman Fernando',
                symbol: '◊',
                image: 'images/album_arts/Apekathawa.jpg'
            },
            'Aley_Ma': {
                src: 'music/Aley_ma.mp3',
                title: 'Aley Ma',
                artist: 'Iman Fernando',
                symbol: '◊',
                image: 'images/album_arts/Aley_Ma.jpg'
            },
            'Chaarikawak': {
                src: 'music/Charikawak.mp3',
                title: 'Charikawak',
                artist: 'Iman Fernando',
                symbol: '◦',
                image: 'images/album_arts/Charikawak.jpg'
            },
        };

        let currentTrack = 'Hathpethi_Mal';
        let isPlaying = false;
        let currentTrackIndex = 0;
        const trackKeys = Object.keys(tracks);
        let demoProgress = 0;
        let demoInterval = null;
        let demoDuration = 222;
        let isInitialized = false;

        // Initialize default track
        function initializePlayer() {
            const track = tracks[currentTrack];
            audioPlayer.src = track.src;
            if (playerTitle) playerTitle.textContent = track.title;
            if (playerArtist) playerArtist.textContent = track.artist;
            if (playerThumbnail) {
                playerThumbnail.innerHTML = `<img src="${track.image}" alt="${track.title}" class="player-art">`;
            }
            if (heroTrackTitle) heroTrackTitle.textContent = track.title;
            if (heroTrackInfo) heroTrackInfo.classList.add('visible');
        }

        // Toggle hero playback
        function toggleHeroPlayback() {
            const heroPlayIcon = document.getElementById('heroPlayIcon');
            const heroPauseIcon = document.getElementById('heroPauseIcon');
            
            if (!isPlaying) {
                playCurrentTrack();
                if (heroPlayIcon) heroPlayIcon.style.display = 'none';
                if (heroPauseIcon) heroPauseIcon.style.display = 'block';
            } else {
                pauseCurrentTrack();
                if (heroPlayIcon) heroPlayIcon.style.display = 'block';
                if (heroPauseIcon) heroPauseIcon.style.display = 'none';
            }
        }

        function playCurrentTrack() {
            // Clear any existing demo interval first
            clearDemoInterval();
            
            audioPlayer.play().then(() => {
                isPlaying = true;
                updatePlayPauseButtons();
                if (globalPlayer) globalPlayer.classList.add('active');
                if (heroPlayBtn) heroPlayBtn.classList.add('playing');
                updateAllTrackButtons();
            }).catch(error => {
                console.log('Audio play failed, using demo mode:', error);
                // Fallback for demo mode
                isPlaying = true;
                updatePlayPauseButtons();
                if (globalPlayer) globalPlayer.classList.add('active');
                if (heroPlayBtn) heroPlayBtn.classList.add('playing');
                simulateProgress();
                updateAllTrackButtons();
            });
        }

        function pauseCurrentTrack() {
            clearDemoInterval();
            audioPlayer.pause();
            isPlaying = false;
            updatePlayPauseButtons();
            if (heroPlayBtn) heroPlayBtn.classList.remove('playing');
            updateAllTrackButtons();
        }

        function clearDemoInterval() {
            if (demoInterval) {
                clearInterval(demoInterval);
                demoInterval = null;
            }
        }

        // Update play/pause button states
        function updatePlayPauseButtons() {
            const heroPlayIcon = document.getElementById('heroPlayIcon');
            const heroPauseIcon = document.getElementById('heroPauseIcon');
            
            if (isPlaying) {
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
                if (heroPlayIcon) heroPlayIcon.style.display = 'none';
                if (heroPauseIcon) heroPauseIcon.style.display = 'block';
            } else {
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (heroPlayIcon) heroPlayIcon.style.display = 'block';
                if (heroPauseIcon) heroPauseIcon.style.display = 'none';
            }
        }

        function updateAllTrackButtons() {
            const trackPlayBtns = document.querySelectorAll('.track-play-btn');
            trackPlayBtns.forEach((btn) => {
                // Get the track ID from the button's onclick attribute
                const onclickAttr = btn.getAttribute('onclick');
                const trackIdMatch = onclickAttr.match(/playTrack\('([^']+)'/);
                const trackId = trackIdMatch ? trackIdMatch[1] : null;
                
                const playIcon = btn.querySelector('.track-play-icon');
                const pauseIcon = btn.querySelector('.track-pause-icon');
                
                if (trackId === currentTrack && isPlaying) {
                    if (playIcon) playIcon.style.display = 'none';
                    if (pauseIcon) pauseIcon.style.display = 'block';
                    btn.classList.add('playing');
                } else {
                    if (playIcon) playIcon.style.display = 'block';
                    if (pauseIcon) pauseIcon.style.display = 'none';
                    btn.classList.remove('playing');
                }
            });
        }

        function playTrack(trackId, title, symbol) {
            const track = tracks[trackId];
            if (!track) return;
            
            // If clicking on the currently playing track, toggle play/pause
            if (currentTrack === trackId && isPlaying) {
                pauseCurrentTrack();
                return;
            }
            
            // Stop current track if playing
            if (isPlaying) {
                pauseCurrentTrack();
            }
            
            // Clear intervals and reset progress
            clearDemoInterval();
            resetProgress();
            
            currentTrack = trackId;
            currentTrackIndex = trackKeys.indexOf(trackId);
            audioPlayer.src = track.src;
            
            // Update player info
            if (playerTitle) playerTitle.textContent = track.title;
            if (playerArtist) playerArtist.textContent = track.artist;
            if (playerThumbnail) {
                playerThumbnail.innerHTML = `<img src="${track.image}" alt="${track.title}" class="player-art">`;
            }
            if (heroTrackTitle) heroTrackTitle.textContent = track.title;
            
            if (globalPlayer) globalPlayer.classList.add('active');
            if (heroTrackInfo) heroTrackInfo.classList.add('visible');
            
            // Small delay to ensure clean state
            setTimeout(() => {
                playCurrentTrack();
            }, 100);
        }

        function toggleTrackPlayback(trackId, title, symbol) {
            const track = tracks[trackId];
            if (!track) return;
            
            // If clicking on the currently playing track, toggle play/pause
            if (currentTrack === trackId) {
                if (isPlaying) {
                    pauseCurrentTrack();
                } else {
                    playCurrentTrack();
                }
                return;
            }
            
            // Otherwise, play the new track
            playTrack(trackId, title, symbol);
        }

        function resetProgress() {
            demoProgress = 0;
            if (progressFill) progressFill.style.width = '0%';
            if (currentTimeSpan) currentTimeSpan.textContent = '0:00';
            if (totalTimeSpan) totalTimeSpan.textContent = '0:00';
        }

        // Play/Pause toggle for global player
        function togglePlayPause() {
            if (!isPlaying) {
                playCurrentTrack();
            } else {
                pauseCurrentTrack();
            }
        }

        // Format time display
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Update progress bar for real audio
        function updateProgress() {
            if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                if (progressFill) progressFill.style.width = progress + '%';
                if (currentTimeSpan) currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
                if (totalTimeSpan) totalTimeSpan.textContent = formatTime(audioPlayer.duration);
            }
        }

        function simulateProgress() {
            clearDemoInterval();
            
            // Reset and set random duration
            demoProgress = 0;
            demoDuration = Math.floor(Math.random() * 120) + 180; // 3-5 minutes
            
            if (totalTimeSpan) totalTimeSpan.textContent = formatTime(demoDuration);
            if (currentTimeSpan) currentTimeSpan.textContent = '0:00';
            if (progressFill) progressFill.style.width = '0%';
            
            demoInterval = setInterval(() => {
                if (isPlaying) {
                    demoProgress += 1;
                    const progress = (demoProgress / demoDuration) * 100;
                    if (progressFill) progressFill.style.width = Math.min(progress, 100) + '%';
                    if (currentTimeSpan) currentTimeSpan.textContent = formatTime(demoProgress);
                    
                    if (demoProgress >= demoDuration) {
                        clearDemoInterval();
                        isPlaying = false;
                        updatePlayPauseButtons();
                        updateAllTrackButtons();
                        if (heroPlayBtn) heroPlayBtn.classList.remove('playing');
                        
                        // Auto-play next track
                        setTimeout(() => {
                            const nextBtn = document.getElementById('nextBtn');
                            if (nextBtn) nextBtn.click();
                        }, 1000);
                    }
                }
            }, 1000);
        }

        // Mobile menu toggle
        function toggleMenu() {
            const navLinks = document.getElementById('nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
            }
        }

        // Initialize everything when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            if (isInitialized) return;
            isInitialized = true;
            
            initializePlayer();
            
            // Event listeners - only add once
            if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
            
            // Progress bar click handler
            if (progressBar) {
                progressBar.addEventListener('click', (e) => {
                    const rect = progressBar.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    
                    if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
                        audioPlayer.currentTime = percent * audioPlayer.duration;
                    } else {
                        // Demo mode seeking
                        demoProgress = percent * demoDuration;
                        const progress = (demoProgress / demoDuration) * 100;
                        if (progressFill) progressFill.style.width = progress + '%';
                        if (currentTimeSpan) currentTimeSpan.textContent = formatTime(demoProgress);
                    }
                });
            }

            // Audio event listeners
            audioPlayer.addEventListener('timeupdate', updateProgress);
            audioPlayer.addEventListener('loadedmetadata', updateProgress);
            audioPlayer.addEventListener('ended', () => {
                clearDemoInterval();
                isPlaying = false;
                updatePlayPauseButtons();
                updateAllTrackButtons();
                if (heroPlayBtn) heroPlayBtn.classList.remove('playing');
                
                setTimeout(() => {
                    const nextBtn = document.getElementById('nextBtn');
                    if (nextBtn) nextBtn.click();
                }, 1000);
            });

            // Track navigation
            const prevBtn = document.getElementById('prevBtn');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : trackKeys.length - 1;
                    const prevTrackId = trackKeys[currentTrackIndex];
                    const prevTrack = tracks[prevTrackId];
                    playTrack(prevTrackId, prevTrack.title, prevTrack.symbol);
                });
            }

            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentTrackIndex = currentTrackIndex < trackKeys.length - 1 ? currentTrackIndex + 1 : 0;
                    const nextTrackId = trackKeys[currentTrackIndex];
                    const nextTrack = tracks[nextTrackId];
                    playTrack(nextTrackId, nextTrack.title, nextTrack.symbol);
                });
            }

            // Volume control
            if (volumeBtn) {
                volumeBtn.addEventListener('click', () => {
                    audioPlayer.muted = !audioPlayer.muted;
                    if (audioPlayer.muted) {
                        if (volumeOnIcon) volumeOnIcon.style.display = 'none';
                        if (volumeOffIcon) volumeOffIcon.style.display = 'block';
                    } else {
                        if (volumeOnIcon) volumeOnIcon.style.display = 'block';
                        if (volumeOffIcon) volumeOffIcon.style.display = 'none';
                    }
                });
            }

            // Track buttons - onclick handlers will manage play/pause
            const trackButtons = document.querySelectorAll('.track-play-btn');
            trackButtons.forEach((button) => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            // Auto-show global player
            setTimeout(() => {
                if (globalPlayer) {
                    globalPlayer.style.transform = 'translateY(0)';
                }
            }, 2000);
        });

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    const navLinks = document.getElementById('nav-links');
                    if (navLinks) {
                        navLinks.classList.remove('active');
                    }
                }
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Scroll indicator
        window.addEventListener('scroll', () => {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                if (window.scrollY > 100) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navLinks = document.getElementById('nav-links');
            const mobileMenu = document.querySelector('.mobile-menu');
            
            if (navLinks && mobileMenu && 
                !navLinks.contains(event.target) && 
                !mobileMenu.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
                return;
            }
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevBtn = document.getElementById('prevBtn');
                    if (prevBtn) prevBtn.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const nextBtn = document.getElementById('nextBtn');
                    if (nextBtn) nextBtn.click();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    if (volumeBtn) volumeBtn.click();
                    break;
            }
        });

        // Error handling
        audioPlayer.addEventListener('error', function(e) {
            console.log('Audio loading error, continuing with demo mode:', e);
        });

        // Video/audio coordination
        const heroVideo = document.getElementById('heroVideo');
        if (heroVideo) {
            audioPlayer.addEventListener('play', () => {
                heroVideo.muted = true;
            });
        }