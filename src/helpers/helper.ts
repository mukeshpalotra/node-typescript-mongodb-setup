import { Request, Response } from "express";
import crypto from "crypto";
import os from "os";
import { readFileSync } from "fs";
import jwt from 'jsonwebtoken';

import dotenv from "dotenv"
dotenv.config()
export const generateSixDigitRandomNumber = (): number => {
    const min = 1000;
    const max = 9999;
    const range = max - min;
    const byteLength = Math.ceil(Math.log2(range + 1) / 8);
    const randomBytes = crypto.randomBytes(byteLength);
    const randomNumber = randomBytes.readUIntBE(0, byteLength) % range + min;
    return randomNumber;
}
export const makeUniqueAlphaNumeric = (length: number) => {
    var result = '';
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const getLocaleMessages = (): Record<string, string> => {
    const language = "en";
    const data = readFileSync(__basedir + "locals/" + language + ".json");
    return JSON.parse(data.toString());
};

export const getLocalIp = (): string | undefined => {
    const interfaces = os.networkInterfaces();
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]!) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return `http://${iface.address}:${process.env.PORT}/`;
            }
        }
    }
}

let accessTokens = [], refreshTokens = []
export const generateAccessToken = (user: object): string | undefined => {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', {
        expiresIn: "2d",
    });
    accessTokens.push(accessToken);
    return accessToken;
}

export const generateRefreshToken = (user: object): string | undefined => {
    const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', {
        expiresIn: "30day",
    });
    refreshTokens.push(refreshToken);
    return refreshToken;
}

