const CALENDARS = [
  {
    room: 'Room 1',
    slug: 'ground-floor-couples-room',
    url: 'https://www.airbnb.com/calendar/ical/1001341226079306512.ics?t=f7d32a8986a94594afaf16f4a4a99495&locale=en-IN',
  },
  {
    room: 'Room 2',
    slug: 'room-no-2-cozy-room',
    url: 'https://www.airbnb.com/calendar/ical/994633879912651664.ics?t=d6005a21dd8c4d6ba42193a5596ea332&locale=en-IN',
  },
  {
    room: 'Room 3',
    slug: 'room-no-3-family-studio',
    url: 'https://www.airbnb.com/calendar/ical/861563511129794122.ics?t=0dbffaaa20f84603bdd59096c4f4a329&locale=en-IN',
  },
  {
    room: 'Room 4',
    slug: 'room-no-4-family-studio',
    url: 'https://www.airbnb.com/calendar/ical/860689522138067361.ics?t=bbc6c17b545945b4a0608a07e66edcd3&locale=en-IN',
  },
  {
    room: 'Room 5',
    slug: 'room-no-5-couples-home',
    url: 'https://www.airbnb.com/calendar/ical/861623507138272898.ics?t=1bc7033255de4200a79119799c244088&locale=en-IN',
  },
  {
    room: 'Room 7',
    slug: 'room-no-7-wfh-room',
    url: 'https://www.airbnb.com/calendar/ical/1015821438848359875.ics?t=8a14ffb1c82d418bb497e88cf6c4606b&locale=en-IN',
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

export async function handler() {
  const settled = await Promise.allSettled(
    CALENDARS.map(async (calendar) => {
      const response = await fetch(calendar.url, {
        headers: {
          'User-Agent': 'MS-Homestays-Availability-Sync/1.0',
          Accept: 'text/calendar,text/plain,*/*',
        },
      })

      if (!response.ok) {
        throw new Error(`Airbnb calendar returned ${response.status} for ${calendar.room}`)
      }

      const text = await response.text()
      const events = parseIcsEvents(text)
      const blockedDates = [...new Set(events.flatMap((event) => event.blockedDates))].sort()

      return {
        room: calendar.room,
        slug: calendar.slug,
        blockedDates,
        events,
      }
    })
  )

  const apartments = {}
  const errors = []

  settled.forEach((result, index) => {
    const calendar = CALENDARS[index]
    if (result.status === 'fulfilled') {
      apartments[calendar.slug] = result.value
    } else {
      apartments[calendar.slug] = {
        room: calendar.room,
        slug: calendar.slug,
        blockedDates: [],
        events: [],
      }
      errors.push({ room: calendar.room, slug: calendar.slug, message: result.reason.message })
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
