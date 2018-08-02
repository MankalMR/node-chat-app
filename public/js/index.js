function chatApp () {
  const socket = io();
  const _vars = {
    msgInput: '.js-message__input',
    msgBtn: '.js-publishmsg__btn'
  },
  _private = {

    publishMessage: function publishMessage (e) {
      const $messageInput = $(_vars.msgInput);
      e.preventDefault();

      socket.emit('createMessage', {
        from: 'Manu',
        text: $messageInput.val()
      }, function () {
        console.log('Got it!');
      });

      $messageInput.val(''); //reset the message input to empty value
    }
  },
  publicMembers = {
    init: function init () {

      socket.on('connect', function () {
        console.log('Connected to Server!');
      });

      socket.on('disconnect', function () {
        console.log('Server Disconnected!');
      });

      socket.on('newMessage', function (data) {
        const source = document.getElementById('message-card__template').innerHTML;
        const template = Handlebars.compile(source);
        const messageCardHtml = template(data);
        $('.chat__messages').append(messageCardHtml);
      });

      $(_vars.msgBtn).on('click', _private.publishMessage);

      $(_vars.msgInput).keyup(function (e) {
        if (e.which === 13) {
          $(_vars.msgBtn).trigger('click');
        }
      });
    }
  };

  return publicMembers;
};

chatApp().init();