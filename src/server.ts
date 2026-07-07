import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";

const PORT = config.port;


const main = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    await prisma.$connect()
    console.log(`Database connected successfully.`);
  } catch (error: any) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();