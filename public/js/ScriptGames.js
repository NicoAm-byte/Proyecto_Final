window.filterGames = function () {
    const searchInput = document.getElementById('search-barr').value.toLowerCase();
    const gameList = document.getElementById('game-list');

    const allGames = [
        { name: "Honkai", url: "honkai/index.html" },
        { name: "Fnaf", url: "Fnaf/index.html" },
        { name: "Brwal Stars", url: "brwal.web/index.html" },
        { name: "Fifa 25", url: "FC25/index.html" },
        { name: "Mortal Kombat", url: "Mortalkombat/index.html" }
    ];

    const filteredGames = allGames.filter(game =>
        game.name.toLowerCase().includes(searchInput)
    );

    gameList.innerHTML = '';

    if (filteredGames.length > 0 && searchInput) {
        gameList.style.display = 'block';
        filteredGames.forEach(game => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${game.url}">${game.name}</a>`;
            gameList.appendChild(li);
        });
    } else {
        gameList.style.display = 'none';
    }
};