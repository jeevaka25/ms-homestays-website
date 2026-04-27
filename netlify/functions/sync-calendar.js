const CALENDARS = [
  {
    room: 'Room 1',
    slug: 'ground-floor-couples-room',
    sources: [
      {
        type: 'airbnb',
        label: 'Airbnb',
        url: 'https://www.airbnb.com/calendar/ical/1001341226079306512.ics?t=f7d32a8986a94594afaf16f4a4a99495&locale=en-IN',
      },
      {
        type: 'google',
        label: 'Google Calendar',
        url: 'https://calendar.google.com/calendar/ical/75d346e67c0f4c7e18b30dc06fceadd46b9676daa80e31b012ebbf42d2f7bcf8%40group.calendar.google.com/private-77c005f5690915e4e8c2d520ddd1f8c3/basic.ics',
      },
    ],
  },
  {
    room: 'Room 2',
    slug: 'room-no-2-cozy-room',
    sources: [
      {
        type: 'airbnb',
        label: 'Airbnb',
        url: 'https://www.airbnb.com/calendar/ical/994633879912651664.ics?t=d6005a21dd8c4d6ba42193a5596ea332&locale=en-IN',
      },
      {
        type: 'google',
        label: 'Google Calendar',
        url: 'https://calendar.google.com/calendar/ical/0211634dc7d31584421f3b15a1ee46c66a551e84d9efde8987ee9193dfbb9df3%40group.calendar.google.com/private-48fd7592154dee42633c1faefa247dad/basic.ics',
      },
    ],
  },
  {
    room: 'Room 3',
    slug: 'room-no-3-family-studio',
    sources: [
      {
        type: 'airbnb',
        label: 'Airbnb',
        url: 'https://www.airbnb.com/calendar/ical/861563511129794122.ics?t=0dbffaaa20f84603bdd59096c4f4a329&locale=en-IN',
      },
      {
        type: 'google',
        label: 'Google Calendar',
        url: 'https://calendar.google.com/calendar/ical/88480daf63ee683d126bcdc1880874cb3ca0a11ab7372ad9a5eaf8e7ba670a3d%40group.calendar.google.com/private-f37be30d7ec72f19d853015bc7685924/basic.ics',
      },
    ],
  },
  {
    room: 'Room 4',
    slug: 'room-no-4-family-studio',
    sources: [
      {
        type: 'airbnb',
        label: 'Airbnb',
        url: 'https://www.airbnb.com/calendar/ical/860689522138067361.ics?t=bbc6c17b545945b4a0608a07e66edcd3&locale=en-IN',
      },
      {
        type: 'google',
        label: 'Google Calendar',
        url: 'https://calendar.google.com/calendar/ical/027b137e79cda0471ea4863d6658ff5106e1cfa4a71af6e48c34f25453f7adb2%40group.calendar.google.com/private-b088e8b30ed9860b45e5953e88989e9d/basic.ics',
      },
    ],
  },
  {
    room: 'Room 5',
    slug: 'room-no-5-couples-home',
    sources: [
      {
        type: 'airbnb',
        label: 'Airbnb',
        url: 'https://www.airbnb.com/calendar/ical/861623507138272898.ics?t=1bc7033255de4200a79119799c244088&locale=en-IN',
      },
      {
        type: 'google',
        label: 'Google Calendar',
        url: 'https://calendar.google.com/calendar/ical/68c6fb818dc0be89b1c84f9f0e5a2a4144774111207098afbb339c7f0b141726%40group.calendar.google.com/private-32c0badb962fea7be2119bd28bf7092c/basic.ics',
      },
    ],
  },
  {
    room: 'Room 7',
    slug: 'room-no-7-wfh-room',
    sources: [
      {
        type: 'airbnb',
        label: 'Airbnb',
        url: 'https://www.airbnb.com/calendar/ical/1015821438848359875.ics?t=8a14ffb1c82d418bb497e88cf6c4606b&locale=en-IN',
      },
      {
        type: 'google',
        label: 'Google Calendar',
        url: 'https://calendar.google.com/calendar/ical/75d346e67c0f4c7e18b30dc06fceadd46b9676daa80e31b012ebbf42d2f7bcf8%40group.calendar.google.com/private-77c005f5690915e4e8c2d520ddd1f8c3/basic.ics',
      },
    ],
  },
]

const CACHE_SECONDS = 60 * 30

const unfoldIcsLines = (text) => text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/)

const getPropertyValue = (lines, propertyName) => {
  const upperName = propertyName.toUpperCase()
  const line = lines.find((item) => item.toUpperCase().startsWith(`${upperName}`))
  if (!line) return ''
  const colonIndex = line.indexOf(':')
  return colonIndex === -1 ? '' : line.slice(colonIndex + 1).trim()
}

const parseDateValue = (value) => {
  if (!value) return null

  const dateOnlyMatch = value.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (dateOnlyMatch) {
    return `${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-${dateOnlyMatch[3]}`
  }

  const dateTimeMatch = value.match(/^(\d{4})(\d{2})(\d{2})T/)
  if (dateTimeMatch) {
    return `${dateTimeMatch[1]}-${dateTimeMatch[2]}-${dateTimeMatch[3]}`
  }

  const isoDate = new Date(value)
  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate.toISOString().slice(0, 10)
  }

  return null
}

const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

const datesBetween = (start, end) => {
  if (!start) return []
  const finish = end || addDays(start, 1)
  const dates = []
  let cursor = start

  while (cursor < finish) {
    dates.push(cursor)
    cursor = addDays(cursor, 1)
  }

  return dates
}

const parseIcsEvents = (text) => {
  const lines = unfoldIcsLines(text)
  const events = []
  let current = null

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = []
    } else if (line === 'END:VEVENT') {
      if (current) events.push(current)
      current = null
    } else if (current) {
      current.push(line)
    }
  }

  return events.map((eventLines) => {
    const start = parseDateValue(getPropertyValue(eventLines, 'DTSTART'))
    const end = parseDateValue(getPropertyValue(eventLines, 'DTEND'))
    return {
      uid: getPropertyValue(eventLines, 'UID'),
      summary: getPropertyValue(eventLines, 'SUMMARY') || 'Unavailable',
      start,
      end: end || (start ? addDays(start, 1) : null),
      blockedDates: datesBetween(start, end || (start ? addDays(start, 1) : null)),
    }
  }).filter((event) => event.start)
}

const calendarHeaders = {
  'User-Agent': 'MS-Homestays-Availability-Sync/1.0',
  Accept: 'text/calendar,text/plain,*/*',
}

const fetchCalendarSource = async (room, source) => {
  const response = await fetch(source.url, { headers: calendarHeaders })

  if (!response.ok) {
    throw new Error(`${source.label} returned ${response.status} for ${room}`)
  }

  const text = await response.text()
  const events = parseIcsEvents(text)
  const blockedDates = [...new Set(events.flatMap((event) => event.blockedDates))].sort()

  return {
    type: source.type,
    label: source.label,
    blockedDates,
    events,
  }
}

export async function handler() {
  const settled = await Promise.allSettled(
    CALENDARS.map(async (calendar) => {
      const sourceResults = await Promise.allSettled(
        calendar.sources.map((source) => fetchCalendarSource(calendar.room, source))
      )

      const sourceData = {}
      const sourceErrors = []

      sourceResults.forEach((result, index) => {
        const source = calendar.sources[index]
        if (result.status === 'fulfilled') {
          sourceData[source.type] = result.value
        } else {
          sourceErrors.push({
            room: calendar.room,
            slug: calendar.slug,
            source: source.type,
            sourceLabel: source.label,
            message: result.reason.message,
          })
        }
      })

      const allBlockedDates = Object.values(sourceData)
        .flatMap((source) => source.blockedDates)
      const blockedDates = [...new Set(allBlockedDates)].sort()
      const allEvents = Object.values(sourceData)
        .flatMap((source) => source.events.map((event) => ({ ...event, source: source.type, sourceLabel: source.label })))

      return {
        room: calendar.room,
        slug: calendar.slug,
        sources: sourceData,
        sourceErrors,
        availabilityKnown: sourceErrors.length === 0 && Object.keys(sourceData).length === calendar.sources.length,
        blockedDates,
        events: allEvents,
      }
    })
  )

  const apartments = {}
  const errors = []

  settled.forEach((result, index) => {
    const calendar = CALENDARS[index]
    if (result.status === 'fulfilled') {
      apartments[calendar.slug] = result.value
      errors.push(...result.value.sourceErrors)
    } else {
      apartments[calendar.slug] = {
        room: calendar.room,
        slug: calendar.slug,
        sources: {},
        sourceErrors: [],
        availabilityKnown: false,
        blockedDates: [],
        events: [],
      }
      errors.push({ room: calendar.room, slug: calendar.slug, source: 'all', sourceLabel: 'All calendars', message: result.reason.message })
    }
  })

  return {
    statusCode: errors.length === CALENDARS.length ? 502 : 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=0, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
    },
    body: JSON.stringify({
      syncedAt: new Date().toISOString(),
      cacheSeconds: CACHE_SECONDS,
      apartments,
      errors,
    }),
  }
}
