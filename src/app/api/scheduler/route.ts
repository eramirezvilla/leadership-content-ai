import prisma from "~/lib/server/prisma";
import { createScheduleSchema } from "~/lib/validation/Scheduler";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createScheduleSchema.safeParse(body);
    
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }


    console.log("submitted data: ", parseResult.data);

    // await prisma.scheduler.create({
    //   data: parseResult.data,
    // });

    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
