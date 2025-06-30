import {Request, Response} from 'express';
import { db00 } from '../../_providers';
import { IntegratedPortal } from '../../_core/entities/db-00/IntegratedPortal';
import { FindManyOptions } from 'typeorm';
import { In } from 'typeorm';

export class PortalController {
    constructor() {}

    getDetails = async (request: Request, response: Response) => {
        const portalRepo = db00.getRepository(IntegratedPortal);
        const { portalId } = request.params;

        const portalData = await portalRepo.findOne({ where: { id: parseInt(portalId) } });
        response.status(200).json({
            data: portalData,
        });
    }

    getList = async (request: Request, response: Response) => {
        const portalRepo = db00.getRepository(IntegratedPortal);

        const { page, limit } = request.query

        // const query: FindManyOptions<IntegratedPortal> = {}
    const {brands} = request.query;
    let brandIds: any[] = [];
    if (brands) {
      brandIds = ((brands as string) || '').split(',');
    }
    let query: FindManyOptions<IntegratedPortal> = {relations: ['brand']};
    if (brandIds.length > 0) {
      query = {
        relations: ['brand'],
        where: {
          brand_id: In(brandIds),
        },
      };
    }

        if (page && limit) {
            const p = parseInt(page as string)
            const count = parseInt(limit as string)
            query.take = count
            query.skip = (p - 1) * count
        }

        const portals = await portalRepo.find(query)
        const portalsCount = await portalRepo.count()

        response.status(200).json({
            data: {
                list: portals,
                total: portalsCount
            },
        });
    }

    create = async (request: Request, response: Response) => {
        const portalRepo = db00.getRepository(IntegratedPortal);
        const { brand_id,name, url, auth_type } = request.body
        try {
            await portalRepo.insert({ brand_id , name, url, auth_type })
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
        const portalRepo = db00.getRepository(IntegratedPortal);
        const { name, url, auth_type } = request.body
        const { portalId } = request.params;
        try {
            const updatedData = await portalRepo.update({ id: parseInt(portalId) }, { name, url, auth_type });
            if (updatedData.affected === 0) {
                return response.status(404).json({ message: "Portal not found" });
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