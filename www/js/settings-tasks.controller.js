angular.module('tavla')
    .controller('TasksSettingsController', function ($stateParams, TavlaService, $state, task) {
        var vm = this;

        var isEditMode = !!task;
        console.log("TasksSettingsController", $stateParams, { isEditMode: isEditMode, task: task });

        vm.tavlaService = TavlaService;


        vm.save = function () {
            
            TavlaService.saveTask(vm.task).then(function (d) {
                console.log("Task saved", d);
                TavlaService.refresh().then(function (e) {
                    //$state.transitionTo("app.settings", $stateParams, {
                    //    reload: true,
                    //    inherit: false,
                    //    notify: true
                    //});
                    $state.go("app.settings", { 'status': 'San Diego' }, { reload: true });

                });
            });
        }


        function init() {

            // get next taskId availible
            var nextTaskTypeId = 100;
            if (vm.tavlaService.tavlaSetting.tasks.length > 0) {
                var max = Math.max.apply(null, vm.tavlaService.tavlaSetting.tasks.map(function (t) {
                    return t.data.taskTypeId;
                }));
                if (_.isNumber(max) && max>99) {
                    nextTaskTypeId = max + 1;
                } else {
                    alert("Error i taskTypeId", max);
                }
            }


            if (isEditMode) {
                vm.task = task;
                vm.title = "Edit task setting";

            } else {
                vm.title = "Add new task";
                vm.task = {
                    id: null,
                    type:'task',
                    data: {
                        users: [
                        ],
                        isEnabled: true,
                        name: '',
                        points: 50,
                        taskTypeId: nextTaskTypeId
                    }
                };
            }
            // add entry for all users if not present
            for (var idx in vm.tavlaService.saved.members) {
                var user = vm.tavlaService.saved.members[idx];
                var u = _.findWhere(vm.task.data.users, { id: user.id });
                if (!u) {
                    vm.task.data.users.push({ id: user.id, name: user.name, enabled: false });
                }
            }
            console.log("Ready to fill in data into new task", vm.task);

        }

        init();

    });