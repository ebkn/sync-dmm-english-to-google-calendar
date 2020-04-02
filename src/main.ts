const GMAIL_SEARCH_QUERY = 'from:noreply@eikaiwa.dmm.com レッスン予約';
const EVENT_TITLE = 'English Lesson [DMM]';

interface ReservationInfo {
  startsAt: GoogleAppsScript.Base.Date;
  endsAt: GoogleAppsScript.Base.Date;
  link: string;
}

// @ts-ignore
function main() { // eslint-disable-line @typescript-eslint/no-unused-vars
  const matchedMails = searchGmail(GMAIL_SEARCH_QUERY);
  if (matchedMails.length === 0) {
    console.log('no mails found.');
    return;
  }

  matchedMails.forEach((thread) => {
    markReadMessage(thread, [
      (message) => {
        const info = parseEmailContent(message.getBody());
        createCalendarEvent(EVENT_TITLE, info.startsAt, info.endsAt);
      },
    ])
  });
}

const markReadMessage = (
  thread: GoogleAppsScript.Gmail.GmailThread,
  hooks: ((message: GoogleAppsScript.Gmail.GmailMessage) => void)[],
): void => {
  const messages = thread.getMessages();
  messages.forEach((message) => {
    if (!message.isUnread()) return;

    hooks.forEach((func) => func(message));

    message.markRead();
  });
};

const parseEmailContent = (body: string): ReservationInfo => {
  console.log(`body: ${body}`);

  // TODO
  return {
    startsAt: new Date,
    endsAt: new Date,
    link: 'https://www.google.com',
  };
};

const searchGmail = (query: string): GoogleAppsScript.Gmail.GmailThread[] => {
  return GmailApp.search(query);
};

const createCalendarEvent = (
  title: string,
  startDateTime: GoogleAppsScript.Base.Date,
  endDateTime: GoogleAppsScript.Base.Date,
) => {
  try {
  const calendar = CalendarApp.getDefaultCalendar();
  const event = calendar.createEvent(title, startDateTime, endDateTime);

  console.log(`[${event.getTitle()}] created.`);
  } catch (e) {
    console.error(`failed to create calendar event. ${e}`);
  }
};
