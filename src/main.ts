const GMAIL_SEARCH_QUERY =
  `from:(noreply@eikaiwa.dmm.com) AND subject:(レッスン予約) AND newer_than:1h`;
const ADDED_TO_CALENDAR_LABEL = 'added-to-google-calendar';
const EVENT_TITLE = 'DMM 英会話';

interface ReservationInfo {
  link: string;
  teacher: string;
  startsAt: GoogleAppsScript.Base.Date;
  endsAt: GoogleAppsScript.Base.Date;
}

// - logic -
// 1. search mails by GMAIL_SERACH_QUERY
// 2. apply ADDED_TO_CALENDAR_LABEL and create calendar event
//    when mail does not have ADDED_TO_CALENDAR_LABEL
// ---------
// @ts-ignore
function main() { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    const matchedMails = searchGmail(GMAIL_SEARCH_QUERY);
    if (matchedMails.length === 0) {
      console.log('no mails found.');
      return;
    }

    const label = GmailApp.createLabel(ADDED_TO_CALENDAR_LABEL);
    matchedMails.forEach((thread) => {
      if (hasLabel(thread, label)) return;

      applyLabel(thread, label);

      const messages = thread.getMessages();
      messages.forEach((m: GoogleAppsScript.Gmail.GmailMessage) => {
        const info = parseEmailContent(m.getBody());
        createCalendarEvent({
          title: EVENT_TITLE,
          startsAt: info.startsAt,
          endsAt: info.endsAt,
          description: createDescription(info),
        });
      });
    });
  } catch (e) {
    console.error(`failed to execute script. error: ${e}`);
  }
}

const hasLabel = (
  thread: GoogleAppsScript.Gmail.GmailThread,
  label: GoogleAppsScript.Gmail.GmailLabel,
): boolean => {
  const labels = thread.getLabels();
  return labels.map((l) => l.getName()).includes(label.getName());
};

const applyLabel = (
  thread: GoogleAppsScript.Gmail.GmailThread,
  label: GoogleAppsScript.Gmail.GmailLabel,
): void => {
  thread.addLabel(label);
};

const parseEmailContent = (body: string): ReservationInfo => {
  const summaryRegexp = /様、(?<datetime>.+)の(?<teacher>.+)とのレッスン予約が完了しました。/;
  // @ts-ignore
  const { groups: { datetime, teacher } } = summaryRegexp.exec(body);

  const lessonLinkRegexp = /href="(?<link>.+)">レッスンに参加<\/a>/;
  // @ts-ignore
  const { groups: { link } } = lessonLinkRegexp.exec(body);

  const startsAt = new Date(datetime);
  const endsAt = new Date(startsAt.getTime() + 25 * 60 * 1000);

  return {
    link,
    teacher: teacher ?? 'unknown',
    startsAt,
    endsAt,
  };
};

const searchGmail = (query: string): GoogleAppsScript.Gmail.GmailThread[] => {
  return GmailApp.search(query);
};

const createDescription = (info: ReservationInfo) => {
  return `
${info.link}

${info.teacher} 先生
`;
};

const createCalendarEvent = ({ title, startsAt, endsAt, description }: {
  title: string,
  startsAt: GoogleAppsScript.Base.Date,
  endsAt: GoogleAppsScript.Base.Date,
  description: string,
}): void => {
  const calendar = CalendarApp.getDefaultCalendar();
  const event = calendar.createEvent(title, startsAt, endsAt, { description });

  console.log(`[${event.getTitle()}] created.`);
};
