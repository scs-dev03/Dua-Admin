import {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';

/**
 * 
 */
export class MediaController {
  constructor() {}

  upload = async (request: Request, response: Response) => {
    const file = request.file
    if (!file) {
      return response.status(400).json({
        message: 'File is missing!'
      })
    }

    const data = {
      filename: file.filename,
      originalName: file.originalname,
    }
    
    return response.status(200).json({
      message: 'Media Uploaded successfully',
      data: data,
    });
  };

  delete = async (request: Request, response: Response) => {
    const { filename } = request.params;
    const filePath = path.join(process.cwd(), 'storage', 'uploads', filename);
    
    try {
      fs.unlinkSync(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
          response.status(400).json({ 
            message: 'file doesn\'t exist',
          });
      } else {
        response.status(500).json({
          message: 'Error while deleting file',
        });
      }
    }

    response.status(200).json({
      message: 'Media Deleted successfully',
      data: {},
    });
  };

  download = async (request: Request, response: Response) => {
    const { filename } = request.params;
    const filePath = path.join(process.cwd(), 'storage', 'uploads', filename);
    const isFileExist = fs.existsSync(filePath)

    if (!isFileExist) {
      response.status(400).json({
        message: 'File does not exist'
      })
    }

    response.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return response.status(404).json({
            message: 'File not found or error occurred while downloading',
            error: err.message,
        });
      }
      return;
    });
  };
}
