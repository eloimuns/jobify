const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const api = require('./api')

const bot = new Telegraf(process.env.BOT_TOKEN)
var i = 0;

//bot.use(Telegraf.log())

var cvs = [];
var exps = [];
var edus = [];
var offers = [];
var currentCV = 0;
var currentExperienceEdit = 0;

var states = {
  companyEdit : false,
  jobTitleEdit : false,
  startDateEdit : false,
  finishingDateEdit : false,
  onCourseEdit : false,
  search : false,
  apply : false
};

var resetStates = function(){
  states = {
    companyEdit : false,
    jobTitleEdit : false,
    startDateEdit : false,
    finishingDateEdit : false,
    onCourseEdit : false,
    search : false,
    apply : false
  };
}

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
  } else   if (ctx.match[0].startsWith('ex'))  {
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
    else   if (ctx.match[0].startsWith('ed'))  {
        currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
        ctx.reply('Select item to modify',
        Markup.keyboard([
            Markup.callbackButton('🎓 Degree', '🎓 Degree'),
            Markup.callbackButton('🏛 Institution', '🏛 Institution'),
            Markup.callbackButton('🔙', '🔙'),
            ])
          .oneTime()
          .resize()
          .extra()
        )
      }
      else   if (ctx.match[0].startsWith('app'))  {
          currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
          ctx.reply('Select item to modify',
          Markup.keyboard([
              Markup.callbackButton('🎓 Degree', '🎓 Degree'),
              Markup.callbackButton('🏛 Institution', '🏛 Institution'),
              Markup.callbackButton('🔙', '🔙'),
              ])
            .oneTime()
            .resize()
            .extra()
          )
        }
})

bot.hears('🏭 Company', (ctx, next) => {
  states.companyEdit = true;
  ctx.reply((exps[currentExperienceEdit] != null ? exps[currentExperienceEdit].company : 'a'))
})

bot.start((ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
     Markup.keyboard([
     Markup.callbackButton('📄  CV', '📄  CV'),
     Markup.callbackButton('💾 Data', '💾 Data'),
     Markup.callbackButton('🔎 Search', '🔎 Search'),
     Markup.callbackButton('🏠', '🏠')
  ]).extra())
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
            m.callbackButton('Edit','ex' + i)])
        ))
    }
  },cvs[currentCV]);
})

bot.hears('📚 Studies', (ctx) => {
  api.getEducations(function(res) {
    edus = res.education;
    console.log(res);
    for (var i = 0; i < res.education.length; i++)
    {
      ctx.reply("Degree: " + res.education[i].courseCode + "\n" +
                "School: " + res.education[i].institutionName + "\n" +
                "Starting date: " + res.education[i].startingDate + "\n" +
                "Finishing date: " + (res.education[i].FinishingDate || '') + "\n" +
                "Still enrolled: " + res.education[i].stillEnrolled + "\n", Extra.HTML().markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('Edit','ed' + i)])
        ))
    }

  },cvs[currentCV]);
  /*return ctx.reply('Add your studies to succes!',
  Markup.keyboard([
      Markup.callbackButton('🎓 Degree', '🎓 Degree'),
      Markup.callbackButton('🏛 Institution', '🏛 Institution'),
      Markup.callbackButton('🔙', '🔙'),
      ])
    .oneTime()
    .resize()
    .extra()
  )*/
  })

bot.hears('📖 Languages', (ctx) => {
  api.getEducations(function(res) {
    edus = res.education;
    console.log(res);
    for (var i = 0; i < res.education.length; i++)
    {
      ctx.reply("Degree: " + res.education[i].courseCode + "\n" +
                "School: " + res.education[i].institutionName + "\n" +
                "Starting date: " + res.education[i].startingDate + "\n" +
                "Finishing date: " + (res.education[i].FinishingDate || '') + "\n" +
                "Still enrolled: " + res.education[i].stillEnrolled + "\n", Extra.HTML().markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('Edit','ed' + i)])
        ))
    }

  },cvs[currentCV]);

    /*return ctx.reply('How many languages you know?',
    Markup.keyboard([
        Markup.callbackButton('🈵 Language', '🈵 Language'),
        Markup.callbackButton('🏆 Level', '🏆 Level'),
        Markup.callbackButton('🔙', '🔙'),
        ])
      .oneTime()
      .resize()
      .extra()
    )*/
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
      ['🏠']
       ])
    .oneTime()
    .resize()
    .extra()
    )
 })

 bot.hears('🔎 Search', (ctx) => {
   ctx.reply("What jobs are you looking for?");
   states.search = true;
 })

bot.hears('🏠', (ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
       Markup.keyboard([
       Markup.callbackButton('📄 CV', '📄 CV'),
       Markup.callbackButton('💾 Data', '💾 Data'),
       Markup.callbackButton('🔎 Search', '🔎 Search'),
       Markup.callbackButton('🏠', '🏠')
    ]).extra()
  )
})

bot.on('text', (ctx) => {
  if (states.companyEdit){
    exps[currentExperienceEdit].company = ctx.message.text;
    api.setExperience(cvs[currentCV], exps[currentExperienceEdit]);
  }
  else if (states.search){
    api.getOffers(function(res) {
      if (res.offers.length == 0)
      {
        ctx.reply("No jobs found!")
      }
      for (var i = 0; i < res.offers.length; i++)
      {
        offers = res.offers;
        ctx.reply("Title: " + res.offers[i].title + "\n" +
                  "Company: " + res.offers[i].author.name + "\n" +
                  "City: " + res.offers[i].city + "\n" +
                  "Experience min: " + (res.offers[i].experienceMin.value || '') + "\n" , Extra.HTML().markup((m) =>
            m.inlineKeyboard([
              m.callbackButton('Apply','app' + i)])
          ))
      }
    },ctx.message.text);
  }
})

bot.startPolling();
