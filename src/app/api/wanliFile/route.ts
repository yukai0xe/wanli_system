import WanliFileService from '@/lib/service/wanliFileService';
import { authenticate } from '@/lib/middleware/auth';
import { FileType } from "@prisma/client";

export async function GET(request: Request) {

    try {
        const type = new URL(request.url).searchParams.get("type");
        await authenticate(request);

        let data = [];
        if (type && Object.keys(FileType).includes(type)) {
            data = await WanliFileService.getFilesByType(type as FileType);
        } else {
            data = await WanliFileService.getAllFiles();
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Unauthorized', message: err }), {
            status: 401,
        });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fileObject, storagePath } = body;
        await authenticate(request);

        await WanliFileService.createNewFileObject(fileObject, storagePath);
        return new Response(JSON.stringify({ data: "success" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: 'Unauthorized', message: err }), {
            status: 401,
        });
    }
};

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { idArray } = body;
        await authenticate(request);

        await WanliFileService.deleteFileObject(idArray);
        return new Response(JSON.stringify({ data: "success" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: 'Unauthorized', message: err }), {
            status: 401,
        });
    }
};