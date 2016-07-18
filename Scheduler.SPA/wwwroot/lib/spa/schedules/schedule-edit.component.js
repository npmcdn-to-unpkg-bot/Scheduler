"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var data_service_1 = require('../shared/services/data.service');
var items_service_1 = require('../shared/utils/items.service');
var notification_service_1 = require('../shared/utils/notification.service');
var config_service_1 = require('../shared/utils/config.service');
var mapping_service_1 = require('../shared/utils/mapping.service');
var date_format_pipe_1 = require('../shared/pipes/date-format.pipe');
var ng2_slim_loading_bar_1 = require('ng2-slim-loading-bar/ng2-slim-loading-bar');
var ng2_datetime_1 = require('ng2-datetime/ng2-datetime');
var ScheduleEditComponent = (function () {
    function ScheduleEditComponent(route, router, dataService, itemsService, notificationService, configService, mappingService, slimLoader) {
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.itemsService = itemsService;
        this.notificationService = notificationService;
        this.configService = configService;
        this.mappingService = mappingService;
        this.slimLoader = slimLoader;
        this.scheduleLoaded = false;
    }
    ScheduleEditComponent.prototype.ngOnInit = function () {
        // (+) converts string 'id' to a number
        this.id = +this.route.snapshot.params['id'];
        this.apiHost = this.configService.getApiHost();
        this.loadScheduleDetails();
    };
    ScheduleEditComponent.prototype.loadScheduleDetails = function () {
        var _this = this;
        this.slimLoader.start();
        this.dataService.getScheduleDetails(this.id)
            .subscribe(function (schedule) {
            _this.schedule = _this.itemsService.getSerialized(schedule);
            _this.scheduleLoaded = true;
            // Convert date times to readable format
            _this.schedule.timeStart = new Date(_this.schedule.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
            _this.schedule.timeEnd = new Date(_this.schedule.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
            _this.statuses = _this.schedule.statuses;
            _this.types = _this.schedule.types;
            _this.slimLoader.complete();
        }, function (error) {
            _this.slimLoader.complete();
            _this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
        });
    };
    ScheduleEditComponent.prototype.updateSchedule = function (editScheduleForm) {
        var _this = this;
        console.log(editScheduleForm.value);
        var scheduleMapped = this.mappingService.mapScheduleDetailsToSchedule(this.schedule);
        this.slimLoader.start();
        this.dataService.updateSchedule(scheduleMapped)
            .subscribe(function () {
            _this.notificationService.printSuccessMessage('Schedule has been updated');
            _this.slimLoader.complete();
        }, function (error) {
            _this.slimLoader.complete();
            _this.notificationService.printErrorMessage('Failed to update schedule. ' + error);
        });
    };
    ScheduleEditComponent.prototype.removeAttendee = function (attendee) {
        var _this = this;
        this.notificationService.openConfirmationDialog('Are you sure you want to remove '
            + attendee.name + ' from this schedule?', function () {
            _this.slimLoader.start();
            _this.dataService.deleteScheduleAttendee(_this.schedule.id, attendee.id)
                .subscribe(function () {
                _this.itemsService.removeItemFromArray(_this.schedule.attendees, attendee);
                _this.notificationService.printSuccessMessage(attendee.name + ' will not attend the schedule.');
                _this.slimLoader.complete();
            }, function (error) {
                _this.slimLoader.complete();
                _this.notificationService.printErrorMessage('Failed to remove ' + attendee.name + ' ' + error);
            });
        });
    };
    ScheduleEditComponent.prototype.back = function () {
        this.router.navigate(['/schedules']);
    };
    ScheduleEditComponent = __decorate([
        core_1.Component({
            selector: 'app-schedule-edit',
            templateUrl: 'schedule-edit.component.html',
            directives: [ng2_datetime_1.NKDatetime, common_1.FORM_DIRECTIVES],
            providers: [mapping_service_1.MappingService],
            pipes: [date_format_pipe_1.DateFormatPipe]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, data_service_1.DataService, items_service_1.ItemsService, notification_service_1.NotificationService, config_service_1.ConfigService, mapping_service_1.MappingService, ng2_slim_loading_bar_1.SlimLoadingBarService])
    ], ScheduleEditComponent);
    return ScheduleEditComponent;
}());
exports.ScheduleEditComponent = ScheduleEditComponent;
