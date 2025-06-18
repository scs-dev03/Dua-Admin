import {Request, Response} from 'express';
import { db00 } from '../../_providers';
import { IntegratedPortalReport } from '../../_core/entities/db-00/IntegratedPortalReport';
import { FindManyOptions, In } from 'typeorm';

export class PortalReportController {

    getDetails = async (request: Request, response: Response) => {
        const portalReportRepo = db00.getRepository(IntegratedPortalReport);
        const { reportId } = request.params;

        const reportData = await portalReportRepo.findOne({ where: { id: parseInt(reportId) }, relations: ['portal'] });
        response.status(200).json({
            data: reportData,
        });
    }

    getList = async (request: Request, response: Response) => {
        const portalReportRepo = db00.getRepository(IntegratedPortalReport);
        const { portalId } = request.params;
        const { page, limit, portals } = request.query;
        const query: FindManyOptions<IntegratedPortalReport> = { relations: ['portal'] };

        if (portalId) {
            query.where = { portal_id: parseInt(portalId) }
        } else if (portals) {
            const portalIds = (portals as string).split(',');
            query.where = { portal_id: In(portalIds) }
        }

        const { relations, ...countQuery } = query;
        const portalReportsCount = await portalReportRepo.count(countQuery);

        if (page && limit) {
            const p = parseInt(page as string)
            const count = parseInt(limit as string)
            query.take = count
            query.skip = (p - 1) * count
        }

        const portalReports = await portalReportRepo.find(query);

        response.status(200).json({
            data: {
                list: portalReports,
                total: portalReportsCount
            },
        });
    }

    getListByPortal = async (request: Request, response: Response) => {
        const portalReportRepo = db00.getRepository(IntegratedPortalReport);
        const tableName = portalReportRepo.metadata.tableName

        const { portals } = request.query
        const portalIds = portals ? (portals as string).split(',').map(id => parseInt(id)) : [];

        let queryBuilder = portalReportRepo
            .createQueryBuilder(tableName)
            .leftJoinAndSelect(`${tableName}.portal`, 'portal');

        if (portalIds.length) {
            queryBuilder = queryBuilder.where(`${tableName}.portal_id IN (:...portalIds)`, { portalIds });
        }

        const portalReports = await queryBuilder.getMany();

        // Group reports by portal_id
        const groupedReports = portalReports.reduce((acc, report) => {
            const portalId = report.portal_id;
            if (!acc[portalId]) {
                acc[portalId] = [];
            }
            acc[portalId].push(report);
            return acc;
        }, {} as Record<number, IntegratedPortalReport[]>);

        response.status(200).json({
            data: groupedReports,
        });
    }

    create = async (request: Request, response: Response) => {
        const portalReportRepo = db00.getRepository(IntegratedPortalReport);
        const { report_name, action_sheet_url } = request.body
        const { portalId } = request.params
        try {
            await portalReportRepo.insert({ report_name, action_sheet_url, portal_id: parseInt(portalId) })
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
        const portalReportRepo = db00.getRepository(IntegratedPortalReport);
        const { report_name, action_sheet_url } = request.body;
        console.log(action_sheet_url);
        const { portalId, reportId } = request.params
        try {
            const updatedData = await portalReportRepo.update({ id: parseInt(reportId), portal_id: parseInt(portalId) }, { report_name, action_sheet_url });
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

    updateActionSheet = async (request: Request, response: Response) => {
        const portalReportRepo = db00.getRepository(IntegratedPortalReport);
        const { portalId, reportId } = request.params
        const { action_sheet_url } = request.body
        await portalReportRepo.update({ id: parseInt(reportId), portal_id: parseInt(portalId) }, { action_sheet_url });
        return response.status(200).json({
            data: {},
        });
    }
}
