(function (angular) {

    'use strict';

    angular
        .module('mgr.formBuilder.field', [
            'mgr.validation'
        ])
        .directive('mgrFormBuilderField', formBuilderField);

    formBuilderField.$inject = ['$compile', '$parse'];

    function formBuilderField($compile, $parse) {

        function generateField(field) {

            field.HTML = '';

            if (['text', 'email', 'password', 'number'].indexOf(field.type) !== -1) {
                field.HTML += '<input type="' + field.type + '" ';
            }
            else if (['select', 'textarea'].indexOf(field.type) !== -1) {
                field.HTML += '<' + field.type;
            }

            if (!field.attr.id) {
                field.attr.id = 'field-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            if (!field.attr['class']) {
                field.attr['class'] = '';
            }

            field.attr['class'] += ' form-control';

            Object
                .keys(field.attr)
                .forEach(function (key) {
                    field.HTML += ' ' + key + '="' + field.attr[key] + '"';
                });

            field.HTML += ' name="' + field.name + '"';
            field.HTML += ' ng-model="formBuilderFieldCtrl.field.value"';

            if (field.validators) {

                field
                    .validators
                    .forEach(function (item) {
                        if (typeof item === 'string') {
                            field.HTML += ' ' + item;
                        } else if (item instanceof Array) {
                            field.HTML += ' ' + item[0] + '="' + item[1] + '"';
                        } else if (typeof item === 'object') {
                            field.HTML += ' ' + item.method;
                        }
                    });
            }

            if (['text', 'email', 'password', 'number'].indexOf(field.type) !== -1) {
                field.HTML += '/>';
            }
            else if (['select', 'textarea'].indexOf(field.type) !== -1) {

                if (field.type === 'select') {
                    if (field.ngOptions) {
                        field.HTML += ' ng-options="' + field.ngOptions + '"';
                    } else {
                        field.HTML += ' ng-options="item.value as item.name for item in formBuilderFieldCtrl.field.options"';
                    }
                }

                field.HTML += '></' + field.type + '>';
            }

        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                field: '=',
                form: "=",
                templateUrl: '=',
                templatePath: '='
            },
            templateUrl: function (el, attr){

                if (attr.templateUrl) {
                    return attr.templateUrl;
                }

                return 'formBuilder/formBuilderField/formBuilderField.html';
            },
            bindToController: true,
            controllerAs: 'formBuilderFieldCtrl',
            link: function ($scope, $elm) {

                generateField($scope.formBuilderFieldCtrl.field);

                function repl(attr) {

                    if (!$scope.formBuilderFieldCtrl.field[attr]) {
                        return false;
                    }

                    var fieldMarker = $elm[0].getElementsByClassName('field-marker-' + attr)[0];

                    if (!fieldMarker) {
                        return false;
                    }
                    var $fieldMarker = angular.element(fieldMarker);

                    var $field = angular.element($scope.formBuilderFieldCtrl.field[attr]);

                    $fieldMarker.replaceWith($field);
                    $compile($field)($scope);
                }

                repl('beforeHTML');
                repl('HTML');
                repl('afterHTML');

            },
            controller: function () {

            }
        };
    }

})(angular);