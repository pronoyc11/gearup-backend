import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearService } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";



const createGearItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user?.id;
    const gear = await gearService.createGearItem(providerId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear created Successfully.",
        data: gear
    })
});

const getAllGearItems = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query
    const result = await gearService.getAllGearItems(query);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear Items retrieved successfully",
        data: result
    })
})

const getSingleGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.gearId;
    const gear = await gearService.getSingleGearByIdFromDB(gearId as string);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear Item retrieved successfully",
        data: gear
    })
})

const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.user?.id;
    const gearId = req.params.gearId;
    const result = await gearService.updateGearInDB(id as string, gearId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear updated successfully.",
        data: result
    })

})

const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const gearId = req.params.gearId;
    const isAdmin = req.user?.role === 'ADMIN';
    const result = await gearService.deleteGearFromDB(id as string, gearId as string, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear deleted successfully.",
        data: result
    })

})
export const gearController = {
    createGearItem,
    getAllGearItems,
    getSingleGearById,
    updateGear,
    deleteGear
}