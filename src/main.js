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
            card.className = 'group relative bg-[#151515] rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg';
            card.innerHTML = `
                <div class="aspect-video overflow-hidden">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer">
                </div>
                <div class="p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 class="font-semibold text-lg text-white">${game.title}</h3>
                    <p class="text-white/40 text-sm mt-1">Click to play</p>
                </div>
                <div class="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
