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
                image: 'images/album_arts/Aley_ma.jpg'
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

        // Hovering effects 

        // Enhanced hover effects for singer portfolio site
        document.addEventListener('DOMContentLoaded', function() {
            
            // Track cards hover effects with music-themed animations
            function initTrackHoverEffects() {
                const trackCards = document.querySelectorAll('.track-card, .music-card, .song-item');
                
                trackCards.forEach(card => {
                    // Create floating musical notes
                    const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];
                    
                    card.addEventListener('mouseenter', function(e) {
                        // Scale and glow effect - no position change
                        this.style.transform = 'scale(1.02)';
                        this.style.boxShadow = '0 15px 35px rgba(255, 107, 107, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)';
                        this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        
                        // Add background glow
                        this.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(74, 144, 226, 0.1))';
                        
                        // Create floating musical notes
                        createFloatingNotes(this, notes);
                        
                        // Pulse album art if exists
                        const albumArt = this.querySelector('img, .album-art, .track-image');
                        if (albumArt) {
                            albumArt.style.transform = 'scale(1.05) rotate(2deg)';
                            albumArt.style.filter = 'brightness(1.1) saturate(1.2)';
                            albumArt.style.transition = 'all 0.3s ease';
                        }
                        
                        // Animate play button - only glow, no position change
                        const playBtn = this.querySelector('.track-play-btn, .play-btn');
                        if (playBtn) {
                            playBtn.style.background = 'rgba(255, 107, 107, 0.8)';
                            playBtn.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.6)';
                            playBtn.style.transform = 'none';
                            playBtn.style.transition = 'background 0.3s ease, box-shadow 0.3s ease';
                        }
                    });
                    
                    card.addEventListener('mouseleave', function(e) {
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                        this.style.background = '';
                        
                        // Reset album art
                        const albumArt = this.querySelector('img, .album-art, .track-image');
                        if (albumArt) {
                            albumArt.style.transform = 'scale(1) rotate(0deg)';
                            albumArt.style.filter = 'brightness(1) saturate(1)';
                        }
                        
                        // Reset play button - no transform reset
                        const playBtn = this.querySelector('.track-play-btn, .play-btn');
                        if (playBtn) {
                            playBtn.style.background = '';
                            playBtn.style.boxShadow = '';
                        }
                        
                        // Remove floating notes
                        removeFloatingNotes(this);
                    });
                });
            }
            
            // Navigation hover effects
            function initNavigationHoverEffects() {
                const navLinks = document.querySelectorAll('nav a, .nav-link');
                
                navLinks.forEach(link => {
                    link.addEventListener('mouseenter', function(e) {
                        this.style.transform = 'translateY(-2px)';
                        this.style.textShadow = '0 0 15px rgba(255, 107, 107, 0.8)';
                        this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                        
                        // Create ripple effect
                        createRipple(e, this);
                    });
                    
                    link.addEventListener('mouseleave', function(e) {
                        this.style.transform = 'translateY(0)';
                        this.style.textShadow = 'none';
                    });
                });
            }
            
            // Button hover effects with musical theme - excluding play buttons
            function initButtonHoverEffects() {
                const buttons = document.querySelectorAll('button:not(.track-play-btn):not(.play-btn), .btn:not(.track-play-btn):not(.play-btn), .cta-button');
                
                buttons.forEach(button => {
                    button.addEventListener('mouseenter', function(e) {
                        this.style.transform = 'scale(1.05)';
                        this.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 107, 107, 0.3)';
                        this.style.background = 'linear-gradient(45deg, #ff6b6b, #4a90e2)';
                        this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        
                        // Add pulsing effect
                        this.classList.add('pulse-glow');
                    });
                    
                    button.addEventListener('mouseleave', function(e) {
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = '';
                        this.style.background = '';
                        this.classList.remove('pulse-glow');
                    });
                });
            }
            
            // Album/Image hover effects
            function initImageHoverEffects() {
                const images = document.querySelectorAll('.album-cover, .artist-photo, .gallery-image, .profile-image');
                
                images.forEach(image => {
                    const container = image.parentElement;
                    
                    image.addEventListener('mouseenter', function(e) {
                        this.style.transform = 'scale(1.08) rotate(1deg)';
                        this.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.3)';
                        this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        
                        // Add overlay effect
                        if (container) {
                            const overlay = document.createElement('div');
                            overlay.className = 'hover-overlay';
                            overlay.style.cssText = `
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: linear-gradient(45deg, rgba(255, 107, 107, 0.2), rgba(74, 144, 226, 0.2));
                                opacity: 0;
                                transition: opacity 0.3s ease;
                                pointer-events: none;
                                border-radius: inherit;
                            `;
                            container.style.position = 'relative';
                            container.appendChild(overlay);
                            
                            setTimeout(() => overlay.style.opacity = '1', 10);
                        }
                        
                        // Add vinyl record spinning effect for album covers
                        if (this.classList.contains('album-cover')) {
                            this.style.animation = 'spin 8s linear infinite';
                        }
                    });
                    
                    image.addEventListener('mouseleave', function(e) {
                        this.style.transform = 'scale(1) rotate(0deg)';
                        this.style.filter = 'brightness(1) contrast(1) saturate(1)';
                        this.style.animation = '';
                        
                        // Remove overlay
                        const overlay = container?.querySelector('.hover-overlay');
                        if (overlay) {
                            overlay.style.opacity = '0';
                            setTimeout(() => overlay.remove(), 300);
                        }
                    });
                });
            }
            
            // Text hover effects for headings and important text
            function initTextHoverEffects() {
                const headings = document.querySelectorAll('h1, h2, h3, .title, .artist-name');
                
                headings.forEach(heading => {
                    heading.addEventListener('mouseenter', function(e) {
                        this.style.background = 'linear-gradient(45deg, #ff6b6b, #4a90e2, #ff6b6b)';
                        this.style.backgroundSize = '200% 200%';
                        this.style.backgroundClip = 'text';
                        this.style.webkitBackgroundClip = 'text';
                        this.style.color = 'transparent';
                        this.style.animation = 'gradient-shift 2s ease infinite';
                        this.style.textShadow = '0 0 30px rgba(255, 107, 107, 0.5)';
                        this.style.transform = 'scale(1.02)';
                        this.style.transition = 'all 0.3s ease';
                    });
                    
                    heading.addEventListener('mouseleave', function(e) {
                        this.style.background = '';
                        this.style.backgroundClip = '';
                        this.style.webkitBackgroundClip = '';
                        this.style.color = '';
                        this.style.animation = '';
                        this.style.textShadow = '';
                        this.style.transform = 'scale(1)';
                    });
                });
            }
            
            // Progress bar hover effects
            function initProgressBarHoverEffects() {
                const progressBars = document.querySelectorAll('.progress-bar, #progressBar');
                
                progressBars.forEach(bar => {
                    bar.addEventListener('mouseenter', function(e) {
                        this.style.height = '8px';
                        this.style.background = 'rgba(255, 255, 255, 0.3)';
                        this.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.5)';
                        this.style.transition = 'all 0.3s ease';
                        
                        const fill = this.querySelector('.progress-fill, #progressFill');
                        if (fill) {
                            fill.style.background = 'linear-gradient(90deg, #ff6b6b, #4a90e2)';
                            fill.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.8)';
                        }
                    });
                    
                    bar.addEventListener('mouseleave', function(e) {
                        this.style.height = '';
                        this.style.background = '';
                        this.style.boxShadow = '';
                        
                        const fill = this.querySelector('.progress-fill, #progressFill');
                        if (fill) {
                            fill.style.background = '';
                            fill.style.boxShadow = '';
                        }
                    });
                });
            }
            
            // Global player hover effects
            function initGlobalPlayerHoverEffects() {
                const globalPlayer = document.querySelector('#globalPlayer, .global-player');
                
                if (globalPlayer) {
                    globalPlayer.addEventListener('mouseenter', function(e) {
                        this.style.transform = 'translateY(0px) scale(1.02)';
                        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 107, 107, 0.2)';
                        this.style.background = 'rgba(255, 255, 255, 0.15)';
                        this.style.backdropFilter = 'blur(20px)';
                        this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        
                        // Animate player controls
                        const controls = this.querySelectorAll('button, .control');
                        controls.forEach(control => {
                            control.style.transform = 'scale(1.1)';
                            control.style.transition = 'transform 0.2s ease';
                        });
                    });
                    
                    globalPlayer.addEventListener('mouseleave', function(e) {
                        this.style.transform = 'translateY(0) scale(1)';
                        this.style.boxShadow = '';
                        this.style.background = '';
                        this.style.backdropFilter = '';
                        
                        const controls = this.querySelectorAll('button, .control');
                        controls.forEach(control => {
                            control.style.transform = 'scale(1)';
                        });
                    });
                }
            }
            
            // Helper function to create floating musical notes
            function createFloatingNotes(element, notes) {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const note = document.createElement('span');
                        note.textContent = notes[Math.floor(Math.random() * notes.length)];
                        note.className = 'floating-note';
                        note.style.cssText = `
                            position: absolute;
                            top: ${Math.random() * 100}%;
                            left: ${Math.random() * 100}%;
                            color: rgba(255, 107, 107, 0.7);
                            font-size: 18px;
                            pointer-events: none;
                            z-index: 1000;
                            animation: float-up 2s ease-out forwards;
                        `;
                        
                        element.style.position = 'relative';
                        element.appendChild(note);
                        
                        setTimeout(() => note.remove(), 2000);
                    }, i * 200);
                }
            }
            
            // Helper function to remove floating notes
            function removeFloatingNotes(element) {
                const notes = element.querySelectorAll('.floating-note');
                notes.forEach(note => note.remove());
            }
            
            // Helper function to create ripple effect
            function createRipple(e, element) {
                const ripple = document.createElement('span');
                const rect = element.getBoundingClientRect();
                const size = 60;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 107, 107, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                element.style.position = 'relative';
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
            
            // Add CSS animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes float-up {
                    0% {
                        transform: translateY(0) scale(1) rotate(0deg);
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateY(-50px) scale(0.5) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                @keyframes gradient-shift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                @keyframes spin {
                    from {
                        transform: scale(1.08) rotate(1deg);
                    }
                    to {
                        transform: scale(1.08) rotate(361deg);
                    }
                }
                
                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 107, 107, 0.3);
                    }
                    50% {
                        box-shadow: 0 15px 35px rgba(255, 107, 107, 0.6), 0 0 30px rgba(255, 107, 107, 0.5);
                    }
                }
                
                .pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                
                /* Smooth transitions for all interactive elements */
                * {
                    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                            box-shadow 0.3s ease,
                            background 0.3s ease,
                            filter 0.3s ease;
                }
                
                /* Enhanced cursor styles */
                .track-card, .music-card, .song-item,
                button, .btn, .cta-button,
                nav a, .nav-link {
                    cursor: pointer;
                }
                
                .track-card:hover, .music-card:hover, .song-item:hover {
                    cursor: pointer;
                }
                
                /* Smooth scrollbar */
                ::-webkit-scrollbar {
                    width: 3px
                
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #ff6b6b, #4a90e2);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, #ff5252, #2196f3);
                }
            `;
            document.head.appendChild(style);
            
            // Initialize all hover effects
            initTrackHoverEffects();
            initNavigationHoverEffects();
            initButtonHoverEffects();
            initImageHoverEffects();
            initTextHoverEffects();
            initProgressBarHoverEffects();
            initGlobalPlayerHoverEffects();
            
            // Add subtle parallax effect on mouse move
            document.addEventListener('mousemove', function(e) {
                const mouseX = (e.clientX / window.innerWidth) * 100;
                const mouseY = (e.clientY / window.innerHeight) * 100;
                
                // Apply parallax to background elements
                const bgElements = document.querySelectorAll('.background-element, .hero-bg');
                bgElements.forEach(el => {
                    const speed = 0.5;
                    el.style.transform = `translate(${(mouseX - 50) * speed * 0.1}px, ${(mouseY - 50) * speed * 0.1}px)`;
                });
            });
            
            // Enhanced focus effects for accessibility
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', function() {
                document.body.classList.remove('keyboard-navigation');
            });
            
            console.log('🎵 Singer portfolio hover effects initialized!');
        });

        // Add smooth page transitions
        window.addEventListener('beforeunload', function() {
            document.body.style.opacity = '0';
            document.body.style.transform = 'scale(0.95)';
        });
