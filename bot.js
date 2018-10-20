const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const api = require('./api')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { leave } = Stage


const bot = new Telegraf(process.env.BOT_TOKEN)
var i = 0;


bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))
bot.hears('count', (ctx) => ctx.reply(i=i+1))

bot.use(Telegraf.log())

var cvs = [];
var exps = [];
var currentCV = 0;
var currentExperienceEdit = 0;

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

bot.hears('📄  CV', (ctx) => {
      api.getCvs(function(res) {
          var arr = [];
          for (var i = 0; i < res.length; i++)
          {
            var Principal = res[i].principal ? 'Yes' : 'No';
            arr.push(Markup.callbackButton(" - CV Name: " + res[i].name +  " Is CV Principal: " + Principal, "cv" + i, res.code));
            cvs.push(res[i].code);
          }
          ctx.reply("CV List", Extra.HTML().markup((m) =>
              m.inlineKeyboard(arr)
        ))
      });
})

bot.action(/.+/, (ctx) => {
  //return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
  if (ctx.match[0].startsWith('cv'))
  {

    currentCV = ctx.match[0].substr(ctx.match[0].length - 1);
    api.getCV(function(res) {
      ctx.reply('This is your CV, here you can modify it!', Markup
        .keyboard([
          ['⭐️ Experience', '📚 Studies'],
          ['📖 Languages', '🏅 Knowledge'],
          ['🗄 Extra information', '📑 Employment status'],
          ['🏠']
        ])
        .oneTime()
        .resize()
        .extra())
    }, cvs[0]);
  } else   if (ctx.match[0].startsWith('ed'))  {
      currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
      ctx.reply('Select item to modify', Markup
        .keyboard([
          ['🏭 Company', '👨‍💼 Position'],
          ['🏆 Level', 'Category'],
          ['Subcategory', '🔙']
        ])
        .oneTime()
        .resize()
        .extra()
      )
    }
})



bot.hears('🏭 Company', (ctx) => {
  ctx.reply((exps[currentExperienceEdit] != null ? exps[currentExperienceEdit].company : 'a'))
  ctx.scene != null ? ctx.scene.enter('editcompany') : '';
})


const editcompany = new Scene('editcompany')
editcompany.leave((ctx) => ctx.reply('Done'))
editcompany.on('message', (ctx) => {
  ctx.reply(ctx.mesage)
})













bot.start((ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
     Markup.keyboard([
     Markup.callbackButton('📄  CV', '📄  CV'),
     Markup.callbackButton('💾 Data', '💾 Data'),
     Markup.callbackButton('🏠', '🏠')
  ]).extra()
)
})


bot.hears('XXX', (ctx) => {
  return ctx.reply('This is your CV, here you can modify it!', Markup
    .keyboard([
      ['⭐️ Experience', '📚 Studies'],
      ['📖 Languages', '🏅 Knowledge'],
      ['🗄 Extra information', '📑 Employment status'],
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
      ['📖 Languages', '🏅 Knowledge'],
      ['🗄 Extra information', '📑 Employment status'],
      ['🏠']
    ])
    .oneTime()
    .resize()
    .extra()
  )
})




bot.hears('⭐️ Experience', (ctx) => {
  api.getExperiencies(function(res) {
    exps = res.experience;
    for (var i = 0; i < res.experience.length; i++)
    {
      ctx.reply("Company: " + res.experience[i].company + "\n" +
                "Job title: " + res.experience[i].job + "\n" +
                "Starting date: " + res.experience[i].startingDate + "\n" +
                "Finishing date: " + (res.experience[i].FinishingDate || '') + "\n" +
                "On course: " + res.experience[i].onCourse + "\n", Extra.HTML().markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('Edit','ed' + i)])
        ))
    }

  },cvs[currentCV]);
})

bot.hears('📚 Studies', (ctx) => {
  return ctx.reply('Add your studies to succes!',
  Markup.keyboard([
      Markup.callbackButton('🎓 Degree', '🎓 Degree'),
      Markup.callbackButton('🏛 Institution', '🏛 Institution'),
      Markup.callbackButton('🔙', '🔙'),
      ])
    .oneTime()
    .resize()
    .extra()
    )
  })

bot.hears('📖 Languages', (ctx) => {
    return ctx.reply('How many languages you know?',
    Markup.keyboard([
        Markup.callbackButton('🈵 Language', '🈵 Language'),
        Markup.callbackButton('🏆 Level', '🏆 Level'),
        Markup.callbackButton('🔙', '🔙'),
        ])
      .oneTime()
      .resize()
      .extra()
      )
    })

bot.hears('🏅 Knowledge', (ctx) => {
      return ctx.reply('Did you have any uncommon knowledge? Tell us!',
      Markup.keyboard([
          Markup.callbackButton('🧠 Knowledge', '🧠 Knowledge'),
          Markup.callbackButton('🏆 Level', '🏆 Level'),
          Markup.callbackButton('🔙', '🔙'),
          ])
        .oneTime()
        .resize()
        .extra()
        )
      })

bot.hears('🗄 Extra information', (ctx) => {
    return ctx.reply('Share extra information to know more about you!', Markup
   .keyboard([
      ['📇 Driving license', '🚗 Own vehicle'],
      ['🌍 Nationality', '👩🏽‍🔧 Self-employed'],
      ['🔙']
       ])
    .oneTime()
    .resize()
    .extra()
    )
    })


bot.hears('📑 Employment status', (ctx) => {
    return ctx.reply('Time to look for a job!', Markup
    .keyboard([
        ['🛠 Currently working', '🕵️‍♂️Looking for a job'],
        ['📋 Preferences', '🔙']
         ])
      .oneTime()
      .resize()
      .extra()
      )
      })







bot.hears('💾 Data', (ctx) => {
  return ctx.reply('Here you can check your personal information!', Markup
  .keyboard([
      ['📧 Email', '📝 Full name'],
      ['📸 Photo','🌐 Profile link'],
      ['🔙']
       ])
    .oneTime()
    .resize()
    .extra()
    )
    })

bot.hears('🏠', (ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
       Markup.keyboard([
       Markup.callbackButton('📄 CV', '📄 CV'),
       Markup.callbackButton('💾 Data', '💾 Data'),
       Markup.callbackButton('🏠', '🏠')
    ]).extra()
  )
})

// Create scene manager
const stage = new Stage()
stage.command('cancel', leave())

// Scene registration
stage.register(editcompany)

bot.use(session())
bot.use(stage.middleware())

bot.startPolling();
