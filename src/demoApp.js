(function (angular) {

    'use strict';

    angular
        .module('demoApp', [
            'mgr.formBuilder'
        ])
        .controller('demoCtrl', demoCtrl);

    demoCtrl.$inject = [];

    function demoCtrl() {
        this.model = {
            url: 'sign-in',
            submit: function (data) {
                console.log("submit", data)
            },
            rules: {
                email: {
                    type: 'invalid',
                    message: 'Email error',
                    rule: function (form, field) {
                        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                        return field.$dirty && !re.test(field.$modelValue);
                    }
                }
            },
            attr: {
                identifier: {
                    type: 'text',
                    attr: {placeholder: 'Ваш email или номер телефона'},
                    validators: ['required', 'email']
                },
                gender: {
                    type: 'select',
                    value: 'man',
                    options: [{
                        name: 'Man',
                        value: 'man'
                    }, {
                        name: 'Woman',
                        value: 'woman'
                    }],
                    attr: {placeholder: 'Ваш email или номер телефона'},
                    validators: ['required']
                },
                password: {
                    type: 'password',
                    attr: {placeholder: 'Ваш пароль'},
                    validators: ['required']
                }
            },
            buttons: {
                submit: {
                    text: "Войти"
                }
            }
        };
    }

})(angular);