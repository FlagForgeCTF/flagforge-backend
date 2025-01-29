// src/types/passport.d.ts
declare module 'passport' {
    import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
  
    export interface PassportStatic {
      authenticate(arg0: string, arg1: { scope: string[]; prompt: string; }): import("express-serve-static-core").RequestHandler<{}, any, any, qs.ParsedQs, Record<string, any>>;
      use(strategy: GoogleStrategy): void;
      serializeUser(callback: (user: any, done: Function) => void): void;
      deserializeUser(callback: (id: string, done: Function) => void): void;
      initialize(): Function;
      session(): Function;
    }
  
    const passport: PassportStatic;
    export default passport;
  }
  