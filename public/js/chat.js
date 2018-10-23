function chatApp () {
  const socket = io();
  const _vars = {
    msgInput: '.js-message__input',
    msgBtn: '.js-publishmsg__btn',
    locBtn: '.js-publishloc__btn'
  },
  _private = {
    processTemplate: function processTemplate (templateId, targetIdOrClass, data, replaceOrAppend) {
      const source = document.getElementById(templateId).innerHTML;
      const template = Handlebars.compile(source);
      const generatedHTML = template(data);
      if (replaceOrAppend === 'R') {
        $(targetIdOrClass).html(generatedHTML);
      } else {
        $(targetIdOrClass).append(generatedHTML);
      }
    },
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
        var params = $.deparam(window.location.search);

        socket.emit('joinRoom', params, function (err) {
          if (err) {
            alert(err);
            window.location.href = '/';
          } else {
            console.log('Credentials OK!');
          }
        });
      });

      socket.on('disconnect', function () {
        console.log('Server Disconnected!');
      });

      //whenever user list is updated, like joining or leaving
      socket.on('updateUserList', function (users) {
        _private.processTemplate('user-list__template', '.population__list', users, 'R');
      });

      socket.on('newMessage', function (data) {
        _private.processTemplate('message-card__template', '.chat__messages', data);
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