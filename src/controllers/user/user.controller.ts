import { Request, Response } from "express";
import { db00 } from "../../_providers";
import { User } from "../../_core/entities/db-00/User";
import { FindManyOptions, In } from "typeorm";
import { UserWarehouse } from "../../_core/entities/db-00/UserWarehouse";
import { IntegratedPortalReport } from "../../_core/entities/db-00/IntegratedPortalReport";
import { UserPortal } from "../../_core/entities/db-00/UserPortal";
import { log } from "node:console";



export class UserController {
  async uploadReport(request: Request, response: Response) {
    const file = request.file;
    if (!file) {
      return response.status(400).json({
        message: "File is missing!"
      });
    }

    const data = {
      filename: file.filename,
      originalName: file.originalname
    };

    return response.status(200).json({
      message: "Media Uploaded successfully",
      data: data
    });
  }

  async getConfig(request: Request, response: Response) {
    function getFileNameFromUrl(url: string) {
      const parsedUrl = new URL(url); // Parse the URL
      const path = parsedUrl.pathname; // Extract the path from the URL
      return path.substring(path.lastIndexOf("/") + 1); // Get the part after the last '/'
    }

    const { userId } = request.params;
    const user_id = Number(userId);

    const portals = await db00.getRepository(UserPortal).find({
      where: { user_id: user_id },
      select: ["portal_id", "report_config", "runtime_config"]
    });

    const runtimeConfigs: any = {};
    const reportIds: number[] = [];
    // for (const k in portals) {
    //   for (const key in portals[k].report_config) {
    //      portals[k].report_config = portals[k].report_config || {};
    //     if (portals[k].report_config[key]) {
    //       reportIds.push(Number(key));
    //     }
    //      portals[k].report_config = portals[k].report_config || {};
    //     if (portals[k].runtime_config[key]) {
    //       runtimeConfigs[key] = portals[k].runtime_config[key];
    //     }
    //   }
    // }
for (const k in portals) {
  const portal = portals[k];

  // Safely parse report_config (stored as string)
  const reportConfig = portal.report_config
    ? JSON.parse(portal.report_config)
    : {};

  // Safely parse runtime_config (also stored as string or object)
  const runtimeConfig = typeof portal.runtime_config === 'string'
    ? JSON.parse(portal.runtime_config)
    : (portal.runtime_config || {});

  for (const key in reportConfig) {
    if (reportConfig[key]) {
      reportIds.push(Number(key));
    }

    if (runtimeConfig[key]) {
      runtimeConfigs[key] = runtimeConfig[key];
    }
  }
}
    const integratedPortalReports: IntegratedPortalReport[] = await db00.getRepository(IntegratedPortalReport).find({
      where: {
        id: In(reportIds)
      }
    });

    // const configs = await db00.getRepository(Config).find({});

    const finalActionSheets = [];
    for (const key in integratedPortalReports) {
      finalActionSheets.push({
        name: getFileNameFromUrl(integratedPortalReports[key].action_sheet_url),
        ...integratedPortalReports[key],
        config: runtimeConfigs[integratedPortalReports[key].id]
      });
    }

    const config = {
      host: "http://web35.185.238.new.ocpwebserver.com/",
      endpoints: {
        report_upload: "/api/v1/user/{{userId}}/report",
        config: "/api/v1/user/{{userId}}/config"
      },
      download_path: "",
      action_sheets: finalActionSheets,
    };

    return response.status(200).json({ configuration: config });
  };


  getDetails = async (request: Request, response: Response) => {
    const userRepo = db00.getRepository(User);
    const { userId } = request.params;
    const userData = await userRepo.findOne({
      where: { id: parseInt(userId) },
      relations: { userWarehouses: { warehouse: { dealer: { brand: true } } } }
    });
    if (!userData) {
      return response.status(400).json({
        code: 400,
        message: "Invalid User"
      });
    }

    const { userWarehouses } = userData;
    (userData as any).warehouses = userWarehouses.map(w => w.warehouse);
    delete (userData as any).userWarehouses;

    return response.status(200).json({
      data: userData
    });
  };

  getList = async (request: Request, response: Response) => {
    const userRepo = db00.getRepository(User);
    const { page, limit } = request.query;

    // const query: FindManyOptions<User> = { relations: { userWarehouses: { warehouse: { dealer: { brand: true } } } } };
    const query: FindManyOptions<User> = {
      relations: {
        userPortals: true,
        userWarehouses: {warehouse: {dealer: {brand: true}}},
      },
    };
    if (page && limit) {
      const p = parseInt(page as string);
      const count = parseInt(limit as string);
      query.take = count;
      query.skip = (p - 1) * count;
    }

    const users = await userRepo.find(query);

    for (const user of users) {
      const { userWarehouses } = user;
      (user as any).warehouses = userWarehouses.map(w => w.warehouse);
      delete (user as any).userWarehouses;
    }

    const usersCount = await userRepo.count();

    response.status(200).json({
      data: {
        list: users,
        total: usersCount
      }
    });
  };

  create = async (request: Request, response: Response) => {
    const userRepo = db00.getRepository(User);
    const userWarehouseRepo = db00.getRepository(UserWarehouse);
    const { name, password, warehouse_ids , email } = request.body;

    if (!warehouse_ids.length) {
      return response.status(400).json({ code: 400, message: "At least Select one warehouse" });
    }

    try {
      // const user = userRepo.create({ name, password });  // just creates entity
      // await userRepo.save(user);                         // save it properly

      const user = await userRepo.create({name, password, email});
      const savedUser = await userRepo.save(user); 

       const mappings = warehouse_ids.map((warehouse_id: number) => ({
      user_id: savedUser.id,
      warehouse_id
    }));
    await userWarehouseRepo.insert(mappings); // Batch insert instead of loop

    return response.status(201).json({
      data: savedUser
    });
      // for (const warehouse_id of warehouse_ids) {
      //   await userWarehouseRepo.insert({ user_id: user.id, warehouse_id });
      // }

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

//   update = async (request: Request, response: Response) => {
//     const userRepo = db00.getRepository(User);
//     const userWarehouseRepo = db00.getRepository(UserWarehouse);
//     const { name, password, warehouse_ids } = request.body;
//     const { userId } = request.params;
//     console.log(userId,name,password,warehouse_ids);
//     // console.log(`warehouse_idslength: ${warehouse_ids.length}`);
    
//     if (!warehouse_ids.length) {
//       return response.status(400).json({ code: 400, message: "At least Select one warehouse" });
//     }

//     try {
//       const updatedData = await userRepo.update({ id: parseInt(userId) }, { name, password });
//       console.log("updateddata",updatedData);
      
//       if (updatedData.affected === 0) {
//         return response.status(404).json({ message: "User not found" });
//       }
//     } catch (error) {
//       console.log(error, "error on create");
//       if ((error as any).code === "ER_DUP_ENTRY") {
//         return response.status(409).json({ code: 409, message: "Duplicate entry error: the data already exists." });
//       }
//       return response.status(400).json({ code: 400, message: "error while inserting data" });
//     }
//     const numericWarehouseIds = warehouse_ids.map((id: any) => Number(id));
//     // console.log("numericWarehouseIds", numericWarehouseIds);


//     try {
//       // await userWarehouseRepo
//       //   .createQueryBuilder()
//       //   .delete()
//       //   .where("user_id = :userId", { userId })
//       //   .andWhere("warehouse_id NOT IN (:...warehouse_ids)", { warehouse_ids })
//       //   .execute();

//       await userWarehouseRepo
//   .createQueryBuilder()
//   .delete()
//   .where("user_id = :userId", { userId: Number(userId) }) // 💡 cast to number
//   .andWhere("warehouse_id NOT IN (:...warehouse_ids)", { warehouse_ids: numericWarehouseIds }) // 💡 converted
//   .execute();
  
// console.log(userId , numericWarehouseIds);

//       // await userWarehouseRepo.upsert(
//       //   warehouse_ids.map((warehouse_id: number) => ({
//       //     user_id: userId,
//       //     warehouse_id: warehouse_id
//       //   })),
//       //   ["user_id", "warehouse_id"] // Unique constraint fields
//       // );
      
//       await userWarehouseRepo.upsert(
//   numericWarehouseIds.map((warehouse_id: number) => ({
//     user_id: Number(userId),
//     warehouse_id
//   })),
//   ["user_id", "warehouse_id"]
// );

//     } catch (error) {
//       return response.status(400).json({ code: 400, message: "error while updating warehouses" });
//     }

//     return response.status(200).json({
//       data: {}
//     });
//   };


update = async (request: Request, response: Response) => {
  const userRepo = db00.getRepository(User);
  const userWarehouseRepo = db00.getRepository(UserWarehouse);
  const { name, password, warehouse_ids } = request.body;
  const { userId } = request.params;

  // console.log("Incoming Data:", userId, name, password, warehouse_ids);

  if (!Array.isArray(warehouse_ids) || warehouse_ids.length === 0) {
    return response.status(400).json({ code: 400, message: "At least select one warehouse" });
  }

  const numericWarehouseIds = warehouse_ids
    .map((id: any) => Number(id))
    .filter(id => !isNaN(id));

  if (!numericWarehouseIds.length) {
    return response.status(400).json({ code: 400, message: "No valid warehouse IDs provided" });
  }

  // Step 1: Update user
  try {
    const updatedData = await userRepo.update({ id: Number(userId) }, { name, password });

    // console.log("User Update Result:", updatedData);

    if (updatedData.affected === 0) {
      return response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("User update error:", error);
    if ((error as any).code === "ER_DUP_ENTRY") {
      return response.status(409).json({ code: 409, message: "Duplicate entry error: the data already exists." });
    }
    return response.status(400).json({ code: 400, message: "Error while updating user details" });
  }

  // Step 2: Update user_warehouses
  try {
    const deleteQuery = userWarehouseRepo
      .createQueryBuilder()
      .delete()
      .where("user_id = :userId", { userId: Number(userId) });

    if (numericWarehouseIds.length > 0) {
      deleteQuery.andWhere("warehouse_id NOT IN (:...warehouse_ids)", {
        warehouse_ids: numericWarehouseIds
      });
    }

    await deleteQuery.execute();

    // ->> Upsert Does not work with MSSql
    // await userWarehouseRepo.upsert(
    //   numericWarehouseIds.map((warehouse_id: number) => ({
    //     user_id: Number(userId),
    //     warehouse_id
    //   })),
    //   ["user_id", "warehouse_id"]
    // );

    // -->>> It Deletes previous entries and insert the new data

//     for (const warehouse_id of numericWarehouseIds) {
//   await userWarehouseRepo
//     .createQueryBuilder()
//     .insert()
//     .into(UserWarehouse)
//     .values({ user_id: Number(userId), warehouse_id })
//     .orIgnore() // prevents duplicate insert error
//     .execute();
// }
// for (const warehouse_id of numericWarehouseIds) {
//   await db00.query(`
//     MERGE INTO user_warehouses AS target
//     USING (SELECT ? AS user_id, ? AS warehouse_id) AS source
//     ON target.user_id = source.user_id AND target.warehouse_id = source.warehouse_id
//     WHEN NOT MATCHED THEN
//       INSERT (user_id, warehouse_id) VALUES (source.user_id, source.warehouse_id);
//   `, [Number(userId), warehouse_id]);
// }
for (const warehouse_id of numericWarehouseIds) {
  await db00.query(`
    IF NOT EXISTS (
      SELECT 1 FROM user_warehouses 
      WHERE user_id = @0 AND warehouse_id = @1
    )
    INSERT INTO user_warehouses (user_id, warehouse_id)
    VALUES (@0, @1);
  `, [Number(userId), warehouse_id]);
}


  } catch (error) {
    console.error("Warehouse update error:", error);
    return response.status(400).json({ code: 400, message: "Error while updating warehouses" });
  }

  return response.status(200).json({
    code: 200,
    message: "User updated successfully",
    data: {}
  });
};

  downloadActionSheets = async (request: Request, response: Response) => {
    const { name, id } = request.query;
    const userRepo = db00.getRepository(User);

    const user = await userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userWarehouses", "userWarehouse")
      .leftJoinAndSelect("userWarehouse.warehouse", "warehouse")
      .leftJoinAndSelect("warehouse.dealer", "dealer")
      .where("user.name = :name", { name })
      .orWhere("user.id = :id", { id })
      .getOne();

    const dealer = user?.userWarehouses[0]?.warehouse?.dealer;

    if (!dealer) {
      return response.status(400).json({
        message: "Bad Request, dealer doest exist"
      });
    }

    async function getUserReportUrls(user_id: number) {
      const userPortalRepo = db00.getRepository(UserPortal);

      const userPortals = await userPortalRepo.find({
        where: { user_id: user_id }
      });

      const reportIds = [];
      for (const portal of userPortals) {
        reportIds.push(...Object.keys(portal.report_config));
      }

      const portalReportsRepo = db00.getRepository(IntegratedPortalReport);
      const reports = await portalReportsRepo.find({
        where: { id: In(reportIds) },
        select: ["id", "action_sheet_url"]
      });

      return reports.reduce((urls: string[], report) => report.action_sheet_url ? [...urls, report.action_sheet_url] : urls, []);
    }

    const urls = await getUserReportUrls(user.id);

    return response.json({
      message: "success",
      data: urls
    });

    return response.status(200).json({});

  };


  assignReport = async (request: Request, response: Response) => {
    const { userId } = request.params;

    const { portalId, reportId, isAssigned } = request.body;
    const user_id = Number(userId)
    const portal_id = Number(portalId);
    const report_id = Number(reportId);
    // console.log(user_id,portal_id,report_id);
    
    const userPortalRepo = db00.getRepository(UserPortal);

    const userPortal = await userPortalRepo.findOne({
      where: { user_id: user_id, portal_id: portal_id }
    });
    // console.log(userPortal);
    
    // if (userPortal) {
    //   const reportConfig = userPortal.report_config || {};
    //   reportConfig[reportId] = Boolean(isAssigned);
    //   userPortal.report_config = reportConfig;

    //   await userPortalRepo.save(userPortal);
    // } else {
    //   console.log(`test`,1);
    //  try {
    //    await userPortalRepo.save({
    //      user_id: user_id,
    //      portal_id: portal_id,
    //      report_config: JSON.stringify({ [report_id]: Boolean(isAssigned) })
    //    });
    //  } catch (error) {
    //   console.log(error);
      
    //  }
    //   console.log("Record not found.");
    // }
    if (userPortal) {
  // Parse existing config string into an object
  const reportConfig = userPortal.report_config
    ? JSON.parse(userPortal.report_config)
    : {};

  // Modify config
  reportConfig[String(report_id)] = Boolean(isAssigned);

  // Store updated config as JSON string
  userPortal.report_config = JSON.stringify(reportConfig);
  await userPortalRepo.save(userPortal);
} else {
  try {
    await userPortalRepo.save({
      user_id,
      portal_id,
      report_config: JSON.stringify({ [String(report_id)]: Boolean(isAssigned) }),
    });
  } catch (error) {
    console.log(error);
  }
  console.log("Record not found.");
}
    response.status(200).json({
      data: {}
    });
  };

  updatePortalRuntimeConfig = async (request: Request, response: Response) => {
    const { userId, portalId } = request.params;
    const { config } = request.body;
    const user_id = Number(userId);
    const portal_id = Number(portalId);

    const userPortalRepo = db00.getRepository(UserPortal);
    //
    const userPortal = await userPortalRepo.findOne({
      where: { user_id: user_id, portal_id: portal_id }
    });
    // console.log(userPortal);
    
    //
    if (userPortal) {
      // const runtimeConfig: any = userPortal.runtime_config || {};
      // userPortal.runtime_config = { ...runtimeConfig, ...config };
      const runtimeConfig = userPortal.runtime_config
  ? JSON.parse(userPortal.runtime_config)
  : {};
  userPortal.runtime_config = JSON.stringify({ ...runtimeConfig, ...config });



      await userPortalRepo.save(userPortal);
    }


    response.status(200).json({
      data: {}
    });
  };

  getAssignedPortalReports = async (request: Request, response: Response) => {
    const user_id = request.params.userId;
    const userId = Number(user_id);
    const userPortalRepo = db00.getRepository(UserPortal);

    const userPortals = await userPortalRepo.find({
      where: { user_id: userId }
    });

    response.status(200).json({
      data: userPortals
    });
  };
}
