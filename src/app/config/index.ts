import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';
import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') });


export default {
    port: process.env.PORT || 5000,
    bcrypt_salt: process.env.BCRYPT_SALT,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    client_url: process.env.CLIENT_URL!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
}