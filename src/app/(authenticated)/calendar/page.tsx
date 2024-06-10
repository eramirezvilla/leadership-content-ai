import CalendarTest from "~/components/ui/FullCalendar";
import prisma from "~/lib/server/prisma";
import AddScheduler from "~/components/ui/AddScheduler";
import CalendarContent from "~/components/ui/CalendarContent";
import { auth } from "@clerk/nextjs";
import { supabase } from "~/lib/server/supabase";

export default async function Calendar() {
  const { userId } = auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const postsWithSchedule = await prisma.post.findMany({
    where: {
      schedule_date: {
        not: null,
      },
      user_id: userId,
    },
  });
  
  const availableThemes = await prisma.themes.findMany();

  const allFiles = await prisma.file.findMany();
  const filesWithImageURL: Record<string, string[]> = {};

  await Promise.all(
    allFiles.map(async (file) => {
      if (file.extracted_imgs && file.extracted_imgs.length > 0) {
        await Promise.all(
          file.extracted_imgs.map(async (img: number) => {
            const imageURL = await prisma.image.findUnique({
              select: {
                filename: true,
              },
              where: {
                id: img,
              },
            });
            if (!imageURL) return;
            const { data } = supabase.storage
              .from("extracted-images")
              .getPublicUrl(imageURL.filename);
            filesWithImageURL[file.filename] = [
              ...(filesWithImageURL[file.filename] ?? []),
              data.publicUrl,
            ];
          }),
        );
      }
    }),
  );


  return (
    <div className="flex w-full px-4 py-2 bg-white">
        <CalendarContent availableThemes={availableThemes} postsWithSchedule={postsWithSchedule} />

      {/* <div className="border-1 grid h-full w-full grid-cols-3 items-center justify-center rounded-lg border px-4 py-2">
        <div className="col-span-1 h-full px-6">
          <div className="flex h-full w-full flex-col justify-start gap-4 py-2 pl-2 pr-6">
            <AddScheduler availableThemes={availableThemes} />
            <div className="flex h-full w-full flex-col rounded-lg bg-white px-4 py-2">
              <h1 className="text-sm">Themes</h1>
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex w-full flex-row items-center justify-between py-2"
                >
                  <p className="text-sm">{theme.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 w-full">
          <CalendarTest events={postsWithSchedule} view="dayGridMonth" />
        </div>
      </div> */}
    </div>
  );
}
