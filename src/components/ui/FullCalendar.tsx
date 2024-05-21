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
    <>
    <h1 className="text-2xl font-bold">Upcoming Posts</h1>
    <FullCalendar
      plugins={[
        // dayGridPlugin,
        // interactionPlugin,
        listPlugin,
      ]}
      slotDuration={"00:15:00"}
      handleWindowResize={true}
      height={"auto"}
      themeSystem="standard"
      headerToolbar={{
        left: "",
        center: "",
        right: "",
      }}
      events={eventsWithStringIds}
      eventContent={function (arg) {
        return renderEventContent(arg.event._def.extendedProps.originalEvent as post);
      }}
      editable={false}
      droppable={false}
      selectable={false}
      initialView="listWeek"
    />
  </>
  );
}

function renderEventContent(eventInfo: post) {
  return <GridPost post={eventInfo} />;
  
}