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

    const industry = await prisma.industry_challenge_mapping.create({
      data: {
        industry_name,
        discussion_topic,
        topic_description,
      },
    });

    const industryWithStringId = {
      ...industry,
      id: industry.id.toString(),
    };

    return Response.json({ industryWithStringId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateIndustrySchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, industry_name, discussion_topic, topic_description } = parseResult.data;

    const Industry = await prisma.industry_challenge_mapping.findUnique({ where: { id: BigInt(id) } });
    if (!Industry) {
      return Response.json({ error: "Industry not found" }, { status: 404 });
    }

    // separates rows by userId, but not needed at the moment
    // const { userId } = auth();
    // if (!userId || userId !== Industry.userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }


      const updatedIndustry = await prisma.industry_challenge_mapping.update({
        where: { id: BigInt(id) },
        data: {
            industry_name,
            discussion_topic,
            topic_description,
          },
      });

    const industryWithStringId = {
      ...updatedIndustry,
      id: updatedIndustry.id.toString(),
    };

    return Response.json({ industryWithStringId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteIndustrySchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const industry = await prisma.industry_challenge_mapping.findUnique({ where: { id: BigInt(id) } });
    if (!industry) {
      return Response.json({ error: "industry not found" }, { status: 404 });
    }

    // const { userId } = auth();
    // if (!userId || userId !== industry.userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await prisma.industry_challenge_mapping.delete({ where: { id: BigInt(id) } });

    return Response.json({ message: "industry deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}