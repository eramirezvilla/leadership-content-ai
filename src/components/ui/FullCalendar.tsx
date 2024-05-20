"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
// import BootstrapTheme from "@fullcalendar/bootstrap"
import listPlugin from "@fullcalendar/list";
import GridPost from "./GridPost";
import { type post } from "@prisma/client";

interface Event {
  title: string;
  date: Date;
}
interface CalendarTestProps {
  events: post[];
}

export default function CalendarTest({ events }: CalendarTestProps) {
  const eventsWithStringIds = events.map((event) => {
    return {
      title: event.title!,
      date: event.schedule_date!,
      originalEvent: event
    };
  });

  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        interactionPlugin,
        listPlugin,
      ]}
      slotDuration={"00:15:00"}
      handleWindowResize={true}
      // themeSystem="bootstrap"
      // headerToolbar={{
      //   // left: "prev,next today",
      //   // center: "title",
      //   // right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
      // }}
      events={eventsWithStringIds}
      eventContent={function (arg) {
        return renderEventContent(arg.event._def.extendedProps.originalEvent as post);
      }}
      editable={false}
      droppable={false}
      selectable={false}
      initialView="listWeek"
    />
  );
}

function renderEventContent(eventInfo: post) {
  return <GridPost post={eventInfo} />;
  
}
