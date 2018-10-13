function chatApp () {
  const socket = io();
  const _vars = {
    msgInput: '.js-message__input',
    msgBtn: '.js-publishmsg__btn',
    locBtn: '.js-publishloc__btn'
  },
  _private = {

    publishMessage: function publishMessage (e) {
      const $messageInput = $(_vars.msgInput);
      e.preventDefault();

      socket.emit('createMessage', {
        from: 'Manu',
        text: $messageInput.val()
      }, function () {
          $messageInput.val(''); //reset the message input to empty value
      });
    },
    publishLocation: function publishLocation (e) {
      var $locationBtn = $(_vars.locBtn);

      e.preventDefault();

      if (!navigator.geolocation) {
        console.log('Geolocation not supported by browser!');
      } else {
        $locationBtn.attr('disabled', 'disabled').html($locationBtn.data('btn-waiting'));
      }

      navigator.geolocation.getCurrentPosition(function (position) {
        $locationBtn.removeAttr('disabled').html($locationBtn.data('btn-default'));
        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, function () {
        $locationBtn.removeAttr('disabled').html($locationBtn.data('btn-default'));
        console.log('Unable to fetch lcoation information!');
      });
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

      //bind events
      $(_vars.msgBtn).on('click', _private.publishMessage);
      $(_vars.locBtn).on('click', _private.publishLocation);

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