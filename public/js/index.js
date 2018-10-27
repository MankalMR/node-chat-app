function loginChatApp () {
  const _vars = {
    submitBtn: '.js-join-room__btn',
    displayName: '.js-displayname__input',
    roomName: '.js-roomname__input',
    userInfoForm: '#userInfo'
  },
  _private = {
    submitUserInfo: function submitUserInfo (e) {
      e.preventDefault();

      var displayNameUC = $(_vars.displayName).val().toUpperCase(),
          roomNameUC = $(_vars.roomName).val().toUpperCase();

      $(_vars.displayName).val(displayNameUC);
      $(_vars.roomName).val(roomNameUC);

      $(_vars.userInfoForm).submit();
    }
  },
  publicMembers = {
    init: function init () {
      $(_vars.submitBtn).on('click', _private.submitUserInfo);
    }
  };

  return publicMembers;
}

loginChatApp().init();