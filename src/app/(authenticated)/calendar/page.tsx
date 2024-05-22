import CalendarTest from "~/components/ui/FullCalendar"
import prisma from "~/lib/server/prisma"

const postsWithSchedule = await prisma.post.findMany({
    where: {
      schedule_date: {
        not: null,
      },
    },
  });


export default function Calendar(){

    return (
        <div className="flex w-full h-full justify-center items-center">
        <CalendarTest events={postsWithSchedule} view="dayGridMonth"/>  
        </div>
    )
}