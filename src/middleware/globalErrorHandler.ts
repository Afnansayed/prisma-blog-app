import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";


function errorHandler (err: any, req: Request, res:Response, next:NextFunction) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;  
 
  if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = 400;
    errorMessage = "Validation failed due to incorrect field types or missing required fields.";
  }
  else if(err instanceof Prisma.PrismaClientKnownRequestError){
    switch(err.code){
      case "P2002":
        statusCode = 409;
        errorMessage = `Unique constraint failed on the ${err?.meta?.target}`;
        break;
      case "P2003":
        statusCode = 400;
        errorMessage = `Foreign key constraint failed on the field: ${err?.meta?.field_name}`;
        break;  
      case "P2025":
        statusCode = 404;
        errorMessage = `Record not found. It may have been deleted or the ID is invalid.`;
        break;  
      default:
        statusCode = 400;
        errorMessage = err.message;
    }
  }
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
  statusCode = 500;
  errorMessage = "An unexpected database error occurred. Please try again later.";
  }
else if (err instanceof Prisma.PrismaClientRustPanicError) {
  statusCode = 500;
  errorMessage = "An internal server error occurred. Please try again later.";
}
else if (err instanceof Prisma.PrismaClientInitializationError) {
  statusCode = 503;

  switch (err.errorCode) {
    case "P1000":
      errorMessage =
        "Unable to authenticate with the database. Please try again later.";
      break;

    case "P1001":
      errorMessage =
        "Database service is currently unavailable. Please try again later.";
      break;

    default:
      errorMessage =
        "Failed to initialize database connection. Please try again later.";
  }
}



  res.status(statusCode)
  res.json({
    message: errorMessage,
    error: errorDetails
  })
}


export default errorHandler;
