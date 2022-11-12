const env = require('../.env');
const { Telegraf, Markup } = require('telegraf');
const recomendacao = require('./recomendacao');
const filmes = require('./data/filmes');
const series = require('./data/series');

//criando o objeto bot e o instanciando como um novo objeto da classe Telegraf
const bot = new Telegraf(env.token);

//comando de inicio do bot
bot.start(async ctx => {
    //descobrindo o usuario que esta usando o bot
    const from = ctx.update.message.from;
    //comparando o id do usuario com os ids buscados
    if(from.id === 5282100976 || from.id === 1351450134){
        //mensagem inicial
        await ctx.replyWithHTML(`
            <b>Olá ${from.first_name}, tudo bem?</b>
            \nEsse Bot foi desenvolvido como Atividade da M2 da disciplina de Sistemas de Apoio a Decisão!
            \nPosso te indicar alguns filmes, é só digitar <b>Filmes</b>
            \nPosso te indicar também algumas séries, é só digitar <b>Séries</b>
            \nMe envie um <b>Emoji</b> do seu animal de estimação favorito que eu lhe mandarei uma foto dele!
            \nCaso queira saber onde está localizado um tesouro, é só digitar <b>Tesouro</b>
            \nTambém possuo outras funções, é só digitar <b>Comandos</b> para saber mais!
        `);
        await ctx.reply(`Escolha uma opção:`, Markup.keyboard([
            ['Filmes', 'Séries'],
            ['Comandos', 'Tesouro'],
            ['🐶','🐱', '🐹', '🐷']
        ]).resize());

    }else {
        //caso o id do usuario nao seja igual aos ids buscados, ele nao tera acesso ao bot
        await ctx.reply(`Desculpe, mas eu não falo com estranhos!`);
        bot.stop("Não autorizado");
    }
});

//evento de localizacao
bot.on('location', ctx => {
    const loc = ctx.update.message.location;
    ctx.reply(`Voce esta em: 
        Latitude: ${loc.latitude},
        Longitude: ${loc.longitude}
    `);
});

//evento de contato
bot.on('contact', ctx => {
    const contato = ctx.update.message.contact;
    ctx.reply(`Chama o ${contato.first_name}, Número:(${contato.phone_number}) para falar comigo!`);
});

//evento de audio
bot.on('voice', ctx => {
    const voz = ctx.update.message.voice;
    ctx.reply(`Audio recebido, ele tem ${voz.duration} segundos`);
});

//evento de foto
bot.on('photo', ctx => {
    const foto = ctx.update.message.photo;
    foto.forEach((photo, i) => {
        ctx.reply(`A ${i}a foto tem resolucao de ${photo.width}x${photo.height}`);
    });
});

//evento de sticker
bot.on('sticker', ctx => {
    const sticker = ctx.update.message.sticker;
    ctx.reply(`Estou vendo que voce enviou o sticker ${sticker.emoji} do conjunto ${sticker.set_name}`);
})

//comando de indicacao de filmes
bot.hears(['Filmes', 'filmes'], ctx => {
    let rec = "";
    //comando para enviar uma mensagem com os filmes cadastrados
    rec = recomendacao(filmes[Math.floor(Math.random() * filmes.length)]);
    ctx.replyWithHTML(rec);
});

//comando de indicacao de series
bot.hears(['Séries', 'séries'], ctx => {
    let rec = "";
    //comando para enviar uma mensagem com as series cadastrados
    rec = recomendacao(series[Math.floor(Math.random() * series.length)]);
    ctx.replyWithHTML(rec);
});

//comando de enviar imagem de animal de estimação
bot.hears(['🐶','🐱', '🐹', '🐷'], ctx => {
    if(ctx.match == '🐶'){
        ctx.reply('Aqui está uma foto de um cachorro!', {reply_to_message_id: ctx.message.message_id});
        ctx.replyWithPhoto({url: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=640:*'});
    }else if(ctx.match == '🐱'){
        ctx.reply('Aqui está uma foto de um gato!', {reply_to_message_id: ctx.message.message_id});
        ctx.replyWithPhoto({url: 'https://www.petz.com.br/blog/wp-content/uploads/2021/11/enxoval-para-gato-Copia.jpg'});
    }else if(ctx.match == '🐹'){
        ctx.reply('Aqui está uma foto de um hamster!', {reply_to_message_id: ctx.message.message_id});
        ctx.replyWithPhoto({url: 'https://s2.glbimg.com/UG8E6w0z5vqc1t2rswlV5lYw45k=/e.glbimg.com/og/ed/f/original/2022/02/22/terrario-hamster-como-montar-o-espaco-perfeito-para-o-meu-pet-vida-de-bicho.png'});
    }else if(ctx.match == '🐷'){
        ctx.reply('Aqui está uma foto de um porco!', {reply_to_message_id: ctx.message.message_id});
        ctx.replyWithPhoto({url: 'https://cptstatic.s3.amazonaws.com/imagens/enviadas/materias/materia11264/dicas-de-cuidados-que-voce-deve-ter-com-seu-mini-porco-cpt.jpg'});
    }
});

//comando de indicacao de series
bot.hears(['Tesouro', 'tesouro'], ctx => {
    ctx.replyWithLocation(0.588255, -90.757391);
});

//utilizando com expressoes regulares
bot.hears(/comandos/i, ctx => {
    ctx.replyWithMarkdownV2(`
        **Comandos**
        \\- /start: Iniciar o bot
        \\- Comandos: Lista de comandos
        \\- Filmes: Indicação de filmes
        \\- Séries: Indicação de séries
        \\- Tesouro: Localização de um tesouro
        \\- 🐶: Foto de um cachorro
        \\- 🐱: Foto de um gato
        \\- 🐹: Foto de um hamster
        \\- 🐷: Foto de um porco
    `);
});



bot.startPolling();