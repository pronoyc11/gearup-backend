import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";



const fetchAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await adminService.fetchAllUsers();


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: allUsers
    })
})

const fetchSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.fetchSingleUser(req.params.userId as string);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User retrieved successfully",
        data: result
    })
})

const fetchAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query;
    const result = await adminService.fetchAllGears(query);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gears retrieved successfully",
        data: result
    })
})
const fetchAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await adminService.fetchAllRentals(query);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rentals retrieved successfully",
        data: result
    })
})
const updateUserStatusByAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    const result = await adminService.updateUserStatusByAdmin(userId as string, req.body);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "userStatus updated successfully",
        data: result
    })
})

export const adminController = {
    fetchAllUsers,
    fetchSingleUser,
    fetchAllGears,
    fetchAllRentals,
    updateUserStatusByAdmin
}