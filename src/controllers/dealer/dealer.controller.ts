import { Request, Response } from "express";
import { Dealer } from "../../_core/entities/db-00/Dealer";
import { db00 } from "../../_providers";
import { FindManyOptions } from "typeorm";

export class DealerController {
  constructor() {
  }

  getDetails = async (request: Request, response: Response) => {
    const dealerRepo = db00.getRepository(Dealer);
    const { dealerId } = request.params;

    const dealerData = await dealerRepo.findOne({ where: { id: parseInt(dealerId) }, relations: ["brand"] });
    response.status(200).json({
      data: dealerData
    });
  };

  getList = async (request: Request, response: Response) => {
    const dealerRepo = db00.getRepository(Dealer);
    const { page, limit, brand: brand_id } = request.query;

    const query: FindManyOptions<Dealer> = { relations: ["brand"] };

    if (page && limit) {
      const p = parseInt(page as string);
      const count = parseInt(limit as string);
      query.take = count;
      query.skip = (p - 1) * count;
    }

    if (brand_id) {
      query.where = { brand_id: parseInt(brand_id as string) };
    }

    const dealers = await dealerRepo.find(query);
    const dealersCount = await dealerRepo.count();

    response.status(200).json({
      data: {
        list: dealers,
        total: dealersCount
      }
    });
  };

  create = async (request: Request, response: Response) => {
    const dealerRepo = db00.getRepository(Dealer);
    const { name, brand_id } = request.body;

    try {
      await dealerRepo.insert({ name, brand_id: parseInt(brand_id) });
    } catch (error) {
      console.log(error, "error on create");
      if ((error as any).code === "ER_DUP_ENTRY") {
        return response.status(409).json({ code: 409, message: "Duplicate entry error: the data already exists." });
      }
      return response.status(400).json({ code: 400, message: "error while inserting data" });
    }
    return response.status(201).json({
      data: {}
    });
  };

  update = async (request: Request, response: Response) => {
    const dealerRepo = db00.getRepository(Dealer);
    const { name, brand_id } = request.body;
    const { dealerId } = request.params;
    try {
      const updatedData = await dealerRepo.update({ id: parseInt(dealerId) }, { name, brand_id: parseInt(brand_id) });
      if (updatedData.affected === 0) {
        return response.status(404).json({ message: "Dealer not found" });
      }
    } catch (error) {
      console.log(error, "error on create");
      if ((error as any).code === "ER_DUP_ENTRY") {
        return response.status(409).json({ code: 409, message: "Duplicate entry error: the data already exists." });
      }
      return response.status(400).json({ code: 400, message: "error while inserting data" });
    }
    return response.status(200).json({
      data: {}
    });
  };

}
