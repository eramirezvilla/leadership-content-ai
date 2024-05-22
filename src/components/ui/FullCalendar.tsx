"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import GridPost from "./GridPost";
import { type post } from "@prisma/client";
import CalendarPost from "./CalendarPost";

interface CalendarTestProps {
  events: post[];
  view?: string;
}

export default function CalendarTest({ events, view }: CalendarTestProps) {
  const eventsWithStringIds = events.map((event) => {
    return {
      title: event.title!,
      date: event.schedule_date!,
      originalEvent: event
    };
  });

  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="font-medium text-lg text-brand_background">Upcoming Posts</h1>
    
    <FullCalendar
      plugins={[
        dayGridPlugin,
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
        return renderEventContent(arg.event._def.extendedProps.originalEvent as post, view);
      }}
      editable={false}
      droppable={false}
      selectable={false}
      initialView={view ?? "listWeek"}
    />
    </div>

  );
}

function renderEventContent(eventInfo: post, view?: string) {
  if (view === "dayGridMonth") {
    return <div className="flex flex-col border border-red-500">
      <CalendarPost post={eventInfo} />
    </div>;
  }
  return <GridPost post={eventInfo} />;
  
}