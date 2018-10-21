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
var applications = [];
var questions = [];
var currentCV = 0;
var currentExperienceEdit = 0;
var currentApplication = 0;
var currentOffer = 0;
var apply_data = new Object();
var applaying = false;

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

bot.start((ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
     Markup.keyboard([
     Markup.callbackButton('📄  CV', '📄  CV'),
     Markup.callbackButton('💾 Data', '💾 Data'),
     Markup.callbackButton('🔎 Search', '🔎 Search'),
     Markup.callbackButton('My Applications',' My Applications'),
     Markup.callbackButton('🏠', '🏠')
  ]).extra())
})

bot.hears('📄  CV', (ctx) => {
      cvs = [];
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
          ['🏭 Company', '👨‍💼 Job title'],
          ['Starting date', 'Finish date'],
          ['Still enrolled', '🔙']
        ])
        .oneTime()
        .resize()
        .extra()
      )
    } else if (ctx.match[0].startsWith('ed'))  {
        currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
        ctx.reply('Select item to modify',
        Markup.keyboard([
          ['🎓 Degree', '🏛 Institution'],
          ['Starting date', 'Finishing date'],
          ['Still enrolled', '🔙'],
            ])
          .oneTime()
          .resize()
          .extra()
        )
      } else if (ctx.match[0].startsWith('apy'))  {
          currentApplication = ctx.match[0].substr( ctx.match[0].length - 1);
          //New Application
          //CV Code
          cvs = [];
          apply_data = [];
          api.getCvs(function(res) {
              var arr = [];
              for (var i = 0; i < res.length; i++)
              {
                var Principal = res[i].principal ? 'Yes' : 'No';
                arr.push(Markup.callbackButton(" - CV Name: " + res[i].name +  " Is CV Principal: " + Principal, "apcv" + i, res.code));
                cvs.push(res[i].code);
              }
              ctx.reply("Select CV to apply", Extra.HTML().markup((m) =>
                  m.inlineKeyboard(arr)
            ))
          });
    } else if (ctx.match[0].startsWith('lan'))  {
        currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
        ctx.reply('Select item to modify',
        Markup.keyboard([
        ['🈵 Language', 'Writing'],
        ['Speaking', 'Reading'],
        ['🔙']
        ])
      .oneTime()
      .resize()
      .extra()
    )
    } else if (ctx.match[0].startsWith('know'))  {
        currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
        ctx.reply('Select item to modify',
        Markup.keyboard([
        Markup.callbackButton('🧠 Skill', '🧠 Skill'),
        Markup.callbackButton('🏆 Level', '🏆 Level'),
        Markup.callbackButton('🔙', '🔙'),
          ])
        .oneTime()
        .resize()
        .extra()
        )
    } else if (ctx.match[0].startsWith('xtra'))  {
        currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
        ctx.reply('Select item to modify', Markup
        .keyboard([
            ['📇 Driving license', '🚗 Own vehicle'],
            ['🌍 Nationality', '👩🏽‍🔧 Freelance'],
            ['🔙']
             ])
        .oneTime()
        .resize()
        .extra()
      )
      } else if (ctx.match[0].startsWith('employ'))  {
        currentExperienceEdit = ctx.match[0].substr( ctx.match[0].length - 1);
        ctx.reply('Select item to modify', Markup
        .keyboard([
        ['Currently working', 'Prefered position'],
        ['🛠 Employment status', '🔙']
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
        else if (ctx.match[0].startsWith('apcv')) {
          //Get Questions
          currentCV = ctx.match[0].substr( ctx.match[0].length - 1);
          apply_data.curriculumCode = cvs[currentCV];
          console.log(apply_data);
          api.getQuestions(function(res) {
              console.log(res);
              if (res.openQuestions.length == 0 && res.killerQuestions.length == 0) {
                apply_data.openQuestions = res.openQuestions;
                apply_data.killerQuestions = res.killerQuestions;
                console.log(apply_data);
                 var jsonString = JSON.stringify(apply_data);
                api.postApplication(offers[currentApplication].id,jsonString);
              }
          },offers[currentApplication].id);
        }  else if (ctx.match[0].startsWith('apof'))
        {
          currentOffer = ctx.match[0].substr(ctx.match[0].length - 1);
          //Get Questions
            api.getQuestions(function(res) {

          },offers[currentOffer]);
        }
})


























bot.hears('🏭 Company', (ctx, next) => {
  states.companyEdit = true;
  ctx.reply((exps[currentExperienceEdit] != null ? exps[currentExperienceEdit].company : 'a'))
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
  })

bot.hears('📖 Languages', (ctx) => {
  api.getEducations(function(res) {
    edus = res.education;
    console.log(res);
    for (var i = 0; i < res.education.length; i++)
    {
      ctx.reply("Language: " + res.education[i].courseCode + "\n" +
                "Writing: " + res.education[i].startingDate + "\n" +
                "Speaking: " + (res.education[i].FinishingDate || '') + "\n" +
                "Reading: " + res.education[i].stillEnrolled + "\n", Extra.HTML().markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('Edit','lan' + i)])
        ))
    }
  },cvs[currentCV]);
})

bot.hears('🏅 Knowledge', (ctx) => {
    api.getEducations(function(res) {
      edus = res.education;
      console.log(res);
      for (var i = 0; i < res.education.length; i++)
      {
        ctx.reply("Skill: " + res.education[i].courseCode + "\n" +
                  "Level: " + res.education[i].stillEnrolled + "\n", Extra.HTML().markup((m) =>
            m.inlineKeyboard([
              m.callbackButton('Edit','know' + i)])
          ))
      }
      },cvs[currentCV]);
      })

bot.hears('🗄 Extra information', (ctx) => {
  api.getEducations(function(res) {
    edus = res.education;
    console.log(res);
    for (var i = 0; i < res.education.length; i++)
    {
      ctx.reply("Driving license: " + res.education[i].courseCode + "\n" +
                "Own vehicle: " + res.education[i].startingDate + "\n" +
                "Nationality: " + (res.education[i].FinishingDate || '') + "\n" +
                "Freelance: " + res.education[i].stillEnrolled + "\n", Extra.HTML().markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('Edit','xtra' + i)])
        ))
    }
    },cvs[currentCV]);
})

bot.hears('📑 Employment status', (ctx) => {
  api.getEducations(function(res) {
    edus = res.education;
    console.log(res);
    for (var i = 0; i < res.education.length; i++)
    {
      ctx.reply("Currently working: " + res.education[i].courseCode + "\n" +
                "Prefered position: " + (res.education[i].FinishingDate || '') + "\n" +
                "Employment status: " + res.education[i].stillEnrolled + "\n", Extra.HTML().markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('Edit','employ' + i)])
        ))
    }
    },cvs[currentCV]);
})

/*bot.hears('💾 Data', (ctx) => {
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
*/



 bot.hears('💾 Data', (ctx) => {
   api.getCandidate(function(res) {
       if (res.error != null) return ctx.reply("User not authenticated " + res.error);
       ctx.reply("Name: " + res[0].fullName + "\n" +
                 "City: " + res[0].city + "\n" +
                 "Email: " + res[0].email + "\n" +
                 "Public profile link: " + (res.publicprofilelink) + "\n");
 });
})

bot.hears('🔎 Search', (ctx) => {
   ctx.reply("What jobs are you looking for?");
   states.search = true;
 })

bot.hears('My Applications', (ctx) => {
       api.getApplications(function(res) {
         applications = res.applications;
         if (res.applications.length == 0) return ctx.reply("No applications found");
         for (var i = 0; i < res.applications.length; i++)
         {
           ctx.reply("Offer: " + res.applications[i].jobOffer.title + "\n" +
                     "Company: " + res.applications[i].jobOffer.company + "\n" +
                     "City: " + res.applications[i].jobOffer.city + "\n" +
                     "Status: " + (res.applications[i].rejected == false ? "Not rejected" : "Rejected" ) + "\n", Extra.HTML().markup((m) =>
               m.inlineKeyboard([
                 m.callbackButton('Edit','ex' + i)])
             ))
         }
       });
 })

bot.hears('🏠', (ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
       Markup.keyboard([
       Markup.callbackButton('📄 CV', '📄 CV'),
       Markup.callbackButton('💾 Data', '💾 Data'),
       Markup.callbackButton('🔎 Search', '🔎 Search'),
       Markup.callbackButton('My Applications',' My Applications'),
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
              m.callbackButton('Apply','apy' + i)])
          ))
      }
    },ctx.message.text);
  }
})

bot.startPolling();
