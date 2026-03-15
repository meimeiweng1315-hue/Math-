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
        const response = await fetch('./src/games.json');
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
            card.className = 'group relative bg-black rounded-none overflow-hidden border-2 border-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]';
            card.innerHTML = `
                <div class="aspect-video overflow-hidden border-b-2 border-cyan-500/20">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" referrerpolicy="no-referrer">
                </div>
                <div class="p-4 bg-black relative">
                    <div class="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 class="font-bold text-lg text-cyan-400 uppercase tracking-tighter">${game.title}</h3>
                    <p class="text-cyan-500/40 text-xs mt-1 font-mono tracking-widest">INITIALIZING_MODULE...</p>
                </div>
                <div class="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
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
        doc.title = 'Classes';
        
        const link = doc.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
        doc.head.appendChild(link);

        const iframe = doc.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        
        doc.body.appendChild(iframe);
        doc.body.style.margin = '0';
        doc.body.style.padding = '0';
        doc.body.style.overflow = 'hidden';
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
