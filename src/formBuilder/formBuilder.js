(function (angular) {

    'use strict';

    angular
        .module('mgr.formBuilder', [
            'mgr.formBuilder.field'
        ])
        .directive('mgrFormBuilder', formBuilder);

    function formBuilder() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                formName: '='
            },
            templateUrl: 'formBuilder/formBuilder.html',
            bindToController: true,
            controllerAs: 'formBuilderCtrl',
            controller: function () {

                var formBuilderCtrl = this;

                formBuilderCtrl.formName =
                    formBuilderCtrl.formName === undefined ?
                    'form_' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
                    : formBuilderCtrl.formName;


                formBuilderCtrl.submit = function(){

                    if(!formBuilderCtrl.model.submit){
                        return false;
                    }

                    var data = {};
                    Object
                        .keys(formBuilderCtrl.model.attr)
                        .forEach(function (key) {
                            data[key] = formBuilderCtrl.model.attr[key].value;
                        });

                    formBuilderCtrl.model.submit(data);
                };

                formBuilderCtrl.rules = {
                    required: {
                        type: 'invalid',
                        message: 'You are doing it wrong',
                        rule: function (form, field) {
                            return field.$dirty && field.$error.required;
                        }
                    }
                };

                Object
                    .keys(formBuilderCtrl.model.attr)
                    .forEach(function (key) {

                        formBuilderCtrl.model.attr[key].name = key;

                        if (formBuilderCtrl.model.attr[key].validators) {

                            for (var i = 0; i < formBuilderCtrl.model.attr[key].validators.length; i++) {
                                var ruleName = formBuilderCtrl.model.attr[key].validators[i];

                                if (typeof ruleName === 'string') {

                                    if (formBuilderCtrl.model.rules[ruleName]) {
                                        formBuilderCtrl.model.attr[key].validators[i] = formBuilderCtrl.model.rules[ruleName];
                                        formBuilderCtrl.model.attr[key].validators[i].method = ruleName;
                                    }
                                    else if (formBuilderCtrl.rules[ruleName]) {
                                        formBuilderCtrl.model.attr[key].validators[i] = formBuilderCtrl.rules[ruleName];
                                        formBuilderCtrl.model.attr[key].validators[i].method = ruleName;
                                    }

                                }
                            }
                        }
                    });
            }
        };
    }

})(angular);