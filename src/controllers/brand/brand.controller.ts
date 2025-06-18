import {Request, Response} from 'express';
import { db00 } from '../../_providers';
import { FindManyOptions, Repository } from 'typeorm';
import { Brand } from '../../_core/entities/db-00/Brand';

export class BrandController {
    private repo: Repository<Brand>
    constructor() {
        this.repo = db00.getRepository(Brand);
    }

    getDetails = async (request: Request, response: Response) => {
        const { brandId } = request.params;
        const brand = await this.repo.findOne({ where: { id: parseInt(brandId) } });
        response.status(200).json({
            data: brand,
        });
    }

    getList = async (request: Request, response: Response) => {
        const { page, limit } = request.query
        const query: FindManyOptions<Brand> = {}

        if (page && limit) {
            const p = parseInt(page as string)
            const count = parseInt(limit as string)
            query.take = count
            query.skip = (p - 1) * count
        }

        const brands = await this.repo.find(query)
        const brandsCount = await this.repo.count()

        response.status(200).json({
            data: {
                list: brands,
                total: brandsCount
            },
        });
    }

    create = async (request: Request, response: Response) => {
        const { name } = request.body

        try {
            await this.repo.insert({ name })
        } catch (error) {
            console.log(error, 'error on create');
            if ((error as any).code === 'ER_DUP_ENTRY') {
                return response.status(409).json({ code: 409, message: 'Duplicate entry error: the data already exists.'});
            }
            return response.status(400).json({ code: 400, message: 'error while inserting data'});
        }
        return response.status(201).json({
            data: {},
        });
    }

    update = async (request: Request, response: Response) => {
        const { name } = request.body;
        const { brandId } = request.params;
        try {
            const updatedData = await this.repo.update({ id: parseInt(brandId) }, { name });
            if (updatedData.affected === 0) {
                return response.status(404).json({ message: "Brand not found" });
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