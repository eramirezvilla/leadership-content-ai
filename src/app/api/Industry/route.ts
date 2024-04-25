import prisma from "~/lib/server/prisma";
import {
  createIndustrySchema,
  deleteIndustrySchema,
  updateIndustrySchema,
} from "~/lib/validation/IndustryChallenge";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createIndustrySchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { industry_name, discussion_topic, topic_description } =
      parseResult.data;
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.industry_challenge_mapping.create({
      data: {
        industry_name,
        discussion_topic,
        topic_description,
      },
    });

    const noteWithStringId = {
      ...note,
      id: note.id.toString(),
    };

    return Response.json({ noteWithStringId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id: BigInt(id) } });
    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id: BigInt(id) },
        data: { title, content },
      });

      await notesIndex.upsert([
        {
          id: updatedNote.id.toString(),
          values: embedding,
          metadata: { userId },
        },
      ]);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return updatedNote;
    });

    const noteWithStringId = {
      ...updatedNote,
      id: updatedNote.id.toString(),
    };

    return Response.json({ noteWithStringId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id: BigInt(id) } });
    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id: BigInt(id) } });
      await notesIndex.deleteOne(id.toString());
    });

    return Response.json({ message: "note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + (content ?? ""));
}
