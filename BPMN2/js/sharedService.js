var module = angular.module('app');

module.factory('SpinnerService', function ($document, $timeout, $window, $q, DeviceService, LogService) {

    var count = 0;
    var show = function (message) {
        try {
            if (message == null || message == "")
                message = "لطفا شكيبا باشيد";
            if (DeviceService.isMobile() && $window.plugins.spinnerDialog && $window.plugins.spinnerDialog.show) {

                $window.plugins.spinnerDialog.show('', message);
                count++;
            }

            //if (DeviceService.isMobile()) {
            //    cordova.exec(function () { }, null, 'SpinnerDialog', 'show', ["", ""]);
            //}
        }
        catch (Exception) {
            LogService.log(Exception);
        }
    }


    var hide = function () {
        try {
            if (DeviceService.isMobile() && $window.plugins.spinnerDialog && $window.plugins.spinnerDialog.hide) {
                $window.plugins.spinnerDialog.hide();
                count--;
            }

            //if (DeviceService.isMobile() && $window.plugins.spinnerDialog && $window.plugins.spinnerDialog.hide) {
            //    cordova.exec(function () { }, function () { }, 'SpinnerDialog', 'hide', ["", ""]);
            //}

        }
        catch (Exception) {
            LogService.log(Exception);
        }
    }

    var hideall = function () {
        try {
            while (count > 0) {
                hide();
            }
        }
        catch (Exception) {
            alert(Exception);

        }
    }

    return {
        show: show,
        hide: hide,
        hideall: hideall


    }

});

module.factory('NotificationService', function ($rootScope) {
    function getButtonLabels(buttons) {
        var buttonTitles = [];
        angular.forEach(buttons, function (value) {
            buttonTitles.push(value.title);
        });
        return buttonTitles;
    }


    return {
        alert: function (message, title, buttonText, buttonAction) {
            if (navigator && navigator.notification && navigator.notification.confirm) {

                navigator.notification.alert(message,
                function () {
                    $rootScope.$apply(function () {
                        buttonAction();
                    })
                },
                title,
                buttonText);
            }
            else {
                alert(message);
            }
        },
        confirm: function (message, title, buttons, YesIndex, NoIndex) {
            if (navigator && navigator.notification && navigator.notification.confirm) {

                var buttonLabels = getButtonLabels(buttons);
                navigator.notification.confirm(
                message,
                function (buttonIndex) {
                    $rootScope.$apply(function () {
                        buttons[buttonIndex - 1].buttonAction();
                    });
                },
                title,
                buttonLabels
                );
            }
            else {

                var retVal = confirm(message);
                if (retVal == true) {
                    buttons[YesIndex].buttonAction();
                } else {
                    buttons[NoIndex].buttonAction();
                }
            }
        },
        prompt: function (message, title, buttons, OKIndex) {

            if (navigator && navigator.notification && navigator.notification.prompt) {

                var buttonLabels = getButtonLabels(buttons);
                navigator.notification.prompt(
                message,
                function (results) {
                    $rootScope.$apply(function () {
                        buttons[results.buttonIndex - 1].buttonAction(results.input1);
                    });
                },
                title,
                buttonLabels
                );
            }
            else {
                var retVal = prompt(message, "");
                if (retVal != null) {
                    buttons[OKIndex].buttonAction(retVal);
                }
            }
        },
        beep: function () {
            if (navigator && navigator.notification && navigator.notification.beep) {
                navigator.notification.beep();
            }
        },
        vibrate: function () {
            if (navigator && navigator.notification && navigator.notification.vibrate) {
                navigator.notification.vibrate();
            }
        }
    }
});

module.controller("NotificationsControllerSample", function ($scope, LogService, NotificationService) {
    $scope.showAlert = function () {
        NotificationService.alert("You caused an alert.", "Alert", "Ok", function () {
            $scope.message = "You clicked it!"
        })
    };
    $scope.showConfirm = function () {
        NotificationService.confirm("Do you like this?", "Please Confirm"
        , [
        {
            title: "No",
            buttonAction: function () {
                $scope.message = ":-(";
            }
        },
        {
            title: "Yes",
            buttonAction: function () {
                $scope.message = ":-)";
            }
        }
        ]
        );
    };
    $scope.showPrompt = function () {
        NotificationService.prompt("Please enter your name", "Enter Name",
        [
        {
            title: "Cancel",
            buttonAction: function (input) {
                $scope.message = input;
            }
        },
        {
            title: "Ok",
            buttonAction: function (input) {
                $scope.message = input;
            }
        }
        ]);
    };
    $scope.causeBeep = function () {
        NotificationService.beep();
    };
    $scope.causeVibrate = function () {
        NotificationService.vibrate();
    };
});

module.factory('ErrorService', function (LogService, NotificationService) {

    function showError(userMessage, logMessage) {
        LogService.log(logMessage);
        NotificationService.alert(userMessage, "خطا", "تاييد");
    }

    function showInternetAccessError(logMessage) {
        showError('خطا در دانلود اطلاعات.' + '\n' + 'لطفا ارتباط دستگاه خود با اينترنت را چك كرده و دوباره امتحان نماييد.', logMessage);
    }

    return {
        showError: showError,
        showInternetAccessError: showInternetAccessError
    };

});

module.factory('LogService', function () {

    function log(msg) {
        console.log("ShamChiDarim:" + new Date() + "::" + msg);
    }

    return {
        log: log
    };

});

module.factory('DeviceService', function (LogService) {

    function isMobile(msg) {
        LogService.log(navigator.userAgent);
        return navigator.userAgent.match(/Android|webOS|iPhone|iPod|iPad|BlackBerry/i) !== null;
    }

    return {
        isMobile: isMobile
    };

});


module.service('CordovaService', ['$document', '$timeout', '$window', '$q', 'DeviceService',
function ($document, $timeout, $window, $q, DeviceService) {

    var defer = $q.defer();

    this.ready = defer.promise;

    // Backup in the case that we did not received the event
    // This seemed to be necessary with some versions of Cordova
    // when testing via 'cordova serve' in a web browser
    // but when on-device the event is received correctly
    var timoutPromise = $timeout(function () {
        if (!DeviceService.isMobile() || $window.cordova) {
            defer.resolve($window.cordova);
        } else {
            defer.reject("Cordova failed to load");
        }
    }, 1200);

    angular.element($document)[0].addEventListener('deviceready', function () {
        $timeout.cancel(timoutPromise);
        defer.resolve($window.cordova);
    });
}
]);