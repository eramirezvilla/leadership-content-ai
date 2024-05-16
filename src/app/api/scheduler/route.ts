import prisma from "~/lib/server/prisma";
import { createScheduleSchema } from "~/lib/validation/Scheduler";
import { auth } from "@clerk/nextjs";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createScheduleSchema.safeParse(body);

    
    // const { userId } = auth();
    // if (!userId) {
        //   return Response.json({ error: "Unauthorized" }, { status: 401 });
        // }
    if (!parseResult.success) {
        return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    
    const { title, item_type, start_from, end_on, frequency } = parseResult.data;

    // create schedule in database
    const newScheduler = await prisma.scheduler.create({
      data: parseResult.data,
    });

    // generate posts for the schedule with schedule_date between the start_from and end_on dates, according to the frequency

    const currentDate = parseResult.data.start_from;
    while (currentDate <= parseResult.data.end_on) {
      // get day of the week for currentDate
      const day = currentDate.getDay();

    //compare the day of the week with the frequency array
    if (!parseResult.data.frequency[day]) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
        }
      
      await prisma.post.create({
        data: {
          title: parseResult.data.title,
          content: "",
          created_at: currentDate,
          created_from_topic: parseResult.data.item_type,
          relevant_files: [],
          schedule_date: currentDate,
          schedule_id: newScheduler.id,
        },
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
