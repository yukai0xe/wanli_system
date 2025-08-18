import prisma from '@/lib/prisma';
import { FileType } from '@prisma/client';

class WanliFileService {
    static async getFilesByType(type: FileType) {
        try {
            return await prisma.fileObject.findMany({
                where: { type }
            });
        } catch (error) {
            console.error('Error fetching FileOject by type:', error);
            throw error;
        }
    }

    static async getAllFiles() {
        try {
            return await prisma.fileObject.findMany();
        } catch (error) {
            console.error('Error fetching FileOject by type:', error);
            throw error;
        }
    }

    static async createNewFileObject(fileObject: fileObject, storagePath: string) {
        try {
            return await prisma.fileObject.create({
                data: {
                    id: fileObject.id,
                    storagePath,
                    displayName: fileObject.displayName,
                    type: fileObject.type
                }
            })
        } catch (error) {
            console.error('Error creating new fileObject:', error);
            throw error;
        }
    }

    static async deleteFileObject(idArray: string[]) {
        try {
            return await prisma.fileObject.deleteMany({
                where: {id: {in: idArray}}
            })
        } catch (error) {
            console.error('Error deleting fileObject:', error);
            throw error;
        }
    }
}

export default WanliFileService;