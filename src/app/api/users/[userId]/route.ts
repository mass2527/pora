import { ZodError } from "zod";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { updateUserSchema } from "~/lib/validations/user";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, image, jobPosition } = updateUserSchema.parse(json);
    const updatedUser = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        image,
        jobPosition,
      },
    });
    return new Response(JSON.stringify(updatedUser));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
