import prisma from '@/lib/prisma';
import { parseEnumKey } from '@/lib/utility';
import { ItemType } from '@prisma/client';

class ItemService {
    static async getAllItem() {
        try {
            return await prisma.item.findMany({
                select: {
                    id: true,
                    name: true,
                    weight: true,
                    type: true,
                    description: true
                }
            });
        } catch (error) {
            console.error('Error fetching All Items:', error);
            throw error;
        }
    }

    static async getItemByIdArray(idArray: string[]) {
        try {
            return await prisma.item.findMany({
                where: {id: {in: idArray}},
                select: {
                    id: true,
                    name: true,
                    weight: true,
                    type: true,
                    description: true
                }
            });
        } catch (error) {
            console.error('Error fetching All Items:', error);
            throw error;
        }
    }

   static async createNewItem(item: Item) {
        try {
            return await prisma.item.create({
                data: {
                    id: item.id,
                    name: item.name,
                    weight: item.weight || 0,
                    type: parseEnumKey(ItemType, item.type),
                    description: item.description || null,
                }
            });
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }
}

export default ItemService;