// import {Request, Response} from 'express';
// import { db00 } from '../../_providers';
// import { FindManyOptions } from 'typeorm';

// export class ConfigController {

//     getDetails = async (request: Request, response: Response) => {
//         const configRepo = db00.getRepository(Config);
//         const { configId } = request.params;
//         const configData = await configRepo.findOne({ where: { id: parseInt(configId) }});
//         if (!configData) {
//             return response.status(400).json({
//                 code: 400,
//                 message: 'Invalid config',
//             });
//         }

//         return response.status(200).json({
//             data: configData,
//         });
//     }

//     getList = async (request: Request, response: Response) => {
//         const configRepo = db00.getRepository(Config);
//         const { page, limit } = request.query;
//         const query: FindManyOptions<Config> = {}

//         if (page && limit) {
//             const p = parseInt(page as string)
//             const count = parseInt(limit as string)
//             query.take = count
//             query.skip = (p - 1) * count
//         }

//         const configs = await configRepo.find(query);
//         const configsCount = await configRepo.count();

//         response.status(200).json({
//             data: {
//                 list: configs,
//                 total: configsCount
//             },
//         });
//     }

//     create = async (request: Request, response: Response) => {
//         const configRepo = db00.getRepository(Config);
//         const { run_every, headless, download_path } = request.body;
//         await configRepo.create({ run_every, headless, download_path }).save();
        
//         return response.status(200).json({
//             data: {},
//         });
//     }

//     update = async (request: Request, response: Response) => {
//         const configRepo = db00.getRepository(Config);
//         const { run_every, headless, download_path } = request.body
//         const { configId } = request.params;
//         await configRepo.update({ id: parseInt(configId)}, { run_every, headless, download_path })

//         return response.status(200).json({
//             data: {},
//         });
//     }
// }
