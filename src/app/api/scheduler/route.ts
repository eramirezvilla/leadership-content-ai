import prisma from "~/lib/server/prisma";
import { createScheduleSchema } from "~/lib/validation/Scheduler";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("body", body);

    const parseResult = createScheduleSchema.safeParse(body);
    console.log("parseResult", parseResult);

    // const { userId } = auth();
    // if (!userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }
    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, theme_name, start_from, end_on, frequency } =
      parseResult.data;

    //TODO: add title to supabase & whatever item_type is
    // create schedule in database
    // const newScheduler = await prisma.scheduler.create({
    //     data: {
    //         start_from: new Date(start_from),
    //         end_on: new Date(end_on),
    //         frequency_sun_start: frequency
    //     },
    // });

    console.log(
      "newScheduler: \n",
      "start_from: ",
      new Date(start_from),
      "\nend_on: ",
      new Date(end_on),
      "\nfrequency: ",
      frequency,
    );

    // generate posts for the schedule with schedule_date between the start_from and end_on dates, according to the frequency

    const currentDate = new Date(parseResult.data.start_from);
    while (currentDate <= new Date(parseResult.data.end_on)) {
      // get day of the week for currentDate
      const day = currentDate.getDay();
      console.log("day: ", day, "currentDate: ", currentDate);

      //compare the day of the week with the frequency array
      if (!parseResult.data.frequency[day]) {
        console.log("skipping day: ", currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      // TODO: change this to api call not prisma
      //   const newPost = await prisma.post.create({
      //     data: {
      //       title: parseResult.data.title,
      //       content: "",
      //       created_at: currentDate,
      //       created_from_topic: parseResult.data.item_type,
      //       relevant_files: [],
      //       schedule_date: currentDate,
      //       schedule_id: newScheduler.id,
      //     },
      //   });
      //   console.log("newPost: ", newPost);

      console.log(
        "newPost: \n",
        "title: ",
        parseResult.data.title,
        "\ncreated_at: ",
        currentDate,
        "\ncreated_from_topic: ",
        parseResult.data.theme_name,
        "\nschedule_date: ",
        currentDate,
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
