"use client"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
// import BootstrapTheme from "@fullcalendar/bootstrap"
import listPlugin from '@fullcalendar/list';

export default function CalendarTest() {

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
                events={[
                    { title: 'event 1', date: '2024-05-13' },
                    { title: 'event 2', date: '2024-05-18' }
                  ]}
                editable={true}
                droppable={true}
                selectable={true}
                initialView="dayGridMonth"
              />
    );
    }