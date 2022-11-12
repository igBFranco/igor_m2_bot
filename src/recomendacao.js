//funcao que mostra a recomendacao
function recomendacao(item) {
    return `
        <b>Titulo:</b> ${item.titulo}
        \n<b>Genero:</b> ${item.genre}
        \n<b>Trailer:</b> ${item.trailer}
    `;
}

module.exports = recomendacao;