import { authenticate } from '@/lib/middleware/serverAuth';
import ItemService from '@/lib/service/itemService';

export async function POST(request: Request) {
  try {
    await authenticate(request);
    const { idArray } = await request.json() as { idArray: string[] };

    if (!idArray || !Array.isArray(idArray)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid id array" }),
        { status: 400 }
      );
    }
    const items = await ItemService.getItemByIdArray(idArray);

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: String(err) }),
      { status: 500 }
    );
  }
}