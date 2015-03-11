function fillInUserAndCalendarInfo(data, days) {

    console.log("fillInUserAndCalendarInfo", data);


    var arr = [];
    for (var i = 0; i < days; i++) {
        arr.push({
            date: moment().startOf('day').add(i, 'days'),
            items: []
        });

    }
    _.each(arr, function (day) {
        // check if  is configured
        var correctDay = _.filter(data.calendarItems, function (item) {
            return day.date.isSame(item.dtstart, 'day');
        });


        // add username
        var withUserInfo = correctDay.map(function (d) {
            
            // find calendar
            d.calendar = _.find(data.calendars, { id: d.calendar_id });
            if (!d.calendar) {
                console.warn("Fant ikke kalendar for item", d );
            }

            d.user = _.find(data.settings.members, { calendars: d.calendar.name });
            if (!d.user) {
                console.warn("Fant ikke bruker for kalender item", d);
            }
            return d;
        });

        // add to return array
        _.each(withUserInfo, function (w) {
            // only add if userinfo is present
            if (w.user) {
                day.items.push(w);
            }
        });

    });

    console.log("Result", arr);
    return arr;
}



QUnit.test("hello test", function (assert) {


    var result = fillInUserAndCalendarInfo(dummy, 10);

    assert.equal(result.length, 10);
    assert.ok(moment().isSame(result[0].date, 'day'));
    assert.equal(result[0].items.length, 2);
    assert.equal(result[1].items[0].user.name, 'Lars Erik');
    assert.equal(result[1].items[0].title, 'TEST4 title');

});


var dummy = {
    calendars: [
        { id: '1', name: 'lars.erik.finholt@gmail.com' },
        { id: '2', name: 'camilla.finholt@gmail.com' },
        { id: '3', name: 'markus.finholt@gmail.com' }
],
    calendarItems: [
       { calendar_id: '1', eventLocation: "", title: "TEST1 title", allDay: 0, dtstart: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).getTime(), dtend: 1426183200000 }, // moment().add(0,'days').add(2, 'hours') },
       { calendar_id: '2', eventLocation: "Camillas", title: "TEST2 title", allDay: 0, dtstart: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).getTime() },//moment().add(0, 'days').add(3, 'hours') },
       { calendar_id: '1', eventLocation: "", title: "TEST3 title", allDay: 0, dtstart: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(2, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TEST4 title", allDay: 0, dtstart: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '3', eventLocation: "Markus", title: "TEST5 title", allDay: 0, dtstart: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).getTime() } //moment().add(1, 'days') },
],

    settings: {
        family: {
            "id": "784eda9d-9e09-48a5-bf5e-e307d48a35b9",
            "name": "Finholt",
            "secret": "123"
        },
        members: [
          {
              "id": "2d9db721-eefb-4d7f-ade8-c2480b811f04",
              "name": "Markus",
              "familyId": "784eda9d-9e09-48a5-bf5e-e307d48a35b9"
          },
          {
              "id": "4a7a0a3f-afda-48f1-b418-e6cc3a9fd21c",
              "name": "Camilla",
              "calendars": "camilla.finholt@gmail.com",
              "familyId": "784eda9d-9e09-48a5-bf5e-e307d48a35b9"
          },
          {
              "id": "5f00d18e-a5c9-49da-91dc-6f309b452f7c",
              "userId": "NOUSER",
              "name": "Lars Erik",
              "calendars": "lars.erik.finholt@gmail.com",
              "familyId": "784eda9d-9e09-48a5-bf5e-e307d48a35b9",
              "isAdmin": true
          }
        ],
        "registerState": "completed",
        "currentUserId": "NOUSER"
    }

};