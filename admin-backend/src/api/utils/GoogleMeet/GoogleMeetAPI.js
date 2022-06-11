
async function meet(options) {
	const { google } = require("googleapis");
	const { OAuth2 } = google.auth;
	const SCOPES = ["https://www.googleapis.com/auth/calendar"];

	//setting details for teacher
	let oAuth2Client = new OAuth2(options.clientId, options.clientSecret);
	oAuth2Client.setCredentials({
		refresh_token: options.refreshToken,
	});

	// Create a new calender instance.
	let calendar = google.calendar({ version: "v3", auth: oAuth2Client });

	//checking whether teacher is budy or not
	let result = await calendar.events.list({
		alwaysIncludeEmail: true,
		calendarId: "primary",
		maxAttendees: 1,
		timeMin: options.startTime,
		timeMax: options.endTime,
		maxResults: 1,
		singleEvents: true,
		orderBy: "startTime",
	});

	let events = result.data.items;
	if (events.length) {
		return {
			message: "you are busy for this time slot !",
			status: false,
		};
	}

	// Create a dummy event for temp users in our calendar
	const event = {
		summary: options.summary,
		location: options.location,
		description: options.description,
		colorId: 1,
		conferenceData: {
			createRequest: {
				requestId: "zzz",
				conferenceSolutionKey: {
					type: "hangoutsMeet",
				},
			},
		},
		start: {
			dateTime: options.startTime, //date1
		},
		end: {
			dateTime: options.endTime, //date2
		},
	};
	let link = await calendar.events.insert({
		calendarId: "primary",
		maxAttendees: 2,
		sendNotifications: true,
		conferenceDataVersion: 1,
		resource: event,
	});

	return {
		meetLink: link.data.hangoutLink,
		message: "Successfull link created !",
		status: true,
	};
}

module.exports.meet = meet;
