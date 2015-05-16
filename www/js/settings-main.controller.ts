/// <reference path="../../typings/tsd.d.ts"/>
module tavla {
	export class SettingsMainController {
		public static $inject=['$state', 'TavlaService'];
		
		constructor(private $state:any, private tavlaService:any){
		 
		}
		usersClick(){
			 this.$state.go('app.settings-main-users');
		}
		tasksClick(){
			 this.$state.go('app.settings-main-tasks');
		}
		logout(){
			this.tavlaService.logout().then(x=>{
				this.$state.go('login');
				console.log("Reloading....");
				window.location.reload();
			})
		}
	}
}

angular.module('tavla').controller('SettingsMainController',tavla.SettingsMainController);