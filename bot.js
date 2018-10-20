const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const api = require('./api')

const bot = new Telegraf(process.env.BOT_TOKEN)
var i = 0;

bot.start((ctx) => {
    return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
       Markup.keyboard([
       Markup.callbackButton('📄  CV', '📄  CV'),
       Markup.callbackButton('Data', 'Data'),
       Markup.callbackButton('🏠', '🏠')
    ]).extra()
  )
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))
bot.hears('count', (ctx) => ctx.reply(i=i+1))

bot.use(Telegraf.log())

bot.command('onetime', ({ reply }) =>
  reply('One time keyboard', Markup
    .keyboard(['Work', 'Studies', 'Languages'],
    ['Knowledge', 'Other','/'],)
    .oneTime()
    .resize()
    .extra()
  )
)

bot.command('custom', ({ reply }) => {
  return reply('Custom buttons keyboard', Markup
    .keyboard([
      ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
      ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
      ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
    .extra()
  )
})

bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

bot.command('special', (ctx) => {
  return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
    return markup.resize()
      .keyboard([
        markup.contactRequestButton('Send contact'),
        markup.locationRequestButton('Send location')
      ])
  }))
})

bot.command('pyramid', (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
    })
  ))
})

bot.command('simple', (ctx) => {
  return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
    Markup.keyboard(['Coke', 'Pepsi'])
  ))
})

bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('Coke', 'Coke'),
      m.callbackButton('Pepsi', 'Pepsi')
    ])))
})

bot.command('random', (ctx) => {
  return ctx.reply('random example',
    Markup.inlineKeyboard([
      Markup.callbackButton('Coke', 'Coke'),
      Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
      Markup.callbackButton('Pepsi', 'Pepsi')
    ]).extra()
  )
})

bot.command('caption', (ctx) => {
  return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
    Extra.load({ caption: 'Caption' })
      .markdown()
      .markup((m) =>
        m.inlineKeyboard([
          m.callbackButton('Plain', 'plain'),
          m.callbackButton('Italic', 'italic')
        ])
      )
  )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      columns: parseInt(ctx.match[1])
    })
  ))
})

bot.action('Dr Pepper', (ctx, next) => {
  return ctx.reply('👍').then(() => next())
})

bot.action('plain', async (ctx) => {
  ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
    Markup.callbackButton('Plain', 'plain'),
    Markup.callbackButton('Italic', 'italic')
  ]))
})

bot.action('italic', (ctx) => {
  ctx.editMessageCaption('_Caption_', Extra.markdown().markup(Markup.inlineKeyboard([
    Markup.callbackButton('Plain', 'plain'),
    Markup.callbackButton('* Italic *', 'italic')
  ])))
})

bot.action(/.+/, (ctx) => {
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

bot.hears('getcvs', (ctx) => {
      ctx.reply("CV List");
      api.getCvs(function(res) {
        for (var i = 0; i < res.length; i++)
        {
          var Principal = res[i].principal ? 'Yes' : 'No';
          console.log(res);
          ctx.reply(i+1 + " - CV Name: " + res[i].name +  " Is CV Principal: " + Principal);
        }
      });
})


































bot.hears('📄  CV', (ctx) => {
  return ctx.reply('This is your CV, here you can modify it!', Markup
    .keyboard([
      ['⭐️ Experience', '📚 Studies'],
      ['📖 Languages', 'Knowledge'],
      ['Extra information', 'Employment situation'],
      ['🏠']
    ])
    .oneTime()
    .resize()
    .extra()
  )
})

bot.hears('🔙', (ctx) => {
  return ctx.reply('This is your CV, here you can modify it!', Markup
    .keyboard([
      ['⭐️ Experience', '📚 Studies'],
      ['📖 Languages', 'Knowledge'],
      ['Extra information', 'Employment situation'],
      ['🏠']
    ])
    .oneTime()
    .resize()
    .extra()
  )
})




bot.hears('⭐️ Experience', ({ reply }) => {
  return reply('Add your job experience!', Markup
    .keyboard([
      ['Company', 'Position'],
      ['Level', 'Category'],
      ['Subcategory', '🔙']
    ])
    .oneTime()
    .resize()
    .extra()
  )
})





bot.hears('📚 Studies', (ctx) => {
  return ctx.reply('Add your studies to succes!',
  Markup.keyboard([
      Markup.callbackButton(' Degree', ' Degree'),
      Markup.callbackButton(' Institution', ' Institution'),
      Markup.callbackButton('🔙', '🔙'),
      ])
    .oneTime()
    .resize()
    .extra()
    )
  })

  bot.hears('📖 Languages', (ctx) => {
    return ctx.reply('How many languages you know? ',
    Markup.keyboard([
        Markup.callbackButton(' Language', ' Language'),
        Markup.callbackButton(' Level', 'Level'),
        Markup.callbackButton('🔙', '🔙'),
        ])
      .oneTime()
      .resize()
      .extra()
      )
    })



bot.hears('Data', (ctx) => {
  return ctx.reply('Here you can check your personal information!',
    Markup.keyboard([
      Markup.callbackButton('Email', 'Email'),
       Markup.callbackButton('Full name', 'Full name'),
       Markup.callbackButton('Photo', 'Photo'),
       Markup.callbackButton('Profile link', 'Profile link'),
    ]).extra()
  )
})


bot.hears('🏠', (ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
       Markup.keyboard([
       Markup.callbackButton('CV', 'CV'),
       Markup.callbackButton('Data', 'Data'),
       Markup.callbackButton('🏠', '🏠')
    ]).extra()
  )
})




bot.startPolling();
