function main() {
  var MAIL_INFO = 'from:info@eikaiwa.dmm.com レッスン予約完了のお知らせ';
  var EVENT_TITLE = 'English Lesson [DMM]';

  runForEachUnreadMessages(MAIL_INFO, function (message) {
    var body = message.getBody();
    var [_, year, month, day] = /ご予約日：(\d+)年(\d+)月(\d+)日/.exec(body);
    var [_, hour, minute] = /開始時間：(\d+)時(\d+)分/.exec(body);
    var startDateTime = new Date(year, month - 1, day, hour, minute);
    var endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

    createCalendarEvent(EVENT_TITLE, startDateTime, endDateTime);
  });
}

function runForEachUnreadMessages(mailInfo, callback) {
  GmailApp
    .search(mailInfo)
    .forEach(function(thread) {
      thread
        .getMessages()
        .forEach(function (message) {
          if (!message.isUnread()) {
            return;
          }
          callback(message);
          message.markRead();
        });
    });
}

function createCalendarEvent(title, startDateTime, endDateTime) {
  var calendar = CalendarApp.getDefaultCalendar();
  var event = calendar.createEvent(title, startDateTime, endDateTime);

  Logger.log('[' + event.getTitle() + '] is created.');
}