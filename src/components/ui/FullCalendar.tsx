"use client"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
// import BootstrapTheme from "@fullcalendar/bootstrap"
import listPlugin from '@fullcalendar/list';

interface Event {
  title: string,
  date: Date
}
interface CalendarTestProps {
  events: Event[]
}

export default function CalendarTest({ events } : CalendarTestProps) {

    return (
        <FullCalendar
                plugins={[
                  dayGridPlugin,
                  interactionPlugin,
                  listPlugin
                ]}
                slotDuration={"00:15:00"}
                handleWindowResize={true}
                // themeSystem="bootstrap"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                }}
                events={events}
                editable={true}
                droppable={true}
                selectable={true}
                initialView="dayGridMonth"
              />
    );
    }