(function () {
    'use strict';
    var module = angular.module('app', ['onsen', 'ngCordova', 'ngSanitize', 'ngStorage']);
    module.value('isPro', { value: false });;

    module.controller('AppController', function ($scope, $categories, NotificationService, $localStorage, $filter, isPro, $location, $anchorScroll) {
        $scope.$storage = $localStorage;
        if ($scope.$storage.lastRun == undefined) {
            var n = Number($filter('date')(Date.now(), "yyMMddHHmmss"));
            if (n % 2 != 0) {
                n += 1;
            }
            $scope.$storage.lastRun = n;
        }
        else {
            var m = $scope.$storage.lastRun;
            var n = Number($filter('date')(Date.now(), "yyMMddHHmmss"));
            if (m % 2 == 0) {
                if (n % 2 != 0) {
                    n += 1;
                }
            }
            else {
                if (n % 2 == 0) {
                    n += 1;
                }
            }
            $scope.$storage.lastRun = n;
        }

        isPro.value = $scope.$storage.lastRun % 2 != 0;
        isPro.value = false;

        ons.ready(function () {
            ons.setDefaultDeviceBackButtonListener(function () {
                ons.notification.confirm({
                    messageHTML: "<p style='direction:rtl;text-align:right'>" + "مي‌خواهيد از برنامه خارج شويد؟" + "</p>",
                    title: "تاييد",
                    buttonLabels: ['خير', 'بله'],
                    callback: function (index) {
                        if (index === 1) { // OK button
                            navigator.app.exitApp();
                        }
                    }
                });


            });

        });

    });

    module.controller('MainController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService) {
    });

    module.controller('CategoryController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $categories, ArraySearchService) {
        $scope.items = $categories.items;


        $scope.showDetail = function (index, id) {
            var selectedItem = ArraySearchService.searchByID($categories.items, id);
            $categories.selectedItem = selectedItem;
            $scope.navi.pushPage('items.html', { title: selectedItem.title });
        };
    });

    module.controller('SearchController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $categories, isPro, ArraySearchService) {
        if (isPro.value) {
            for (var i = 0; i < $categories.items.length; i++) {
                for (var j = 0; j < $categories.items[i].items.length; j++) {
                    $categories.items[i].items[j].pro = false;
                }
            }
        }
        $scope.items = $categories.items;


        $scope.showDetail = function (categoryindex, symbolindex, id) {
            //var selectedItem = $categories.items[categoryindex];
            //var selectedSymbolItem = selectedItem.items[symbolindex];
            var selectedSymbolItem = ArraySearchService.searchByID2($categories.items, id);

            $categories.selectedSymbolItem = selectedSymbolItem;
            $scope.navi.pushPage('detail.html', { title: selectedSymbolItem.title });
        };
    });

    module.controller('ItemsController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $categories, isPro, ArraySearchService) {
        if (isPro.value) {
            for (var i = 0; i < $categories.items.length; i++) {
                for (var j = 0; j < $categories.items[i].items.length; j++) {
                    $categories.items[i].items[j].pro = false;
                }
            }
        }
        $scope.item = $categories.selectedItem;

        $scope.showDetail = function (index, id) {
            var selectedItem = ArraySearchService.searchByID($categories.selectedItem.items, id);
            $categories.selectedSymbolItem = selectedItem;
            $scope.navi.pushPage('detail.html', { title: selectedItem.title });
        };
    });

    module.controller('DetailController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $categories, isPro, ProService) {
        $scope.isPurchasing = false;
        if ($categories.selectedSymbolItem.pro && !isPro.value) {
            $scope.item = {
                title: $categories.selectedSymbolItem.title,
                image: $categories.selectedSymbolItem.image,
                usage: '',
                pro: true,
                desc: '<p>براي مشاهده بايد نسخه خود را به نسخه حرفه‌اي ارتقا دهيد</p>'
            };
        }
        else {
            $scope.item = $categories.selectedSymbolItem;
        }

        $scope.upgradeToPro = function () {
            $scope.isPurchasing = true;

            ProService.upgrade().then(
                function resolved(resp) {
                    $scope.item = $categories.selectedSymbolItem;
                    for (var i = 0; i < $categories.items.length; i++) {
                        for (var j = 0; j < $categories.items[i].items.length; j++) {
                            $categories.items[i].items[j].pro = false;
                        }
                    }

                    $scope.$apply();
                },
                function rejected(error) {
                    $scope.isPurchasing = false;
                }

                );
        };

    });

    module.controller('MistakesController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $mistakes, isPro, ArraySearchService) {
        if (isPro.value) {
            for (var i = 0; i < $mistakes.items.length; i++) {
                $mistakes.items[i].pro = false;
            }
        }
        $scope.items = $mistakes.items;


        $scope.showDetail = function (index, id) {
            var selectedItem = ArraySearchService.searchByID($mistakes.items, id);
            $mistakes.selectedItem = selectedItem;
            $scope.navi.pushPage('mistakeDetail.html', { title: selectedItem.title });
        };
    });

    module.controller('MistakeDetailController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $mistakes, isPro, ProService) {
        $scope.isPurchasing = false;
        if ($mistakes.selectedItem.pro && !isPro.value) {
            $scope.item = {
                title: $mistakes.selectedItem.title,
                solution: '',
                pro: true,
                problem: '<p>براي مشاهده بايد نسخه خود را به نسخه حرفه‌اي ارتقا دهيد</p>'
            };
        }
        else {
            $scope.item = $mistakes.selectedItem;
        }

        $scope.upgradeToPro = function () {
            $scope.isPurchasing = true;

            ProService.upgrade().then(
                function resolved(resp) {
                    $scope.item = $mistakes.selectedItem;
                    for (var i = 0; i < $mistakes.items.length; i++) {
                        $mistakes.items[i].pro = false;
                    }

                    $scope.$apply();
                },
                function rejected(error) {
                    $scope.isPurchasing = false;
                }

                );
        };
    });

    module.controller('TutorialController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $tutorials, isPro, ArraySearchService) {
        if (isPro.value) {
            for (var i = 0; i < $tutorials.items.length; i++) {
                $tutorials.items[i].pro = false;
            }
        }
        $scope.items = $tutorials.items;


        $scope.showDetail = function (index, id) {
            var selectedItem = ArraySearchService.searchByID($tutorials.items, id);
            //var selectedItem = $tutorials.items[index];
            $tutorials.selectedItem = selectedItem;
            $scope.navi.pushPage('tutorialDetail.html', { title: selectedItem.title });
        };
    });

    module.controller('TutorialDetailController', function ($scope, DeviceService, ErrorService, LogService, NotificationService, SpinnerService, $tutorials, isPro, ProService) {
        $scope.isPurchasing = false;
        if ($tutorials.selectedItem.pro && !isPro.value) {
            $scope.item = {
                title: $tutorials.selectedItem.title,
                pro: false,
                url: 'buypro.html'
            };
        }
        else {
            $scope.item = $tutorials.selectedItem;
        }

        $scope.upgradeToPro = function () {
            $scope.isPurchasing = true;

            ProService.upgrade().then(
                function resolved(resp) {
                    $scope.item = $tutorials.selectedItem;
                    for (var i = 0; i < $tutorials.items.length; i++) {
                        $tutorials.items[i].pro = false;
                    }

                    $scope.$apply();
                },
                function rejected(error) {
                    $scope.isPurchasing = false;
                }

                );
        };

    });

    module.controller("ContactUsController", function ($scope, CordovaService, NotificationService, LogService) {
        $scope.version = "";

        try {
            CordovaService.ready.then(function resolved(resp) {
                cordova.getAppVersion(function (version) {
                    $scope.version = "نسخه " + version;
                    $scope.$apply();
                });
            }, function rejected(resp) {
                throw new Error(resp);
            });
        }
        catch (Exception) {
            LogService.log(Exception);
        }
    });

    module.service("ProService", function (InAppService, $localStorage, $filter, isPro, $q) {

        function upgrade() {
            var deferred = $q.defer();
            try {
                InAppService.init().then(
                    function resolved(resp) {
                        InAppService.subscribe('BPMNPro').then(
                                        function resolved(resp) {

                                            try {
                                                var storage = $localStorage;
                                                var n = Number($filter('date')(Date.now(), "yyMMddHHmmss"));
                                                if (n % 2 == 0) {
                                                    n += 1;
                                                }
                                                storage.lastRun = n;
                                                isPro.value = storage.lastRun % 2 != 0;
                                            }
                                            finally {
                                                deferred.resolve('OK');

                                                //$scope.isPurchasing = false;
                                            }
                                        },
                                        function rejected(error) {
                                            deferred.reject(error);
                                            //$scope.isPurchasing = false;
                                        });
                    },
                    function rejected(error) {
                        deferred.reject(error);
                    });

            }
            finally {
            }
            return deferred.promise;
        }

        return {
            upgrade: upgrade
        };


    });

    module.service("ArraySearchService", function () {
        function searchByID(myArray, id) {
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i].id === id) {
                    return myArray[i];
                }
            }
            return null;
        }

        function searchByID2(myArray, id) {
            for (var i = 0; i < myArray.length; i++) {
                for (var j = 0; j < myArray[i].items.length; j++) {
                    if (myArray[i].items[j].id === id) {
                        return myArray[i].items[j];
                    }
                }
            }
            return null;
        }


        return {
            searchByID: searchByID,
            searchByID2: searchByID2
        }
    });

    module.factory('InAppService', function (LogService, SpinnerService, NotificationService, $q) {

        function successHandler(result, deferred) {
            var strResult = "";
            if (typeof result === 'object') {
                strResult = JSON.stringify(result);
            } else {
                strResult = result;
            }
            SpinnerService.hide();
            var mes = "SUCCESS: \r\n" + strResult;
            //NotificationService.alert(mes, "پيغام", "تاييد");
            LogService.log(mes);
            deferred.resolve('OK');
        }

        function errorHandler(error, deferred) {
            SpinnerService.hide();
            var mes = "خطا: \r\n" + error;
            if (error.indexOf('response: 6:Error') > -1) {
                mes = "خطا در ارتباط با ماركت، لطفا لاگين بودن با كاربر خود به بازار، اتصال به اينترنت و عدم استفاده از فيلتر شكن را چك نماييد";
            }
            NotificationService.alert(mes, "خطا", "تاييد");
            LogService.log(mes);
            deferred.reject();
        }

        function init() {
            SpinnerService.show('در حال ارتباط با ماركت');
            var deferred = $q.defer();
            inappbilling.init(function (result) { successHandler(result, deferred) }, function (error) { errorHandler(error, deferred) }, { showLog: true });
            return deferred.promise;
        }

        function buy(productKey) {
            SpinnerService.show('در حال بازكردن پنجره خريد');
            var deferred = $q.defer();
            // make the purchase
            inappbilling.buy(function (result) { successHandler(result, deferred) }, function (error) { errorHandler(error, deferred) }, productKey);
            return deferred.promise;

        }

        // Click on ownedProducts button
        function ownedProducts() {
            SpinnerService.show('در حال دريافت اطلاعات محوصلات خريداري شده');
            var deferred = $q.defer();
            // Initialize the billing plugin
            inappbilling.getPurchases(function (result) { successHandler(result, deferred) }, function (error) { errorHandler(error, deferred) });
            return deferred.promise;
        }

        // Click on Consume purchase button
        function consumePurchase(productKey) {
            SpinnerService.show('در حال مصرف كردن قلم');
            var deferred = $q.defer();
            inappbilling.consumePurchase(function (result) { successHandler(result, deferred) }, function (error) { errorHandler(error, deferred) }, productKey);
            return deferred.promise;
        }

        // Click on subscribe button
        function subscribe(productKey) {
            SpinnerService.show('در حال بازكردن پنجره خريد');
            var deferred = $q.defer();
            // make the purchase
            inappbilling.subscribe(function (result) { successHandler(result, deferred) }, function (error) { errorHandler(error, deferred) }, productKey);
            return deferred.promise;
        }

        // Click on Query Details button
        function getDetails(products) {
            SpinnerService.show('در حال دريافت جزئيات قلم');
            var deferred = $q.defer();
            // Query the store for the product details
            //["Coin", "Pro"]
            inappbilling.getProductDetails(function (result) { successHandler(result, deferred) }, function (error) { errorHandler(error, deferred) }, products);
            return deferred.promise;
        }

        // Click on Get Available Products button
        function getAvailable() {
            SpinnerService.show('در حال دريافت اقلام معتبر براي خريد');
            var deferred = $q.defer();
            // Get the products available for purchase.
            inappbilling.getAvailableProducts(function (result) { successHandler(result, deferred) }, function (error) { errorHandler(error, deferred) });
            return deferred.promise;
        }

        return {
            init: init,
            buy: buy,
            ownedProducts: ownedProducts,
            consumePurchase: consumePurchase,
            subscribe: subscribe,
            getDetails: getDetails,
            getAvailable: getAvailable,
        };

    });


    module.factory('$tutorials', function () {
        var data = {};

        data.items = [

            {
                id: 1,
                title: 'Introduction',
                url: 'preface.html',
                pro: false,
            },
            {
                id: 2,
                title: 'Symbol Overview',
                url: 'overview.html',
                pro: false,
            },
            {
                id: 3,
                title: 'Pool',
                url: 'pool.html',
                pro: true,
            },
            {
                id: 4,
                title: 'Lane',
                url: 'lane.html',
                pro: true,
            },
            {
                id: 5,
                title: 'Task',
                url: 'task.html',
                pro: false,
            },
            {
                id: 6,
                title: 'SubProcess',
                url: 'subProcess.html',
                pro: false,
            },
            {
                id: 7,
                title: 'Call Activity',
                url: 'call.html',
                pro: true,
            },
            {
                id: 8,
                title: 'Adhoc SubProcess',
                url: 'adhoc.html',
                pro: true,
            },
            {
                id: 9,
                title: 'Event Subprocess',
                url: 'eventSub.html',
                pro: true,
            },
            {
                id: 10,
                title: 'Exclusive Gateway (XOR)',
                url: 'exclusive.html',
                pro: false,
            },
            {
                id: 11,
                title: 'Parallel Gateway (AND)',
                url: 'parallel.html',
                pro: true,
            },
            {
                id: 12,
                title: 'Inclusive Gateway (OR)',
                url: 'inclusive.html',
                pro: false,
            },
            {
                id: 13,
                title: 'EventBased Gateway',
                url: 'eventBasedGateway.html',
                pro: true,
            },
            {
                id: 14,
                title: 'Events Basic Concept',
                url: 'eventConcept.html',
                pro: false,
            },
            {
                id: 15,
                title: 'Message Event',
                url: 'messageEvent.html',
                pro: true,
            },
            {
                id: 16,
                title: 'Timer Event',
                url: 'timerEvent.html',
                pro: true,
            },
            {
                id: 17,
                title: 'Error Event',
                url: 'errorEvent.html',
                pro: true,
            },
            {
                id: 18,
                title: 'Conditional Event',
                url: 'conditionalEvent.html',
                pro: true,
            },
            {
                id: 19,
                title: 'Signal Event',
                url: 'signalEvent.html',
                pro: true,
            },
            {
                id: 20,
                title: 'Termination Event',
                url: 'terminationEvent.html',
                pro: true,
            },
            {
                id: 21,
                title: 'Link Event',
                url: 'linkEvent.html',
                pro: true,
            },
            {
                id: 22,
                title: 'Compensation Event',
                url: 'compensationEvent.html',
                pro: true,
            },
            {
                id: 23,
                title: 'Multiple Event',
                url: 'multipleEvent.html',
                pro: true,
            },
            {
                id: 24,
                title: 'Parallel Event',
                url: 'parallelEvent.html',
                pro: true,
            },
            {
                id: 25,
                title: 'Escalaltion Event',
                url: 'escalaltionEvent.html',
                pro: true,
            },
            {
                id: 26,
                title: 'Cancel Event',
                url: 'cancelEvent.html',
                pro: true,
            },


        ];

        return data;
    });

    module.factory('$mistakes', function () {
        var data = {};

        data.items = [
            {
                id: 1,
                title: 'Implicit or explicit process events',
                problem: 'BPMN specification defines start and end events as optional. However, their usage is highly recommended, since each process starts and ends somewhere! Without explicitly using start and end events, a regular BPMN process might look the process in Figure 7. This modeling approach is undesirable and could lead to misinterpretations.\
<img class="descImage fillImage" src="images/mistakes/diagram-7.jpg" />',
                solution: 'Use start and end events in each process and sub-process. By considering this, the start and end of a process (or sub-process) is more evident and might be additionally explained by process name or by specializing process events.\
Note that if a process includes a start event, an end event is mandatory.\
<img class="descImage fillImage" src="images/mistakes/diagram-8.jpg" />',
                pro: false,
            },
            {
                id: 2,
                title: 'Inadequate event naming',
                problem: 'Modelers will commonly name start and end events according their role, e.g. “Process start” or “Process end”. Since a start event symbol represents the process start and an end event symbol represents the process end, such naming is redundant.\
<img class="descImage fillImage" src="images/mistakes/diagram-9.jpg" />',
                solution: 'Apply logic when naming events. In this case, because there is no specific event trigger or result, the naming of a generic event can be omitted.',
                pro: false,
            }
            ,
            {
                id: 3,
                title: 'Equal events',
                problem: 'The BPMN specification allows the use of multiple start or end events at the same process level. Beware!. If several events share common naming and symbols, they actually represent a single event. Such a modeling approach might still be useful, since several equal events might reduce the number of process paths and path intersections, thus making it more easy to understand. However, it could lead to misinterpretations, as presented in the next figure.\
<img class="descImage fillImage" src="images/mistakes/diagram-10.jpg" />\
The process in Figure 9 regularly includes two start and two end events. However, a detailed analysis of the process semantics shows that the naming of the process’s events is wrong. Since there are actually two different starts of a process and two different end states of the process, the respective events should be named uniquely (as presented in Figure 10), otherwise someone could misinterpret the process model as having only one start event and one end event, which is wrong. A similar situation appears if a modeler does not name multiple start and end events.',
                solution: 'If a process actually starts by different triggers or ends at different states, the names of the corresponding process events should be unique.\
<img class="descImage fillImage" src="images/mistakes/diagram-11.jpg" />',
                pro: false,
            }
               ,
            {
                id: 4,
                title: 'End event vs. Terminate event',
                problem: 'Modelers commonly over-use terminate end events instead of using simple end events, because they perceive a terminate end event as a “stronger” end of a process. This is partially true, but the devil is hidden in the detail! For example, the interpretation of the process, which is presented on Figure 13 is the following: The process first performs task 1 and then continues in both directions (parallel split), where task 3 is performed several times on different data sets (task 3 uses the multiple-instances marker “|||”).\
The process is terminated when it reaches the terminate-end event. A terminate end event means that if one of  the paths reaches an end, all other process paths (currently performing activities and activities which are waiting to be performed) are ended immediately. This could correspond to a real-life process situation, but it is very unlikely.\
Most commonly, a process finishes successfully once all started process activities have finished, and a process will be terminated only if an unplanned event occurs (e.g. an exception).\
<img class="descImage fillImage" src="images/mistakes/diagram-12.jpg" />',
                solution: 'Most commonly, a process modeler should use other end events (e.g. a generic end event), even if a process defines several end states (e.g. a successful and unsuccessful process end). When used this way an end event will not stop the execution of the remaining process paths or activities.\
<img class="descImage fillImage" src="images/mistakes/diagram-13.jpg" />',
                pro: true,
            }
               ,
            {
                id: 5,
                title: 'Missing Sequence flows',
                problem: 'When modeling multiple pools (e.g. in business-to-business situations, where two or more processes interact), a common mistake is when activities in a Pool are not connected to sequence flows. The most frequent reason for this mistake is that a modeler may treat multiple pools as a single process and incorrectly interpret messages flows as way of indicating a sequence of activities. This kind of process model  is not valid because the sequence of activities  has not been clearly defined.\
<img class="descImage fillImage" src="images/mistakes/diagram-4.jpg" />',
                solution: 'The modeler should always model and validate individual pools,  and bear in mind that a pool cannot contain more than  one process. This means that all flow elements in a pool should be connected using sequence flows as defined in figure 2 and figure 3.\
<img class="descImage fillImage" src="images/mistakes/diagram-5.jpg" />\
<img class="descImage fillImage" src="images/mistakes/diagram-2.jpg" />\
<img class="descImage fillImage" src="images/mistakes/diagram-3.jpg" />\
',
                pro: true,
            }
               ,
            {
                id: 6,
                title: 'Incorrect Usage of Sequence Flows',
                problem: 'Another common problem when modeling multiple pools is that a modeler may treat a set of pools as a single pool with multiple lanes. In this case, a modeler uses sequence flows between pools. The end result will be an incorrect model (see figure 2) of a single process that spreads over the boundaries of the pool.\
<img class="descImage fillImage" src="images/mistakes/diagram-6.jpg" />\
<img class="descImage fillImage" src="images/mistakes/diagram-2.jpg" />\
',
                solution: 'The most common solution to this problem is to exchange pools with Lanes within a single model, as presented below. If several pools need to be used (perhaps when several independent processes exist), the solution to Mistake `Missing Sequence flows` should be used.\
<img class="descImage fillImage" src="images/mistakes/diagram-72.jpg" />\
',
                pro: true,
            },
        {
            id: 7,
            title: 'Improper use of Lanes',
            problem: 'Sometimes a modeler  may incorrectly treat a lane as a pool, thereby representing individual processes within separated  lanes. This is wrong, because a lane is just a “activity-classifying mechanism”. The figure below shows this mistake.\
<img class="descImage fillImage" src="images/mistakes/diagram-82.jpg" />\
',
            solution: 'The most common solution to this problem is similar to the previous one; define a single process out of two (shown in Figure 9).  This means that the redundant start and end events are removed from the model. In the case that several pools are actually required (several independent processes exist), the solution to Mistake `Missing Sequence flows` should be used.\
<img class="descImage fillImage" src="images/mistakes/diagram-92.jpg" />\
Nevertheless it is important to mention that it is not syntactically wrong if a single process has two start or two end events! For example, several different events could start a process in different places, for instance; an asynchronous start of a process through a message trigger, or the periodical start of a process every morning. On the other hand, it is common that a process ends at different end states (e.g. “successful treatment” or “unsuccessful treatment”).\
',
            pro: true,
        },
                {
                    id: 8,
                    title: 'Using Sub-processes Instead of Tasks',
                    problem: 'BPMN modelers commonly misunderstand the two main activity types: a sub-process and tasks. They perceive a task as a “simple work unit” and a sub-process as a “more complex work unit”. This is partially true, however, let’s see a counterexample. In a real-world business process, the relative complexity of activities can be perceived or measured.\
However, complexity is not a decision-making  factor when selecting a sub-process or a task in a process model. A modeler should be aware that a sub-process should be only used if its details can be defined in terms of the underlying tasks or sub-processes.  This means that a complex real world activity should be modeled as a task if it cannot be additionally decomposed into sub-elements, whereas a simple activity can be modeled as a sub-process if a modeler decides to additionally decompose it.\
<img class="descImage fillImage" src="images/mistakes/diagram-53.jpg" />\
',
                    solution: 'Use a sub-process if you intend to decompose it into sub-elements. Use a task if you are not planning on describing sub-elements.\
',
                    pro: true,
                }
               ,
            {
                id: 9,
                title: 'Using Loops Instead of Multiple Instances',
                problem: 'It is often unclear which type of Activity loop should be use: a standard loop or a multiple instance marker. Furthermore, the BPMN 2.0 specification divides multiple instance activities into ones that are sequential or parallel .\
<img class="descImage fillImage" src="images/mistakes/diagram-63.jpg" />\
',
                solution: 'Use the following rules when modeling activity loops:\
<ul>\
<li>Use a standard loop marker (curved arrow) when an activity has looping behavior, which means that it loops for as long as the underlying looping condition is true. This condition must be evaluated for every loop iteration, and may be evaluated at the beginning or at the end of the iteration. In addition, a numeric cap can be optionally specified. If this occurs, then the number of iterations may not exceed its cap. The loop iteration condition can be explicitly defined with an intermediate conditional event (as presented in figure 7).</li>\
<li>Use a multi-instance marker (three vertical or horizontal lines) when several activity instances are needed. This means that an Activity is performed many times with different data sets. For example, when a company’s manager receives reports from his employees, he or she will need to evaluate them many times, each time with different data. In case this work can be done in parallel, and the activity Multi-Instance marker for parallel instances should be used (three vertical lines). Conversely, if the work can be performed only sequentially, the activity Multi-Instance marker for sequential instances should be used (three horizontal lines).</li>\
</ul>\
<img class="descImage fillImage" src="images/mistakes/diagram-73.jpg" />\
',
                pro: true,
            },
                {
                    id: 10,
                    title: 'Addressing Multiple Lanes',
                    problem: 'Activities are commonly classified into different lanes according to who performs or is responsible for them. Based on this presumption, a modeler might incorrectly model a business process in the following way (figure 8):\
<ul><li>Task 1 is performed by Person B,</li>\
<li>Task 2 is performed by Person A,</li>\
<li>Task 3 is performed by both persons.</li></ul>\
This approach is wrong. A flow element (activity, gateway and event) can be positioned only within a lane and not between lanes.\
<img class="descImage fillImage" src="images/mistakes/diagram-83.jpg" />\
',
                    solution: 'The most common solution in this case is to create two of the same activities,  positioned into separate lanes (figure 9). In this case, the outgoing flow from the previous task (Task 2) is split into two flows, leading to  Task 3 for both individuals. The split of flows can be uncontrolled (without a gateway, as presented in figure 9) or controlled (with a parallel gateway). Note that some BPMN tools do not allow several activities to be named identically. In this case, an descriptive label can be added to the task’s name (e.g. Person A’s Task 3).\
<img class="descImage fillImage" src="images/mistakes/diagram-93.jpg" />\
',
                    pro: true,
                },
                {
                    id: 11,
                    title: 'Message Events Vs. Message Tasks',
                    problem: '<p>Before the BPMN 2.0 specification, there was never any confusion between tasks and events. Tasks were treated as atomic activities in a process flow, which could not be broken down into finer detail, whereas events represented something that “happened” in the process and required a reaction.</p>\
<p>However, since BPMN 2.0, different types of tasks can now be defined,  enabling modelers to represent more types of behavior. Among these, the new send and receive types have now blurred the line between tasks and events. In this article, we will discuss the differences between message events and the send and receive tasks.</p>\
<p><b>Message flow in tasks and events</b></p><hr/>\
<p>In essence, message events are either throwing or catching and can:</p>\
<ul><li>Start a process (message start event), which creates a new instance when the message arrives</li>\
<li>End a process (message end event), which ends the current process instance when the message is sent</li>\
<li>Resume a process flow (message intermediate catch event) when the message arrives</li>\
<li>Send a message (message intermediate throw event) somewhere between the start and end of a process</li></ul>\
<p>Finally, message intermediate catch events may be placed to any location of an activity boundary to represent exception or compensation handling.</p>\
<p>While BPMN 1.x mostly allowed the message flows to be connected straight into an abstract task, it did not exactly mimic the behavior of events.\
It merely allowed that a message MAY be sent to, or received by, an activity in addition to the work it originally performed. With the introduction of BPMN 2.0 send and receive tasks, we can define that a task in the process always sends or receives a message. After the message is sent or received, the task is considered complete and no other work can be performed.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-14.jpg" />\
<p>While there are certain specifics, there are fundamentally no differences between message events and send or receive tasks. Bother have their advantages and disadvantages, which we will look at now:</p>\
<p><b>Benefits of using send and receive tasks</b></p><hr/>\
<p>Whilst activities usually represent a work performed by the participant, in the case of send and receive tasks, such activities merely send or receive a message and as soon as this happens, they are considered finished. It is important to stress that such activities still define the presence of a performer, whereas events do not.</p>\
<p>Standard activities enable the modeller to add different markers, which can represent either multiple parallel, sequential or looping types of an activity. Such markers can also be used in case of send or receive tasks, additionally describing the advanced behavior of a task.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-24.jpg" />\
<p>The image above represents a behavior, where different data sets influence the content of the message, thus several sequential instances of task are produced. Such behavior would be difficult to represent with the usage of message events.</p>\
<p>Another benefit of using send and receive tasks over the message events is the capability of attaching a boundary event to a task. As such, we can handle several exceptions that could occur whilst sending or receiving a message.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-34.jpg" />\
<p>As can be seen from the example above, we defined several exception flows, in case waiting for a response takes more than an hour or if an internal software error occurs. If there is no such exception, the message is received and the next activity is performed. Similar boundary events can also be applied to a send activity.</p>\
<p>Same as message start event, send activity can also instantiate a process. To this end, a slightly different symbol is used, namely an envelope surrounded by a circle.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-44.jpg" />\
<p>By using a receive task that instantiates a process, we can define a syntactically sound model without needing to additionally define a start event.</p>\
<p><b>Benefits of using intermediate message events</b></p><hr/>\
<p>When defining a flow of a process there are several situations where send and receive activities cannot be used. In this case, the intermediate message events are preferred.</p>\
<p>Firstly, if we wanted to model a situation where receiving a message can cause an exception when performing an activity, only interrupting boundary intermediate message catch events can be used.</p>\
<p>Secondly, if we want to represent a situation, when the receiving of a message does not necessarily end an activity, non-interrupting boundary intermediate message catch events can be used.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-54.jpg" />\
<p>The above example shows a user activity of writing a report, which can be interrupted by receiving an important update. In this case, updating the files is performed and writing a report is instantiated anew.\
However, in case of receiving an invitation to a meeting, a note is written by the performer of the activity while the main activity of writing a report is not interrupted. Such behavior could not be represented by using only send and receive tasks.</p>\
<p><b>Common mistakes</b></p><hr/>\
<p>A common mistake when using send or receive activities is their labeling. As already stated, send activities explicitly define that a message should be sent and no further task can be performed in the scope of such activity. Figure 6 represents a common mistake when labeling send message activities.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-64.jpg" />\
<p>As can be seen from the example above, an activity is labelled in a way to represent both preparing and sending an answer, which is not in accordance with the BPMN specification.</p>\
<p>The correct solution would be to split the “Prepare an answer and notify the user” into two separate tasks, one for preparing an answer and the other for sending it.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-74.jpg" />\
<p>In this case, the first activity in the “Pool 1″ performs a certain work (i.e. “prepare an answer”) and the second activity actually sends this answer to the “Pool 2″, where it is received in the form of a receive task, named “Receive the message”. After the message is received, task “Analyze the content” performs the corresponding work.</p>\
<p>Another common mistake is also when modelling the communication between several lanes in a pool. Intermediate message catch and throw events are tightly coupled with message flows. The latter are only used to represent the communication between two pools and are as such not appropriate to be used between lanes of the same pool. The same incorrect usage has been widespread when using send and receive tasks as well.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-84.jpg" />\
<p>In the example above, the intermediate message throw event “Notify lane2″ actually throws a message flow and continues to the “Receive message from lane1″ intermediate catch message event, where it waits for an incoming message flows, which never arrives. A similar situation occurs in case of send task “Notify lane2″ and receive task “Receive response from lane1″.</p>\
<p>In accordance with the BPMN 2.0 specifications, the communication between pools can be easily represent by using only the sequence flows, as represented in Figure 9.</p>\
<img class="descImage fillImage" src="images/mistakes/diagram-94.jpg" />\
<p><b>Conclusion</b></p><hr/>\
<p>This article addresses the differences between message events and send or receive tasks. While the main purpose of both types of elements is to represent a communication between two or more pools using a message flow, several distinctive differences between the two can be noted.</p>\
<p>Firstly, we can attach several different boundary events to send and receive tasks. Furthermore, additional markers can be added to the tasks, to represent standard, sequential or parallel loops. On the other hand, intermediate catching message events can be attached to activities in order to represent an exceptional flow.</p>\
<p>New types of activities enable modellers to more precisely express the behavior of an activity yet can also introduce new mistakes if not used correctly.</p>\
<p>Also, BPMN users are usually more accustomed to seeing intermediate message throw and catch events. The usage of send and receive activities might be ambiguous if they are used solely to represent sending and receiving message flows, respectively.</p>\
',
                    solution: 'Read above article',
                    pro: true,
                }
               ,
        ];

        return data;
    });

    module.factory('$categories', function () {
        var data = {};

        data.items = [
            {
                id: 1,
                titleFa: '‌‌فعاليت',
                title: 'Activity',
                label: '10',
                image: 'SymbolActivities.png',
                desc: '                            <p>Activity (فعاليت) نشان دهنده کاری است که در يك گام از اجرای فرایند انجام می‌شود و مي تواند بصورت Atomic (تك واحدي) یا Compound (مركب) باشد. Activityها می‌توانند یک بار اجرا شده و یا در یک حلقه تکرار شوند.</p>\
                            <p>معمولا از مستطیل برای نشان دادن Activity استفاده می شود برای نشان دادن یک Sub Process از نماد `+` در پايين مرکز مستطيل استفاده مي‌شود</p>',
                items: [

                {
                    id: 10,
                    title: 'Simple Task',
                    image: 'Simple Task.png',
                    desc: 'براي نمايش انجام دادن يك فعاليت ساده استفاده مي شود.',
                    usage: '',
                    pro: false,

                },
                {
                    id: 11,
                    title: 'Service Task',
                    image: 'Service Task.png',
                    desc: 'اين نماد نشان دهنده فراخواني يك سرويس مي باشد. از اين نماد در مدل سازي در BPMSها استفاده مي شود.',
                    usage: '',
                    pro: true,

                },
                {
                    id: 12,
                    title: 'Manual Task',
                    image: 'Manual Task.png',
                    desc: 'اين نماد نشان دهنده فعاليتي است كه خارج از BPMS و به صورت دستي انجام مي شود.',
                    usage: '',
                    pro: false,
                },
                {
                    id: 13,
                    title: 'User Task',
                    image: 'User Task.png',
                    desc: 'نشان دهنده فعاليتي است كه كاربر سيستم بايد انجام دهد. وقتي اجراي فرايند به اين قسمت مي رسد يك كار در كارتابل كاربر ايجاد مي شود. از اين نماد در مدل سازي BPMSها استفاده مي شود.',
                    usage: '',
                    pro: true,
                },
                {
                    id: 14,
                    title: 'Send Task',
                    image: 'Send Task.png',
                    desc: 'اين نماد نشان دهنده فعاليتي است كه منجر به ارسال Message مي شود.',
                    usage: 'لطفا بخش اشتباهات رايج Message Events vs Message Tasks را ببينيد',
                    pro: true,
                },
                {
                    id: 15,
                    title: 'Recieve Task',
                    image: 'Receive Task.png',
                    desc: 'اين نماد نشان دهنده فعاليتي است كه منجر به دريافت Message مي شود.',
                    usage: 'لطفا بخش اشتباهات رايج Message Events vs Message Tasks را ببينيد',
                    pro: true,
                },
                {
                    id: 16,
                    title: 'Business Rule Task',
                    image: 'Business Rule Task.png',
                    desc: 'اين نماد نشان دهنده اجراي يك يا چند Business Rule مي باشد. از اين نماد در مدل سازي BPMSها استفاده مي شود.',
                    usage: '',
                    pro: true,
                },
                {
                    id: 17,
                    title: 'Script Task',
                    image: 'Script Task.png',
                    desc: 'اين نماد نشان دهنده اجراي سيستمي يك فعاليت بر اساس دستورالعمل نوشته شده براي آن مي باشد. از اين نماد در مدل سازي BPMSها استفاده مي شود.',
                    usage: '',
                    pro: true,
                },
                {
                    id: 18,
                    title: 'Call Activity',
                    image: 'Call Activity.png',
                    desc: 'از اين نماد براي فراخواني يك SubProcess استفاده مي شود. از لحاظ عملكرد اجرا كاملا شبيه نماد SubProcess عمل مي كند، يعني بعد از اينكه اجراي فرايند به اين نماد رسيد فرايند آن SubProcess را اجرا كرده با اين تفاوت كه از Call Actvity براي اجراي Sub Processهاي خارج از فرايند جاري و از SubProcess براي اجراي Embeded SubProcessها استفاده مي شود. اين تفاوت بيشتر در مدل سازي BPMSها معني پيدا مي كند.',
                    usage: '',
                    pro: true,
                },
                {
                    id: 19,
                    title: 'Sub Process',
                    image: 'SubProcess.png',
                    desc: 'SubProcessها فعاليت‌هايي هستند كه خود شامل فعاليتهاي ديگر هستند و در آنها از Gateway,Event,Task,SubProcess و ... استفاده مي شود.\
آنها مي توانند به صورتي مجزا تعريف شده تا در فرايندهاي ديگر فراخواني شوند و يا كامل درون يك فرايند براي ايجاد سادگي و سهولت در درك فرايند مدل شوند.',
                    usage: '',
                    pro: false,
                },
                {
                    id: 20,
                    title: 'Event Sub Process',
                    image: 'Event SubProcess.png',
                    pro: true,
                    desc: 'نوعي SubProcess است كه با يك event شروع به كار مي كند.',
                    usage: 'اين نوع SubProcessها مي توانند Interputing يا Non-Intrupting باشند. در صورتي كه Interupting باشد اجراي فرايند اصلي متوقف شده و فرايند درون آنها اجرا مي شود.',
                },
                {
                    id: 21,
                    title: 'Transactional Sub Process',
                    image: 'Transaction.png',
                    pro: true,
                    desc: 'نوعي از SubProcessها است كه تضمين مي كند كه يا اجراي گروهي از فعاليت ها موفق اجرا مي شود و يا در صورتي كه يكي از آنها ناموفق اجرا شد همه فعاليت هاي آن به وضعيت قبلي برگردانده مي شود گويي كه هيچ كدام اجرا نشده اند.',
                    usage: 'براي مثال فرايند انتقال وجه از يك حساب به حساب ديگر را در نظر بگيريد، كه در آن دو فعاليت وجود دارد كم كردن از حساب شما و واريز به حساب طرف مقابل. فرض كنيد در واريز به حساب مقابل خطايي رخ دهد پس بايد كم كردن از حساب شما نيز كنسل شود وگرنه پول از حساب شما كم شده ولي به حساب طرف مقابل واريز نمي شود',
                },
                {
                    id: 22,
                    title: 'Ad-hoc Sub Process',
                    image: 'Adhoc SubProcess.png',
                    pro: true,
                    desc: 'نوعي از SubProcessها هستند كه اجراي فعاليت هاي درون آنها ترتيب خاصي ندارد',
                    usage: '',
                },
                {
                    id: 23,
                    title: 'Loop SubProcess/Task',
                    image: 'Loop SubProcess.png',
                    pro: true,
                    desc: 'براي نمايش دادن اينكه يك فعاليت تا رسيدن به شرايط خاصي، چندين بار در حلقه انجام مي شود استفاده مي گردد',
                    usage: 'لطفا در بخش اشتباهات رايج Using Loops instead of Multiple Instances را مشاهده نماييد',
                },
                {
                    id: 24,
                    title: 'Sequential SubProcess/Task',
                    image: 'Sequential SubProcess.png',
                    pro: true,
                    desc: 'براي نشان دادن اينكه يك فعاليت چندين بار ولي به صورت ترتيبي انجام مي شود استفاده مي گردد',
                    usage: 'لطفا در بخش اشتباهات رايج Using Loops instead of Multiple Instances را مشاهده نماييد',
                },
                {
                    id: 25,
                    title: 'Parallel SubProcess/Task',
                    image: 'Parallel SubProcess.png',
                    pro: true,
                    desc: 'براي نمايش اينكه يك فعاليت به صورت موازي چندين بار انجام مي شود استفاده مي گردد',
                    usage: 'لطفا در بخش اشتباهات رايج Using Loops instead of Multiple Instances را مشاهده نماييد',
                },
                //{
                    //id: 1,
        //    title: 'Compensation Subprocess',
                //    image: 'Compensation Subprocess.png',
                //    pro: true,
                //    desc: '',
                //    usage: '',
                //}
                ]
            },
            {
                id: 3,
                titleFa: 'دروازه‌',
                title: 'Gateway',
                label: '5',
                image: 'SymbolGateway.png',
                desc: '                            <p>\
                                Gateway اجزایی از مدل‌سازی هستند که در جریان فرایند بکار گرفته مي‌شوند تا جریان فرایند را از طریق تصمیم گیری تعيين كنند. آنها Decision (تصميم گيري) ، Forking (منشعب شدن) و Merging (ادغام شدن) و Joining (بهم پيوستن) مسيرها را نشان مي دهند. Gatewayها به صورت لوزی نمايش داده می شوند.\
                            </p><p>در صورتي كه جريان فرايند به آنها وارد شود اصطلاحا "همگرا" و در صورتي كه جريان فرايند از آنها خارج شود اصطلاحا "واگرا" گفته مي شود</p>',
                items: [
                {
                    id: 30,
                    title: 'Exclusive Gateway (XOR)',
                    image: 'Exclusive Gateway.png',
                    pro: false,
                    desc: 'واگرا: اين نماد يك نقطه تصميم گيري است كه مي تواند دو يا بيشتر خروجي داشته باشد ولي تنها يكي از آنها ادامه پيدا مي كند<br\>\
همگرا: براي تركيب كردن و بستن مسيرها استفاده مي شود',
                    usage: '',

                },
                {
                    id: 31,
                    title: 'Inclusive Gateway (OR)',
                    image: 'Inclusive Gateway.png',
                    pro: false,
                    desc: 'اين نماد يك نقطه تصميم گيري است كه مي تواند چندين خروجي داشته باشد و يك يا چند خروجي انتخاب و ادامه پيدا مي كند',
                    usage: '',
                },
                {
                    id: 32,
                    title: 'Complex Gateway',
                    image: 'Complex Gateway.png',
                    pro: true,
                    desc: 'اين نماد يك نقطه تصميم گيري پيچيده است كه زماني از آن استفاده مي كنيم كه نمي توانيم اين نوع تصميم گيري را با نمادهاي ديگر مدل كنيم.',
                    usage: '',
                },
                {
                    id: 33,
                    title: 'Event Based Gateway',
                    image: 'Event Based Gateway.png',
                    pro: true,
                    desc: 'اين نماد فقط به صورت واگرا استفاده مي شود و نشان دهنده اين است كه فقط يكي از مسيرهاي خروجي مي تواند انتخاب شود، ولي نه بر اساس ديتا بلكه بر اساس event (رويدادي) كه اتفاق مي افتد',
                    usage: '',
                },
                //{
                //    title: 'Exclusive Event Based Gateway',
                //    image: 'SymbolActivities.png',
                //    desc: '',
                //    usage: '',
                //},
                {
                    id: 34,
                    title: 'Parallel Gateway (AND)',
                    image: 'Parallel Gateway.png',
                    pro: true,
                    desc: 'واگرا: براي نشان دادن اينكه چندين فعاليت به صورت موازي انجام مي شوند استفاده مي شود<br\>\
همگرا: نشان دهنده اين است كه بايد همه فعاليت هاي موازي به اين نقطه برسند و سپس فرايند مي تواند ادامه پيدا كند',
                    usage: '',

                }
                ],
            },
            {
                id: 4,
                titleFa: 'رويدادها',
                title: 'Events',
                label: '8',
                image: 'SymbolEvent.png',
                desc: 'یک event اتفاقي است که در طی اجرای یک فرایند رخ می دهد و بر جریان فرایند تأثیر می گذارد. آنها می توانند جریان فرایند را شروع (Start)، قطع (Intermediate) یا  پایان (End) دهند.\
<br/> eventها با دایره نشان داده می شوند و ضخامت حاشیه، يك خط بودن يا دوخط بودن، نقطه چين يا خط صاف بودن خطوط انها نشان دهنده نوع event است.\
<br/>در شكل زير مي توانيد آناتومي event را مشاهده نماييد\
<br/><img class="descImage fillImage" src="images/EventAnatomy.png"/>',
                items: [
                    {
                        id: 41,
                        title: 'None Start Event',
                        image: 'Normal Start Event.png',
                        pro: false,
                        desc: 'شروع اجراي يك فرايند را نشان مي دهند و زماني كه رفتار خاصي براي شروع مد نظر نمي باشد از اين نوع event استفاده مي كنيم',
                        usage: '<ul><li>شروع فرايند</li><li>شروع Sub Process</li></ul>',

                    },
                    {
                        id: 42,
                        title: 'Message Start Event',
                        image: 'Message Normal and SubProcess Start Event.png',
                        pro: true,
                        desc: 'فرايند با دريافت يك Message از يك Participant ديگر شروع مي شود',
                        usage: '',
                    },
                    {
                        id: 43,
                        title: 'Timer Start Event',
                        image: 'Timer Normal and SubProcess Start Event.png',
                        pro: true,
                        desc: 'نشان دهنده شروع فرايند در زمان‌هاي خاص يا در موعد مشخص مي باشد',
                        usage: 'مثال: شروع مي تواند  به صورت هر روز ساعت 3، هر فصل، سالانه، روزانه، بعد از گذشت 10 دقيقه،هر 10 دقيقه، 94/05/01 باشد',
                    },
                    {
                        id: 44,
                        title: 'Conditional Start Event',
                        pro: true,
                        image: 'Conditional Normal and SubProcess Start Event.png',
                        desc: 'فرايند زماني كه شرايط مشخص شده صدق كند اجرا مي شود',
                        usage: 'مثال: موجودي كالا در انبار كمتر از حدسفارش شود، چك بالاي 200 ميليون تومان صادر شود',
                    },
                    {
                        id: 45,
                        title: 'Signal Start Event',
                        image: 'Signal Normal and SubProcess Start Event.png',
                        pro: true,
                        desc: 'فرايند با دريافت يك signal از يك فرايند ديگر شروع مي شود. دقت كنيد كه Signal با Message تفاوت دارد. فرسنتده signal مشخص نيست و مي تواند هر فرايند ديگري باشد ولي ارسال كننده و دريافت كننده Message مشخص مي باشند.',
                        usage: 'مثال:درب خودروي شما باز است و هر كسي مي تواند به شما اين موضوع را اطلاع دهد يا همان سيگنال بفرستد و شما با دريافت سيگنال فرايند چك كردن سرقت از خوردو و قفل كردن آن را شروع مي كنيد',
                    },
                    {
                        id: 46,
                        title: 'Multiple Start Event',
                        pro: true,
                        image: 'Multiple Normal and SubProcess Start Event.png',
                        desc: 'نشان مي دهد كه راه‌هاي مختلفي براي شروع فرايند وجود دارد و اتفاق افتادن حداقل يكي از آنها مي تواند فرايند را شروع كنند',
                        usage: 'مثال:فرايند صدور چك مي تواند با درخواست پرداخت يا بعد از محاسبه حقوق يا به صورت ماهانه براي پرداخت ماليات شروع شود',
                    },
                    {
                        id: 47,
                        title: 'Parallel Multiple Start Event',
                        pro: true,
                        image: 'Parallel Normal and SubProcess Start Event.png',
                        desc: 'نشان مي دهد كه راه‌هاي مختلفي براي شروع فرايند وجود دارد و همه آنها بايد اتفاق بيافتد تا فرايند شروع شود ',
                        usage: '',
                    },
                    {
                        id: 48,
                        title: 'Message Intermediate Event',
                        image: 'Message Throw Intermediate Event.png',
                        pro: true,
                        desc: 'نشان دهنده آن است كه Message مي‌تواند ارسال يا دريافت شود. حتي مي‌تواند نشان دهنده اين باشد كه اجراي فرايند تا دريافت يك Message معلق مي شود.',
                        usage: 'مثال ارسال و يا دريافت message: در فرايند فروش، بعد از ارسال پيش فاكتور فرايند منتظر مي ماند تا پيش فاكتور تاييد شده دريافت شود و بعد ادامه پيدا كند.<br/>\
اين event مي تواند در حين فرايند يا به صورت چسبيده به يك SubProcess براي نمايش اتفاق افتادن رويه‌اي خارج از رويه نرمال از جنس Message در اجراي فرايند داخلي به كار رود.',
                    },
                    {
                        id: 49,
                        title: 'Timer Intermediate Event',
                        pro: true,
                        image: 'Timer Throw Intermediate Event.png',
                        desc: 'نشان دهنده انتظار در حين فرايند مي باشد. ',
                        usage: 'مثال: بعد از سفارش پيتزا هر 30 دقيقه با رستوران پيگيري مي كند، يا در فرايند پخت غذا 10 دقيقه قبل از آماده شدن غذا، ميز را مي چينيد<br/>\
اين event مي تواند در حين فرايند يا به صورت چسبيده به يك SubProcess براي نمايش اتفاق افتادن رويه‌اي خارج از رويه نرمال از جنس زمان در اجراي فرايند داخلي به كار رود.',
                    },
                    {
                        id: 50,
                        title: 'Escalation Intermediate Event',
                        image: 'Escalation Throw Intermediate Event.png',
                        pro: true,
                        desc: 'نشان دهنده اين است كه در اجراي فرايند شما به كمك شخص ديگري نياز پيدا مي كند',
                        usage: 'مثال: در فرايند اعطاي وام در صورتي كه مبلغ وام بالا باشد، نياز است تا كارمند مدارك را به همراه مدير خود بررسي نمايد',
                    },
                    {
                        id: 51,
                        title: 'Error Intermediate Event',
                        image: 'Error Throw Intermediate Event.png',
                        pro: true,
                        desc: 'نشان دهنده دريافت خطا و رفع و رجوع كردن آن است',
                        usage: 'اين نماد صرفا چسبيده به SubProcess براي رفع و رجوع خطاهاي داخل آن استفاده مي شود. مثلا فرايند بررسي مدارك درخواست كننده وام را به صورت SubProcess مدل كرده ايد، حال اگر داخل فرايند مدركي ناقص باشد درون فرايند يك خطا رخ مي دهد و نياز است تا از اين نماد استفاده نماييد تا اطلاع رساني به درخواست كننده وام در مورد تكميل مدرك را اطلاع دهيد، توجه كنيد كه مسير عادي SubProcess مرحله بعدي اعطاي وام مي باشد.',
                    },
                    {
                        id: 52,
                        title: 'Cancel Intermediate Event',
                        image: 'Cancel Boundary Intermediate Event.png',
                        pro: true,
                        desc: 'اين نماد تنها با Transaction SubProcessها استفاده مي شود و نشان دهنده مسير جايگزين در صورت Cancel شدن SubProcess مي باشد. ',
                        usage: '',
                    },
                    {
                        id: 53,
                        title: 'Compensation Intermediate Event',
                        image: 'Compensation Throw Intermediate Event.png',
                        pro: true,
                        desc: 'اين نماد براي نشان دادن روش جبران در فرايند استفاده مي شود يا به عبارت ديگر مسير اجراي Plan B را در صورتي كه Plan A محقق نشد نشان مي دهد.',
                        usage: '',
                    },
                    {
                        id: 54,
                        title: 'Conditional Intermediate Event',
                        pro: true,
                        image: 'Conditional Throw Intermediate Event.png',
                        desc: 'در صورتي كه بخواهيم فرايند بعد از محقق شدن شرايط خاصي ادامه پيدا كند از اين نماد استفاده مي كنيم',
                        usage: 'مثال: بعد از اينكه تعداد درخواست هاي كالا به 10 مورد رسيد اقدام به خريد مي نماييم.<br\>\
اين رويداد مي تواند در حين فرايند يا به صورت چسبيده به يك SubProcess براي نمايش اتفاق افتادن رويه‌اي خارج از رويه نرمال با شرايط خاص در اجراي فرايند داخلي به كار رود.',
                    },
                    {
                        id: 55,
                        title: 'Link Intermediate Event',
                        pro: true,
                        image: 'Link Throw Intermediate Event.png',
                        desc: 'براي نمايش ارتباط دو قسمت از فرايند به يكديگر استفاده مي شوند',
                        usage: 'در شرايطي كه فرايند مدل شده بسيار شلوغ شود و خطوط بايد از روي يكديگر رد شوند كه باعث كاهش خوانايي و درك مدل مي شود از اين نماد استفاده مي شود',
                    },
                    {
                        id: 56,
                        title: 'Signal Intermediate Event',
                        image: 'Signal Throw Intermediate Event.png',
                        pro: true,
                        desc: 'براي ارسال يا دريافت signal در حين فرايند استفاده مي شود. فرستند يا گيرنده Signal بر عكس Message مي تواند نامشخص باشد',
                        usage: '',
                    },
                    {
                        id: 57,
                        title: 'Multiple Intermediate Event',
                        image: 'Mutile Intermediate Throw Event.png',
                        pro: true,
                        desc: 'نشان دهنده آن است كه triggerهاي زيادي به event مرتبط هستند و فرايند با رخ دادن حداقل يكي از آنها مي تواند ادامه پيدا كند',
                        usage: '',
                    },
                    {
                        id: 58,
                        title: 'Parallel Multiple Intermediate Event',
                        image: 'Parallel Catch and  Boundary Intermediate Event.png',
                        pro: true,
                        desc: 'نشان دهنده آن است كه triggerهاي زيادي به event مرتبط هستند و فرايند فقط با رخ دادن همه آنها مي تواند ادامه پيدا كند',
                        usage: '',
                    },
                    {
                        id: 59,
                        title: 'None End Event',
                        image: 'None End Event.png',
                        pro: false,
                        desc: 'نشان دهنده پايان فرايند است، فرايند تنها زماني مي تواند پايان يابد كه تمامي مسيرهاي منتهي به اين نماد پايان يافته باشند',
                        usage: '',
                    },
                    {
                        id: 60,
                        title: 'Message End Event',
                        image: 'Message End Event.png',
                        pro: true,
                        desc: 'نشان دهنده آن است كه وقتي فرايند به آن مي رسد علاوه بر خاتمه يافتن فرايند يك Message نيز براي فرايند ديگري ارسال مي كند',
                        usage: '',
                    },
                    {
                        id: 61,
                        title: 'Error End Event',
                        image: 'Error End Event.png',
                        pro: true,
                        desc: 'نشان دهند آن است كه وقتي فرايند به آن مي رسد علاوه به خاتمه يافتن فرايند يك Error مشخص نيز براي فرايند ديگر ارسال مي كند',
                        usage: '',
                    },
                    {
                        id: 62,
                        title: 'Escaltion End Event',
                        image: 'Escalation End Event.png',
                        pro: true,
                        desc: 'نشان دهنده آن است كه وقتي فرايند به آن مي رسد علاوه به خاتمه يافتن فرايند يك درخواست همياري از جنس Escalation به Participant (مشاركت كننده) ديگري ارسال مي كند',
                        usage: '',
                    },
                    {
                        id: 63,
                        title: 'Cancel End Event',
                        image: 'Cancel End Event.png',
                        pro: true,
                        desc: 'تنها در Transaction SubProcess استفاده شده و نمايانگر اين است كه Sub Process بايد Cancel شود',
                        usage: '',
                    },
                    {
                        id: 64,
                        title: 'Compensation End Event',
                        image: 'Compensation End Event.png',
                        pro: true,
                        desc: 'نشان دهنده اين است كه فرايند خاتمه يافته و بايد Compensation(جبران) يا همان Plan B اتفاق بيافتد',
                        usage: '',
                    },
                    {
                        id: 65,
                        title: 'Signal End Event',
                        image: 'Signal End Event.png',
                        pro: true,
                        desc: 'نشان دهنده اين است كه وقتي فرايند به آن مي رسد علاوه به خاتمه يافتن فرايند يك signal مشخص نيز ارسال مي كند',
                        usage: '',
                    },
                    {
                        id: 66,
                        title: 'Multiple End Event',
                        image: 'Multiple End Event.png',
                        pro: true,
                        desc: 'نشان دهنده اين است كه نتيايج مختلفي در انتهاي فرايند ايجاد مي شوند',
                        usage: 'نكته اينكه همه اين نتايج بايد توليد شوند تا فرايند خاتمه يابد',

                    },
                    {
                        id: 67,
                        title: 'Terminate End Event',
                        image: 'Termination End Event.png',
                        pro: true,
                        desc: 'نشان دهنده پايان فرايند است، فرايند تنها زماني مي تواند پايان يابد كه تنها يكي از مسيرهاي منتهي به اين نماد پايان يافته باشد',
                        usage: '',
                    },

                ],
            },
            {
                id: 7,
                titleFa: 'عناصر ارتباط دهنده',
                title: 'Connecting Objects',
                label: '5',
                image: 'SymbolConnectors.png',
                desc: 'Connecting Objectها برای اتصال اجزای جریان فرایند (Information Flow) به یکدیگر يا به دیگر اطلاعات به کار می‌روند. سه دسته Connecting Object وجود دارد.',
                items: [
                    {
                        id: 70,
                        title: 'Normal Sequence Flow',
                        image: 'Sequence Flow.png',
                        pro: false,
                        desc: 'براي نمايش ترتيب اجراي فرايند استفاده مي شود، همچنين نشان دهنده جريان اطلاعات در فرايند مي باشند',
                        usage: '',

                    },
                    {
                        id: 71,
                        title: 'Conditional Sequence Flow',
                        image: 'Conditional Flow.png',
                        pro: true,
                        desc: 'نشان دهنده مسير اجراي فرايند مي باشد با اين تفاوت كه در شرايط خاص مشخص شده، اين مسير انتخاب مي شود',
                        usage: '',
                    },
                    {
                        id: 72,
                        title: 'Default Sequence Flow',
                        image: 'Default Flow.png',
                        pro: true,
                        desc: 'مسير پيش فرض فرايند را مشخص مي كند مثلا بعد از Gatewayها مي تواند مشخص كند كه معمولا فرايند از كدام مسير ادامه مي دهد.',
                        usage: '',
                    },
                    {
                        id: 73,
                        title: 'Message Flow',
                        image: 'Message Flow.png',
                        pro: true,
                        desc: 'براي نمايش جريان يافتن Message بين دو موجوديت در فرايند به كار برده مي شود',
                        usage: 'ترتيب خاصي براي آنها وجود ندارد و ممكن است در هر فرايند همه آنها اتفاق نيافتد.\
مثال: پولي كه از مشتري دريافت مي كنيم، فاكتوري كه به مشتري ارسال مي كنيم',
                    },
                    {
                        id: 74,
                        title: 'Association',
                        image: 'Association.png',
                        pro: false,
                        desc: 'براي ارتباط دادن Artifactها با ساير موجوديت ها استفاده مي شود ',
                        usage: '',
                    },

                ],
            },
            {
                id: 8,
                titleFa: 'مشاركت كنندگان',
                title: 'Participants',
                label: '3',
                image: 'SymbolSwimLanes.png',
                desc: 'بسياري از زبان‌هاي مدلسازي از مفهوم Swim lanes براي سازمان دهي فعاليت‌ها در قالب گروه‌ها استفاده مي‌كنند. اين نشان گرافيكي براي جداكردن تقش‌ها يا واحدهاي سازماني مختلف مورد استفاده قرار مي‌گيرد.',
                items: [
                    {
                        id: 80,
                        title: 'Pool',
                        image: 'Pool.png',
                        pro: false,
                        desc: 'Pool برای مدل کردن مشاركت كنندگان مستقل در فرايند مانند واحدهای برون سازمانی، خریدار، فروشنده استفاده می‌شود، فعالیت‌هایی که در درون Pool های جداگانه رسم می شود، فرایندهای مستقل محسوب می شوند، بنابراين نمي‌توان از Sequence Flow براي نمايش جريان اطلاعات بين دو Pool استفاده كرد و به جاي آن بايد از Message Flow استفاده نماييد. در واقع Pool جعبه‌اي گرافيکي براي جداکردن فعاليت ها از سايرPoolها مي باشد.',
                        usage: '',

                    },
                    {
                        id: 81,
                        title: 'Lane',
                        image: 'Lane.png',
                        pro: false,
                        desc: '<p>\
                            Lane بخشي در درون يک Pool است که براي شكستن Pool به واحدهاي كوچكتر استفاده مي شود و مي تواند افقي يا عمودي رسم شود.\
                        </p><p>در حقيقت Lane براي جداكردن فعاليت‌هايي كه به يك واحد يا نقش خاص در سازمان مربوط مي شود، به كار گرفته مي‌شود. هر Pool می تواند شامل Lane هايی برای دسته بندی فعالیتها باشد. همچنين مي توان هر Lane را به Laneهاي كوچكتر نيز شكست. براي نمايش جريان اطلاعات بين Laneها بايد از Sequence Flow استفاده نماييد.</p>',
                        usage: '',
                    }
                ],
            },
            {
                id: 9,
                titleFa: 'محصولات',
                title: 'Artifacts & Data',
                label: '3',
                image: 'SymbolArtifact.png',
                desc: 'در مدلسازی فرایندها از Artifact برای ارائه اطلاعات بیشتر در مورد نحوه ی انجام فرایند استفاده می شود',
                items: [
                    {
                        id: 90,
                        title: 'Text Annotation',
                        image: 'Text Annotation.png',
                        pro: false,
                        desc: 'به كسي كه فرايند را مشاهده مي كند اطلاعات بيشتري در مورد آن مي دهد. اين اطلاعات مي تواند يادداشت يا اطلاعات تكميلي باشند.',
                        usage: '',

                    },
                    {
                        id: 91,
                        title: 'Group',
                        image: 'Group.png',
                        pro: false,
                        desc: 'با استفاده از اين نماد مي توان اجزاي فرايند را براي درك و فهم ساده تر گروه بندي كرد',
                        usage: '',
                    },
                    {
                        id: 92,
                        title: 'Data Object',
                        image: 'DataObject.png',
                        pro: true,
                        desc: 'برای نشان دادن اینکه داده‌ها، اسناد و . . . چگونه در طول فرایند ايجاد، استفاده یا تغيير پيدا مي‌كنند، به کار می رود',
                        usage: 'مثلا ايجاد يك موجوديت و داده جديد را مي توان نشان داد. مثلا در فرايند فروش پيش فاكتور و فاكتور موجوديت هايي هستند كه ايجاد مي شوند. همچنين مي توان تغيير وضعيت هاي يك موجوديت را نيز مدل كرد، مثلا وضعيت ابتدايي پيش فاكتور، صادر شده و بعد از پرداخت مشتري، تاييد شده مي شود.',

                    },
                    {
                        id: 93,
                        title: 'Data Store',
                        image: 'DataStore.png',
                        pro: true,
                        desc: 'ارتباط فرايند با پايگاه‌هاي داده را نمايش مي‌دهد.',
                        usage: 'اين اشيا مي تواند انتزاعي نيز باشند، مثلا بعد از تماس مشتري با ما، مشتري به عنوان سرنخ در پايگاه داده CRM وارد مي شود',
                    }
                ],
            },

        ];

        return data;
    });
})();

