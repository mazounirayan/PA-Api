import { NextFunction, Response, Request } from "express";
import { AppDataSource } from "../../database/database";
import { Token } from "../../database/entities/token";
import { verify } from "jsonwebtoken";




export const authMiddlewareAll = async (req: Request, res: Response, next: NextFunction) => {

    
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({"error": "Unauthorized"});

    const token = authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({"error": "Unauthorized"});

    const tokenRepo = AppDataSource.getRepository(Token)

    const tokenFound = await tokenRepo
    .createQueryBuilder("token")
    .innerJoinAndSelect("token.user", "user")
    .where("token.token = :token", { token })
    .getOne();


    if (!tokenFound) {
        return res.status(403).json({"error": "Access Forbidden"});
    }

    if (tokenFound.user.role !== "Adherent" && tokenFound.user.role !== "Administrateur") {
        return res.status(403).json({"error": "Access Denied: User role required"});
    }
    
    const secret = process.env.JWT_SECRET ?? ""

    verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({"error": "Access Forbidden"});
        (req as any).user = user;
        next();
    });
}



export const authMiddlewareAdminstrateur = async (req: Request, res: Response, next: NextFunction) => {
    
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({"error": "Unauthorized"});

    const token = authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({"error": "Unauthorized"});

    const tokenRepo = AppDataSource.getRepository(Token)

    const tokenFound = await tokenRepo
    .createQueryBuilder("token")
    .innerJoinAndSelect("token.user", "user")
    .where("token.token = :token", { token })
    .getOne();

    if (!tokenFound) {
        return res.status(403).json({"error": "Access Forbidden"})
    }


    if (tokenFound.user.role !== "Administrateur") {
        return res.status(403).json({"error": "Access Denied: Administrator role required"});
    }
    
    const secret = process.env.JWT_SECRET ?? ""

    verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({"error": "Access Forbidden"});
        (req as any).user = user;
        next();
    });
}

export const authMiddlewareAdherent = async (req: Request, res: Response, next: NextFunction) => {
    
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({"error": "Unauthorized"});

    const token = authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({"error": "Unauthorized"});

    const tokenRepo = AppDataSource.getRepository(Token)

    const tokenFound = await tokenRepo
    .createQueryBuilder("token")
    .innerJoinAndSelect("token.user", "user")
    .where("token.token = :token", { token })
    .getOne();


    if (!tokenFound) {
        return res.status(403).json({"error": "Access Forbidden"});
    }

    if (tokenFound.user.role !== "Adherent") {
        return res.status(403).json({"error": "Access Denied: User role required"});
    }
    
    const secret = process.env.JWT_SECRET ?? ""

    verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({"error": "Access Forbidden"});
        (req as any).user = user;
        next();
    });

}

