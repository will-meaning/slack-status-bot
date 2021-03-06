if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const Botkit = require('Botkit');
const async = require('async');

const controller = Botkit.slackbot({
  debug: true,
});

const bot = controller.spawn({
  token: process.env.token
}).startRTM();

controller.hears(['check_status'], 'direct_message,direct_mention', function(bot, message) {

  const exclude_users = []

  bot.api.users.list({}, function(err, res) {
    async.each(res.members, function(member, callback){
      if(!member.deleted && member.profile.status_text != "" && exclude_users.indexOf(member.profile.display_name) == -1){
        bot.reply(message, `${member.profile.display_name}さん：${member.profile.status_emoji}：${member.profile.status_text}`);
      }
    });
  });

});
