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
var jbs = [];
var knw = [];
var applications = [];
var questions = [];
var currentCV = 0;
var currentExperienceEdit = 0;
var currentStudiesEdit = 0;
var currentKnowledgeEdit = 0;
var currentJobsEdit = 0;

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

  courseCodeEdit : false,
  institutionNameEdit : false,
  startingDateStdEdit : false,
  finishingDateStdEdit : false,
  stillEnrolledEdit : false,

  skillEdit : false,
  levelEdit : false,

  workingEdit :false,
  preferredPositionEdit : false,
  employmentStatusEdit : false,

  search : false,
  apply : false,
};

var resetStates = function(){
  states = {
    companyEdit : false,
    jobTitleEdit : false,
    startDateEdit : false,
    finishingDateEdit : false,
    onCourseEdit : false,

    courseCodeEdit : false,
    institutionNameEdit : false,
    startingDateStdEdit : false,
    finishingDateStdEdit : false,
    stillEnrolledEdit : false,

    skillEdit : false,
    levelEdit : false,

    workingEdit :false,
    preferredPositionEdit : false,
    employmentStatusEdit : false,

    search : false,
    apply : false
  };
}

bot.start((ctx) => {
  return ctx.reply('Welcome to the Jobyfy Bot main menu, what you need?',
     Markup.keyboard([
     ['📄 CV', '💾 Data'],
     ['🔎 Search', '📬 My Applications'],
     ['🏠']
  ]).extra())
})

bot.hears('📄 CV', (ctx) => {
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
          ['📆 Starting date', '📆 Finish date'],
          ['⌛️ On course', '🔙']
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
          ['📆 Starting date', '📆 Finishing date'],
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
        ['🈵 Language', '📝 Writing'],
        ['📢 Speaking', '📕 Reading'],
        ['🔙']
        ])
      .oneTime()
      .resize()
      .extra()
    )
    } else if (ctx.match[0].startsWith('know'))  {
      currentKnowledgeEdit = ctx.match[0].substr( ctx.match[0].length - 1);
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
          api.getQuestions(function(res) {
              //if (res.openQuestions.length == 0 && res.killerQuestions.length == 0) {
                var data = {curriculumCode:cvs[currentCV]};
                api.postApplication(offers[currentApplication].id,data, function(res){
                  if (res != null && res.error_description){
                    var err = res.error_description;
                    if (err.startsWith("The answer is not correct")){
                      err = "This application must be done via websitre or mobileapp."
                    }
                    ctx.reply(err);
                  }
                });

              //}
          },offers[currentApplication].id);
        }  else if (ctx.match[0].startsWith('apof'))
        {
          currentOffer = ctx.match[0].substr(ctx.match[0].length - 1);
          //Get Questions
            api.getQuestions(function(res) {

          },offers[currentOffer]);
        }
})
























//experience puts

bot.hears('🏭 Company', (ctx, next) => {
  resetStates();
  states.companyEdit = true;
  ctx.reply('Input new data')
})
bot.hears('👨‍💼 Job title', (ctx, next) => {
  resetStates();
  states.jobTitleEdit = true;
  ctx.reply('Input new data')
})
bot.hears('📆 Starting date', (ctx, next) => {
  resetStates();
  states.startDateEdit = true;
  ctx.reply('Input new data')
})
bot.hears('📆 Finish date', (ctx, next) => {
  resetStates();
  states.finishingDateEdit = true;
  ctx.reply('Input new data')
})
bot.hears('⌛️ On course', (ctx, next) => {
  resetStates();
  states.onCourseEdit = true;
  ctx.reply('Input new data')
})


//studies input

bot.hears('🎓 Degree', (ctx, next) => {
  resetStates();
  states.courseCodeEdit = true;
  ctx.reply('Input new data')
})
bot.hears('🏛 Institution', (ctx, next) => {
  resetStates();
  states.institutionNameEdit = true;
  ctx.reply('Input new data')
})
bot.hears('📆 Starting date', (ctx, next) => {
  resetStates();
  states.startingDateStdEdit = true;
  ctx.reply('Input new data')
})
bot.hears('📆 Finishing date', (ctx, next) => {
  resetStates();
  states.finishingDateStdEdit = true;
  ctx.reply('Input new data')
})
bot.hears('Still enrolled', (ctx, next) => {
  resetStates();
  states.stillEnrolledEdit = true;
  ctx.reply('Input new data')
})








//Knowledge puts
bot.hears('🧠 Skill', (ctx, next) => {
  resetStates();
  states.skillEdit = true;
  ctx.reply('Input new data')
})
bot.hears('🏆 Level', (ctx, next) => {
  resetStates();
  states.levelEdit = true;
  ctx.reply('Input new data')
})







//Employment Status puts
bot.hears('Currently working', (ctx, next) => {
  resetStates();
  states.workingEdit = true;
  ctx.reply('Input new data')
})
bot.hears('Prefered position', (ctx, next) => {
  resetStates();
  states.preferredPositionEdit = true;
  ctx.reply('Input new data')
})
bot.hears('🛠 Employment status', (ctx, next) => {
  resetStates();
  states.employmentStatusEdit = true;
  ctx.reply('Input new data')
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
                "Finishing date: " + (res.experience[i].finishingDate || '') + "\n" +
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
    for (var i = 0; i < res.education.length; i++)
    {
      ctx.reply("Degree: " + res.education[i].courseCode + "\n" +
                "School: " + res.education[i].institutionName + "\n" +
                "Starting date: " + res.education[i].startingDate + "\n" +
                "Finishing date: " + (res.education[i].finishingDate || '') + "\n" +
                "Still enrolled: " + res.education[i].stillEnrolled + "\n",
                Extra.HTML().markup((m) =>
                m.inlineKeyboard([
                m.callbackButton('Edit','ed' + i)]))
        )
    }
  },cvs[currentCV]);
  })

bot.hears('📖 Languages', (ctx) => {
  api.getSkills(function(res) {
    skills = res.language;

    api.getDictonary(function(data){
      if (res.language){
        for (var i = 0; i < res.language.length; i++)
        {
          var lang = null;
          if (data){
              for (var j = 0; j < data.length; j++){
                if (data[j].id == res.language[i].id){
                  lang = data[j].value
                }
              }
          }
          ctx.reply("Language: " + lang + "\n" +
                    "Writing: " + res.language[i].writing + "\n" +
                    "Speaking: " + (res.language[i].speaking || '') + "\n" +
                    "Reading: " + res.language[i].reading + "\n", Extra.HTML().markup((m) =>
              m.inlineKeyboard([
                m.callbackButton('Edit','lan' + i)])
            ))
        }
    }
    }, 'language')

  },cvs[currentCV]);
})

bot.hears('🏅 Knowledge', (ctx) => {
    api.getSkills(function(res) {
      knw = res.expertise;
      if (res.expertise != null && res.expertise.length > 0){
        for (var i = 0; i < res.expertise.length ; i++){
          ctx.reply("Skill: " + res.expertise[i].skill + "\n" +
                  "Level: " + res.expertise[i].level + "\n", Extra.HTML().markup((m) =>
            m.inlineKeyboard([
              m.callbackButton('Edit','know' +i )])
          ))
        }

      }

      },cvs[currentCV]);
      })

bot.hears('🗄 Extra information', (ctx) => {
  var str = "";
  api.getPersonalData(function(res) {
    edus = res.personalData;
    console.log(res);
    if (res.nationalities)
    {
      for (var i = 0; i < res.nationalities.length; i++){
        str = str + res.nationalities.length; i++;
      }
    }
    if (res.driverLicenses)
    {
      for (var i = 0; i < res.driverLicenses.length; i++);
      {
        str = str + res.driverLicenses[i] + ", ";
      }
    }
    str = str + "\n" + res.vehicleOwner;
    str = str + "\n" + "Freelance: " + res.freelance + "\n";
    ctx.reply(str /*,Extra.HTML().markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('Edit','xtra' + i)])
          )*/)
    },cvs[currentCV]);
})

bot.hears('📑 Employment status', (ctx) => {
  api.getFutureJob(function(res) {
    jbs = res;
      ctx.reply("Currently working: " + res.working + "\n" +
                "Preferred position: " + res.preferredPosition + "\n" +
                "Employment status: " + res.employmentStatus + "\n", Extra.HTML().markup((m) =>
          m.inlineKeyboard([
          m.callbackButton('Edit','employ' + i)])
        ))
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
       ctx.reply("Name: " + res.fullName + "\n" +
                 "City: " + res.city + "\n" +
                 "Email: " + res.email + "\n" +
                 "Public profile link: " + (res.publicprofilelink) + "\n");
 });
})

bot.hears('🔎 Search', (ctx) => {
   ctx.reply("What jobs are you looking for?");
   states.search = true;
 })

bot.hears('📬 My Applications', (ctx) => {
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
     ['📄 CV', '💾 Data'],
     ['🔎 Search', '📬 My Applications'],
     ['🏠']
  ]).extra())
})


bot.on('text', (ctx) => {
  if (states.companyEdit){
    exps[currentExperienceEdit].company = ctx.message.text;
    api.setExperience(cvs[currentCV], exps[currentExperienceEdit]);
  }
  if (states.jobTitleEdit){
    exps[currentExperienceEdit].job = ctx.message.text;
    api.setExperience(cvs[currentCV], exps[currentExperienceEdit]);
  }
  if (states.startDateEdit){
    exps[currentExperienceEdit].startingDate = ctx.message.text;
    api.setExperience(cvs[currentCV], exps[currentExperienceEdit]);
  }
  if (states.finishingDateEdit){
    exps[currentExperienceEdit].finishingDate = ctx.message.text;
    api.setExperience(cvs[currentCV], exps[currentExperienceEdit]);
  }
  if (states.onCourseEdit){
    exps[currentExperienceEdit].onCourse = ctx.message.text;
    api.setExperience(cvs[currentCV], exps[currentExperienceEdit]);
  }
  if (states.courseCodeEdit){
    edus[currentExperienceEdit].courseCode = ctx.message.text;
    api.setEducation(cvs[currentCV], edus[currentExperienceEdit]);
  }
  if (states.institutionNameEdit){
    api.getEducation(function(res){
      res.institutionName = ctx.message.text
      api.setEducation(cvs[currentCV], res);
    }, cvs[currentCV], edus[currentExperienceEdit].id)
    //edus[currentExperienceEdit].institutionName = ctx.message.text;

  }
  if (states.startingDateStdEdit){
    edus[currentExperienceEdit].startingDate = ctx.message.text;
    api.setEducation(cvs[currentCV], edus[currentExperienceEdit]);
  }
  if (states.finishingDateStdEdit){
    edus[currentExperienceEdit].finishingDate = ctx.message.text;
    api.setEducation(cvs[currentCV], edus[currentExperienceEdit]);
  }
  if (states.stillEnrolledEdit){
    edus[currentExperienceEdit].stillEnrolled = ctx.message.text;
    api.setEducation(cvs[currentCV], edus[currentExperienceEdit]);
  }


  if (states.skillEdit){
    console.log(currentKnowledgeEdit)
    knw[currentKnowledgeEdit].skill = ctx.message.text;
    api.setSkills(cvs[currentCV], knw[currentKnowledgeEdit]);
  }
  if (states.levelEdit){
    knw[currentExperienceEdit].level = ctx.message.text;
    api.setSkills(cvs[currentCV], knw[currentExperienceEdit]);
  }






  if (states.workingEdit){
    jbs[currentJobsEdit].working = ctx.message.text;
    api.setFutureJob(cvs[currentCV], jbs[currentJobsEdit]);
  }
  if (states.preferredPositionEdit){
    jbs[currentJobsEdit].preferredPosition = ctx.message.text;
    api.setFutureJob(cvs[currentCV], jbs[currentJobsEdit]);
  }
  if (states.employmentStatusEdit){
    if (jbs.length > 0){
      jbs[currentJobsEdit].employmentStatus = ctx.message.text;
      api.setFutureJob(cvs[currentCV], jbs[currentJobsEdit]);
    }

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
  resetStates();
})

bot.startPolling();
