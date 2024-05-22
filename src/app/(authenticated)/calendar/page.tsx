import CalendarTest from "~/components/ui/FullCalendar"
import prisma from "~/lib/server/prisma"
import AddScheduler from "~/components/ui/AddScheduler";

const postsWithSchedule = await prisma.post.findMany({
    where: {
      schedule_date: {
        not: null,
      },
    },
  });

  const availableThemes = await prisma.themes.findMany();


export default function Calendar(){

    return (
        <div className="flex w-full py-2 px-4">
            <div className="grid grid-cols-3 w-full h-full justify-center items-center py-2 px-4 border border-1 rounded-lg">
            <div className="col-span-1 h-full px-6">
                <div className="flex flex-col w-full h-full px-4 py-2 justify-start">
                    <AddScheduler availableThemes={availableThemes}/>
                </div>
            </div>
            <div className="col-span-2 w-full">
                <CalendarTest events={postsWithSchedule} view="dayGridMonth"/>
            </div>
            </div>
        </div>
    )
}