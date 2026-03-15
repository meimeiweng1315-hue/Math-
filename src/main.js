async function init() {
    const gamesGrid = document.getElementById('games-grid');
    const searchInput = document.getElementById('search-input');
    const gamePlayer = document.getElementById('game-player');
    const playerContainer = document.getElementById('player-container');
    const gameIframe = document.getElementById('game-iframe');
    const gameTitle = document.getElementById('game-title');
    const closePlayer = document.getElementById('close-player');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const openOriginalBtn = document.getElementById('open-original');
    const aboutTitle = document.getElementById('about-title');
    const aboutText = document.getElementById('about-text');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsSection = document.getElementById('settings-section');
    const aboutBlankBtn = document.getElementById('about-blank-btn');
    const tabCloakBtn = document.getElementById('tab-cloak-btn');
    const logo = document.getElementById('logo');

    let games = [];

    // Load games from JSON
    try {
        // Use absolute URL to ensure it works even when nested in about:blank iframes
        const gamesUrl = new URL('./src/games.json', window.location.href).href;
        const response = await fetch(gamesUrl);
        games = await response.json();
        renderGames(games);
    } catch (error) {
        console.error('Failed to load games:', error);
    }

    function renderGames(gamesToRender) {
        gamesGrid.innerHTML = '';
        if (gamesToRender.length === 0) {
            gamesGrid.innerHTML = `<div class="col-span-full py-20 text-center text-white/40 text-xl">No games found</div>`;
            return;
        }

        gamesToRender.forEach(game => {
            const card = document.createElement('div');
            card.className = 'group relative bg-black rounded-none overflow-hidden border-2 border-cyan-500/30 hover:border-magenta-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(255,0,255,0.2)] neon-border-cyan hover:neon-border-magenta';
            card.innerHTML = `
                <div class="aspect-video overflow-hidden border-b-2 border-cyan-500/30 relative">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100 cyber-pic" referrerpolicy="no-referrer">
                    <div class="cyber-pic-overlay"></div>
                    <div class="cyber-pic-scanlines"></div>
                    <div class="cyber-pic-vignette"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
                </div>
                <div class="p-5 bg-black relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-cyan-500 group-hover:bg-magenta-500 transition-colors"></div>
                    <h3 class="font-display font-black text-xl text-cyan-400 group-hover:text-magenta-400 uppercase tracking-tighter transition-colors neon-text-cyan group-hover:neon-text-magenta">${game.title}</h3>
                    <div class="flex items-center justify-between mt-2">
                        <p class="text-cyan-500/30 text-[10px] font-mono tracking-[0.2em] uppercase group-hover:text-magenta-500/40">Status: Ready</p>
                        <div class="w-2 h-2 rounded-full bg-cyan-500 group-hover:bg-magenta-500 shadow-[0_0_8px_rgba(0,243,255,0.5)] group-hover:shadow-[0_0_8px_rgba(255,0,255,0.5)] animate-pulse"></div>
                    </div>
                </div>
                <div class="absolute inset-0 bg-cyan-500/5 group-hover:bg-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            `;
            card.onclick = () => openGame(game);
            gamesGrid.appendChild(card);
        });
    }

    function openGame(game) {
        gameIframe.src = game.iframeUrl;
        gameTitle.textContent = game.title;
        aboutTitle.textContent = `About ${game.title}`;
        aboutText.textContent = `Enjoy ${game.title} directly in your browser. This game is loaded via a secure iframe. If the game doesn't load, try opening it in a new tab using the "Open Original" button.`;
        openOriginalBtn.href = game.iframeUrl;
        
        gamesGrid.classList.add('hidden');
        settingsSection.classList.add('hidden');
        playerContainer.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showHome() {
        gameIframe.src = '';
        playerContainer.classList.add('hidden');
        settingsSection.classList.add('hidden');
        gamesGrid.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showSettings() {
        gameIframe.src = '';
        playerContainer.classList.add('hidden');
        gamesGrid.classList.add('hidden');
        settingsSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    logo.onclick = showHome;

    settingsBtn.onclick = () => {
        if (settingsSection.classList.contains('hidden')) {
            showSettings();
        } else {
            showHome();
        }
    };

    aboutBlankBtn.onclick = () => {
        const url = window.location.href;
        const win = window.open();
        if (!win) {
            alert('Popup blocked! Please allow popups for this site to enable cloaking.');
            return;
        }
        
        const doc = win.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Classes</title>
                <link rel="icon" type="image/png" href="https://ssl.gstatic.com/classroom/favicon.png">
                <style>
                    body, html { 
                        margin: 0; 
                        padding: 0; 
                        height: 100%; 
                        width: 100%; 
                        overflow: hidden; 
                        background-color: #050505;
                    }
                    iframe { 
                        width: 100%; 
                        height: 100%; 
                        border: none; 
                        display: block;
                    }
                </style>
            </head>
            <body>
                <iframe src="${url}"></iframe>
            </body>
            </html>
        `);
        doc.close();
    };

    tabCloakBtn.onclick = () => {
        document.title = 'Classes';
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
        document.getElementsByTagName('head')[0].appendChild(link);
        
        tabCloakBtn.textContent = 'DISGUISE_ACTIVE';
        tabCloakBtn.classList.add('bg-cyan-500', 'text-black');
        
        setTimeout(() => {
            tabCloakBtn.textContent = 'Apply_Disguise';
            tabCloakBtn.classList.remove('bg-cyan-500', 'text-black');
        }, 2000);
    };

    closePlayer.onclick = showHome;

    fullscreenBtn.onclick = () => {
        if (gameIframe.requestFullscreen) {
            gameIframe.requestFullscreen();
        } else if (gameIframe.webkitRequestFullscreen) {
            gameIframe.webkitRequestFullscreen();
        } else if (gameIframe.msRequestFullscreen) {
            gameIframe.msRequestFullscreen();
        }
    };

    searchInput.oninput = (e) => {
        if (!settingsSection.classList.contains('hidden') || !playerContainer.classList.contains('hidden')) {
            showHome();
        }
        const query = e.target.value.toLowerCase();
        const filtered = games.filter(g => g.title.toLowerCase().includes(query));
        renderGames(filtered);
    };
}

document.addEventListener('DOMContentLoaded', init);
