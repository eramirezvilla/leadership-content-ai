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
                <div className="flex flex-col w-full h-full pr-6 pl-2 py-2 justify-start gap-4">
                    <AddScheduler availableThemes={availableThemes}/>
                    <div className="flex h-full w-full bg-gradient-to-b from-brand_background to-brand_secondary via-brand_primary rounded-lg">
                    </div>
                </div>
            </div>
            <div className="col-span-2 w-full">
                <CalendarTest events={postsWithSchedule} view="dayGridMonth"/>
            </div>
            </div>
        </div>
    )
}