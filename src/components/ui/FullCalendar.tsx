"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import GridPost from "./GridPost";
import { type post, file} from "@prisma/client";
import CalendarPost from "./CalendarPost";
import { use, useEffect, useState } from "react";
import LinkedInPost from "./LinkedInPost";

interface CalendarTestProps {
  events: post[];
  view?: string;
}

interface EventWithStringId{
  title: string;
  date: Date;
  originalEvent: post;
}


export default function CalendarTest({ events, view}: CalendarTestProps) {
  const [eventsToDisplay, setEventsToDisplay] = useState<post[]>(events);
  const [eventsWithStringIds, setEventsWithStringIds] = useState<EventWithStringId[]>([]);

  useEffect(() => {
    setEventsToDisplay(events);
  }, [events]);

  useEffect(() => {
    const eventsWithStringIds = events.map((event) => {
      return {
        title: event.title!,
        date: event.schedule_date!,
        originalEvent: event
      };
    });
    setEventsWithStringIds(eventsWithStringIds);
  }
  , [events]);

  // const eventsWithStringIds = events.map((event) => {
  //   return {
  //     title: event.title!,
  //     date: event.schedule_date!,
  //     originalEvent: event
  //   };
  // });

  return (
    <div className="flex flex-col w-full items-center">
      {view != "dayGridMonth" ?? (
      <h1 className="font-medium text-lg text-black">Upcoming Posts</h1>
      )}
    
    <FullCalendar
      plugins={[
        dayGridPlugin,
        // interactionPlugin,
        listPlugin,
      ]}
      // slotDuration={"00:15:00"}
      handleWindowResize={true}
      height={"auto"}
      themeSystem="standard"
      headerToolbar={{
        left: view === "dayGridMonth" ? "title" : "",
        center: "",
        right: view === "dayGridMonth" ? "today prev,next" : "",
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
    return <div className="flex flex-col w-fit overflow-hidden">
      <CalendarPost post={eventInfo} />
    </div>;
  }
  // return <GridPost post={eventInfo} />;
  return <LinkedInPost post={eventInfo}/>;
  
}