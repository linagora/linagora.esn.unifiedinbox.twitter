const Twitter = require('twit');
const q = require('q');

module.exports = {
  getDirectMessages,
  getMentions
};

/////

function getMentions(config, options) {
  return q.ninvoke(new Twitter(config), 'get', '/statuses/mentions_timeline', options).then(data => ({ messages: _formatTweets(data[0]) }));
}

function getDirectMessages(config, options) {
  const twitterClient = new Twitter(config);

  return q.ninvoke(twitterClient, 'get', '/direct_messages/events/list', options).then(data => {
    const listResult = data[0];
    const messages = _formatDirectMessages(listResult.events, options);
    const userIds = new Set(messages.reduce((a, b) => ([...a, [b.author, b.rcpt]]), []));

    return _hydrateUsers(twitterClient, userIds).then(hydratedUsers => {
      messages.forEach(message => {
        message.author = hydratedUsers.get(message.author);
        message.rcpt = hydratedUsers.get(message.rcpt);
      });

      return { messages, next_cursor: listResult.next_cursor };
    });
  });
}

function _formatTwitterUser(object) {
  if (object) {
    return {
      id: object.id,
      displayName: object.name,
      avatar: object.profile_image_url_https,
      screenName: '@' + object.screen_name
    };
  }
}

function _formatTweets(tweets) {
  return tweets.map(tweet => ({
    id: tweet.id_str,
    author: _formatTwitterUser(tweet.user || tweet.sender),
    rcpt: _formatTwitterUser(tweet.recipient),
    date: new Date(tweet.created_at),
    text: tweet.text,
    type: tweet.sender ? 'directMessage' : 'tweet'
  }));
}

function _formatDirectMessages(direct_messages, options) {
  return direct_messages.map(direct_message => ({
    id: direct_message.id,
    author: direct_message.message_create.sender_id,
    rcpt: direct_message.message_create.target.recipient_id,
    date: new Date().setTime(direct_message.created_timestamp),
    text: direct_message.message_create.message_data.text,
    type: 'directMessage',
    sentbyme: options.account_id === direct_message.message_create.sender_id,
    entities: direct_message.message_create.message_data.entities,
    attachment: direct_message.message_create.message_data.attachments
  }));
}

function _hydrateUsers(twitterClient, userIds) {
  return q.ninvoke(twitterClient, 'get', '/users/lookup', {user_id: [...userIds]})
    .then(data => new Map(data[0].map(profile => ([profile.id_str, _formatTwitterUser(profile)]))));
}
