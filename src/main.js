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
        playerContainer.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    closePlayer.onclick = () => {
        gameIframe.src = '';
        playerContainer.classList.add('hidden');
        gamesGrid.classList.remove('hidden');
    };

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
        const query = e.target.value.toLowerCase();
        const filtered = games.filter(g => g.title.toLowerCase().includes(query));
        renderGames(filtered);
    };
}

document.addEventListener('DOMContentLoaded', init);
