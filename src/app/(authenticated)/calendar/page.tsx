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
        <div className="grid grid-cols-3 w-full h-full justify-center items-center px-4">
        <div className="col-span-1">
            <div className="flex flex-col">
                <p> Something here </p>
            </div>
        </div>
        <div className="col-span-2 w-full">
            <CalendarTest events={postsWithSchedule} view="dayGridMonth"/>  
        </div>
        </div>
    )
}