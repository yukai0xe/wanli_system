import { authenticate } from '@/lib/middleware/serverAuth';
import ItemService from '@/lib/service/itemService';

export async function GET(request: Request) {
  try {
    await authenticate(request);
    const data = await ItemService.getAllItem();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Unauthorized') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: String(err) }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await authenticate(request);
    const { newItem } = await request.json();

    console.log(newItem);
    if (!newItem.name || !newItem.type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const createdItem = await ItemService.createNewItem(newItem);

    return new Response(JSON.stringify({
      id: createdItem.id
     }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Unauthorized') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: String(err) }), { status: 500 });
  }
}