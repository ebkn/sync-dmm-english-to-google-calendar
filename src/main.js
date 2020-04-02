"use strict";
var GMAIL_SEARCH_QUERY = 'from:noreply@eikaiwa.dmm.com レッスン予約';
var EVENT_TITLE = 'English Lesson [DMM]';
// @ts-ignore
function main() {
    var matchedMails = searchGmail(GMAIL_SEARCH_QUERY);
    if (matchedMails.length === 0) {
        console.log('no mails found.');
        return;
    }
    matchedMails.forEach(function (thread) {
        markReadMessage(thread, [
            function (message) {
                var info = parseEmailContent(message.getBody());
                createCalendarEvent(EVENT_TITLE, info.startsAt, info.endsAt);
            },
        ]);
    });
}
var markReadMessage = function (thread, hooks) {
    var messages = thread.getMessages();
    messages.forEach(function (message) {
        if (!message.isUnread())
            return;
        hooks.forEach(function (func) { return func(message); });
        message.markRead();
    });
};
var parseEmailContent = function (body) {
    console.log("body: " + body);
    // TODO
    return {
        startsAt: new Date,
        endsAt: new Date,
        link: 'https://www.google.com'
    };
};
var searchGmail = function (query) {
    return GmailApp.search(query);
};
var createCalendarEvent = function (title, startDateTime, endDateTime) {
    try {
        var calendar = CalendarApp.getDefaultCalendar();
        var event = calendar.createEvent(title, startDateTime, endDateTime);
        console.log("[" + event.getTitle() + "] created.");
    }
    catch (e) {
        console.error("failed to create calendar event. " + e);
    }
};
