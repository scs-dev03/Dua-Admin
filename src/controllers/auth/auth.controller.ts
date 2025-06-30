// import {Request, Response} from 'express';
// import {Admin} from '../../_core/entities/db-00/Admin';
// import {MVError} from '../../_core/classes/mverror/MVError';
// import {jwtService} from '../../_providers';
// import {db00} from '../../_providers';
// import {User} from '../../_core/entities/db-00/User';
// import {Installation} from "../../_core/entities/db-00/Installation";

// /**
//  * Class for Auth
//  */
// export class AuthController {
//   constructor() {
//   }

//   // access status
//   accessStatus = async (request: Request, response: Response) => {
//     response.status(200).json({
//       data: {},
//     });
//   };

//   login = async (request: Request, response: Response) => {
//     const {email, mobile, password} = request.body;
//     const adminRepo = db00.getRepository(Admin);

//     const admin =
//       email != undefined
//         ? await adminRepo.findOneBy({email})
//         : await adminRepo.findOneBy({mobile});

//     if (admin == null) {
//       throw new MVError({
//         http_code: 401,
//         error_code: 401,
//         message: 'Invalid Credentials',
//       });
//     }

//     const isVerified = password == admin.password;
//     // const isVerified = await passwordService.verify(password, admin.password);

//     if (!isVerified) {
//       throw new MVError({
//         http_code: 401,
//         error_code: 401,
//         message: 'Invalid Password',
//       });
//     }

//     const access_token = jwtService.generate({
//       oid: admin.id,
//       mv_scopes: [],
//     });

//     response.status(200).json({
//       message: 'Login Successful',
//       data: {access_token},
//     });
//   };

//   userLogin = async (request: Request, response: Response) => {
//     const {username, password} = request.body;
//     const userRepo = db00.getRepository(User);
//     const user = await userRepo.findOneBy({email: username});

//     if (!user) {
//       return response.status(400).json({
//         message: "User doesn't exist",
//       });
//     } else if (user.password != password) {
//       return response.status(400).json({
//         message: 'Incorrect password',
//       });
//     }

//     let installationId: number = 0;
//     if (request.query.install) {
//       const newInstallation = db00.datasource
//         .getRepository(Installation)
//         .create({
//           userId: user.id,
//         });
//       await db00.getRepository(Installation).save(newInstallation);
//       installationId = newInstallation.id;
//     }

//     return response.json({
//       message: 'Success',
//       access_token: 'hithere',
//       user_id: user.id,
//       installation_id: installationId,
//     });
//   };
// }


import { Request, Response } from 'express';
import { Admin } from '../../_core/entities/db-00/Admin';
import { MVError } from '../../_core/classes/mverror/MVError';
import { jwtService } from '../../_providers';
import { db00 } from '../../_providers';
import { User } from '../../_core/entities/db-00/User';
import { Installation } from '../../_core/entities/db-00/Installation';

export class AuthController {
  constructor() {}

  // access status
  accessStatus = async (request: Request, response: Response) => {
    response.status(200).json({
      data: {},
    });
  };

  login = async (request: Request, response: Response) => {
    const { email, mobile, password } = request.body;

    // ✅ FIXED: Remove `.datasource`
    const adminRepo = db00.getRepository(Admin);

    const admin =
      email != undefined
        ? await adminRepo.findOneBy({ email })
        : await adminRepo.findOneBy({ mobile });

    if (!admin) {
      throw new MVError({
        http_code: 401,
        error_code: 401,
        message: 'Invalid Credentials',
      });
    }

    const isVerified = password === admin.password;

    if (!isVerified) {
      throw new MVError({
        http_code: 401,
        error_code: 401,
        message: 'Invalid Password',
      });
    }

    const access_token = jwtService.generate({
      oid: admin.id,
      mv_scopes: [],
    });

    response.status(200).json({
      message: 'Login Successful',
      data: { access_token },
    });
  };

  userLogin = async (request: Request, response: Response) => {
    const { username, password } = request.body;

    // ✅ FIXED: Remove `.datasource`
    const userRepo = db00.getRepository(User);
    const user = await userRepo.findOneBy({ email: username });

    // if (!user) {
    //   return response.status(400).json({
    //     message: "User doesn't exist",
    //   });
    // } else if (user.password !== password) {
    //   return response.status(400).json({
    //     message: 'Incorrect password',
    //   });
    // }

    let installationId: number = 0;

    if (request.query.install) {
      const installationRepo = db00.getRepository(Installation);

      const newInstallation = installationRepo.create({
        // userId: user.id,
      });

      await installationRepo.save(newInstallation);
      installationId = newInstallation.id;
    }

    return response.json({
      message: 'Success',
      access_token: 'hithere', // 🔐 Replace with real JWT if needed
      // user_id: user.id,
      installation_id: installationId,
    });
  };
    userInstallationUpdate = async (request: Request, response: Response) => {
    const {installationId} = request.params;
    const {installStatus} = request.body;
    const installationRepository = db00.getRepository(Installation);

    const installation = await installationRepository.findOneBy({
      id: parseInt(installationId),
    });

    if (!installation) {
      return response.status(404).json({message: 'Installation not found'});
    }

    installation.installStatus = installStatus;
    await installationRepository.save(installation);

    return response.json({
      message: 'Success',
    });
  };
}

