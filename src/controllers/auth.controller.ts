import { Request, Response } from "express";

export const authLogout = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            return res.redirect('/');
        }
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/');
            }
            res.redirect('/');
        });
    });
};