import { User } from "@prisma/client"
import { Request } from "express"




export class IExtendedRequest extends Request {
    user: User
}
