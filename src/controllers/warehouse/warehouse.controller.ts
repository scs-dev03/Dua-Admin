import {Request, Response} from 'express';
import { db00 } from '../../_providers';
import { Warehouse } from '../../_core/entities/db-00/Warehouse';
import { FindManyOptions } from 'typeorm';

export class WarehouseController {
    constructor() {}

    getDetails = async (request: Request, response: Response) => {
        const warehouseRepo = db00.getRepository(Warehouse);
        const { warehouseId } = request.params;
        const warehouseData = await warehouseRepo.findOne({ where: { id: parseInt(warehouseId) }, relations: { dealer: { brand: true } } });
        response.status(200).json({
            data: warehouseData,
        });
    }

    getList = async (request: Request, response: Response) => {
        const dealer_id = request.query.dealer as string
        const { page, limit } = request.query
        const warehouseRepo = db00.getRepository(Warehouse);

        const query: FindManyOptions<Warehouse> = { relations: ['dealer', 'dealer.brand'] }
        if (dealer_id) {
            query.where = { dealer_id: parseInt(dealer_id) };
        }

        if (page && limit) {
            const p = parseInt(page as string)
            const count = parseInt(limit as string)
            query.take = count
            query.skip = (p - 1) * count
        }

        const warehouses = await warehouseRepo.find(query)
        const warehousesCount = await warehouseRepo.count()

        response.status(200).json({
            data: {
                list: warehouses,
                total: warehousesCount
            },
        });
    }

    create = async (request: Request, response: Response) => {
        const warehouseRepo = db00.getRepository(Warehouse);
        const { name, dealer_id } = request.body
        try {
            await warehouseRepo.insert({ name, dealer_id: parseInt(dealer_id) });
        } catch (error) {
            console.log(error, 'error on create');
            if ((error as any).code === 'ER_DUP_ENTRY') {
                return response.status(409).json({ code: 409, message: 'Duplicate entry error: the data already exists.'});
            }
            return response.status(400).json({ code: 400, message: 'error while inserting data'});
        }
        return response.status(200).json({
            data: {},
        });
    }

    update = async (request: Request, response: Response) => {
        const warehouseRepo = db00.getRepository(Warehouse);
        
        const { name, dealer_id } = request.body;
        const { warehouseId } = request.params;
        try {
            const updatedData = await warehouseRepo.update({ id: parseInt(warehouseId) }, { name, dealer_id: parseInt(dealer_id) });

            if (updatedData.affected === 0) {
                return response.status(404).json({ message: "Warehouse not found" });
            }
        } catch (error) {
            console.log(error, 'error on create');
            if ((error as any).code === 'ER_DUP_ENTRY') {
                return response.status(409).json({ code: 409, message: 'Duplicate entry error: the data already exists.'});
            }
            return response.status(400).json({ code: 400, message: 'error while inserting data'});
        }
        return response.status(200).json({
            data: {},
        });
    }
}