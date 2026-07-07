import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
// import type { GearCreateManyInput } from "./generated/prisma/client";
import { GearAvailability } from "./generated/prisma/enums";

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const gearData = [
    {
        providerId: "818c7955-aea3-48a6-a256-4f2f2284574a",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "Canon EOS R6 Mark II",
        description: "Professional full-frame mirrorless camera suitable for photography and videography.",
        brand: "Canon",
        pricePerDay: 3500.0,
        stock: 3,
        specifications: {
            sensor: "24.2MP Full Frame CMOS",
            video: "4K 60fps",
            autofocus: "Dual Pixel CMOS AF II",
            battery: "LP-E6NH",
            weight: "670g"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/canon-r6.jpg"
    },
    {
        providerId: "a51a84d4-7ced-4cde-87d6-1619b67b3f3f",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "Sony FE 24-70mm f/2.8 GM II",
        description: "Premium standard zoom lens for Sony full-frame mirrorless cameras.",
        brand: "Sony",
        pricePerDay: 2200.0,
        stock: 5,
        specifications: {
            mount: "Sony E",
            focalLength: "24-70mm",
            aperture: "f/2.8",
            filterSize: "82mm",
            weight: "695g"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/sony-24-70.jpg"
    },
    {
        providerId: "bbf770ed-7aec-4408-ae06-082f30c2cfca",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "DJI Air 3",
        description: "Compact drone with dual-camera system and extended flight time.",
        brand: "DJI",
        pricePerDay: 4500.0,
        stock: 2,
        specifications: {
            camera: "48MP",
            video: "4K 100fps",
            flightTime: "46 minutes",
            range: "20 km",
            weight: "720g"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/dji-air3.jpg"
    },
    {
        providerId: "c9509188-70c6-4665-8f35-2f5ac83d24f5",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "Godox SL150II LED Video Light",
        description: "High-power LED light ideal for studio photography and video production.",
        brand: "Godox",
        pricePerDay: 1200.0,
        stock: 8,
        specifications: {
            power: "150W",
            colorTemperature: "5600K",
            cri: "96+",
            cooling: "Silent Fan",
            mount: "Bowens"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/godox-sl150ii.jpg"
    },
    {
        providerId: "d993e8b2-1459-422e-a512-7a38b2ccba21",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "Rode Wireless GO II",
        description: "Dual-channel wireless microphone system for creators and filmmakers.",
        brand: "Rode",
        pricePerDay: 1000.0,
        stock: 10,
        specifications: {
            range: "200m",
            batteryLife: "7 hours",
            channels: 2,
            storage: "On-board recording",
            connectivity: "USB-C"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/rode-wireless-go2.jpg"
    },
    {
        providerId: "818c7955-aea3-48a6-a256-4f2f2284574a",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "Manfrotto Befree Advanced",
        description: "Travel-friendly aluminum tripod with ball head.",
        brand: "Manfrotto",
        pricePerDay: 700.0,
        stock: 6,
        specifications: {
            material: "Aluminum",
            maxHeight: "150cm",
            loadCapacity: "9kg",
            weight: "1.6kg"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/manfrotto-befree.jpg"
    },
    {
        providerId: "a51a84d4-7ced-4cde-87d6-1619b67b3f3f",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "Sony A7 IV",
        description: "Versatile hybrid full-frame mirrorless camera.",
        brand: "Sony",
        pricePerDay: 3800.0,
        stock: 4,
        specifications: {
            sensor: "33MP Full Frame",
            video: "4K 60fps",
            autofocus: "759-point AF",
            battery: "NP-FZ100"
        },
        availability: GearAvailability.MAINTENANCE,
        image: "https://example.com/images/sony-a7iv.jpg"
    },
    {
        providerId: "bbf770ed-7aec-4408-ae06-082f30c2cfca",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "DJI RS 4",
        description: "Professional 3-axis camera stabilizer.",
        brand: "DJI",
        pricePerDay: 1800.0,
        stock: 3,
        specifications: {
            payload: "3kg",
            batteryLife: "12 hours",
            weight: "1.2kg",
            axis: 3
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/dji-rs4.jpg"
    },
    {
        providerId: "c9509188-70c6-4665-8f35-2f5ac83d24f5",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "MacBook Pro 16-inch M4 Pro",
        description: "High-performance laptop for video editing and software development.",
        brand: "Apple",
        pricePerDay: 5000.0,
        stock: 2,
        specifications: {
            processor: "Apple M4 Pro",
            memory: "24GB",
            storage: "1TB SSD",
            display: "16.2-inch Liquid Retina XDR"
        },
        availability: GearAvailability.MAINTENANCE,
        image: "https://example.com/images/macbook-pro-m4.jpg"
    },
    {
        providerId: "d993e8b2-1459-422e-a512-7a38b2ccba21",
        categoryId: "1dce93c5-0e5f-465b-80ee-82bc0130de82",
        title: "Epson EB-FH52",
        description: "Full HD business and presentation projector.",
        brand: "Epson",
        pricePerDay: 2500.0,
        stock: 2,
        specifications: {
            resolution: "1920x1080",
            brightness: "4000 Lumens",
            contrastRatio: "16000:1",
            connectivity: ["HDMI", "USB", "VGA"]
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/epson-eb-fh52.jpg"
    },
    {
        providerId: "818c7955-aea3-48a6-a256-4f2f2284574a",
        categoryId: "54442450-8097-41e9-856b-b4efcd4bcbc5",
        title: "4-Person Camping Tent",
        description: "Waterproof 4-person dome tent suitable for family camping and hiking trips.",
        brand: "Coleman",
        pricePerDay: 800.0,
        stock: 10,
        specifications: {
            capacity: "4 Person",
            material: "Polyester",
            waterproof: true,
            weight: "4.5kg",
            color: "Green"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/camping-tent.jpg"
    },
    {
        providerId: "a51a84d4-7ced-4cde-87d6-1619b67b3f3f",
        categoryId: "54442450-8097-41e9-856b-b4efcd4bcbc5",
        title: "Sleeping Bag - 0°C",
        description: "Comfortable sleeping bag designed for cold weather camping.",
        brand: "Naturehike",
        pricePerDay: 300.0,
        stock: 20,
        specifications: {
            temperatureRating: "0°C",
            material: "Nylon",
            weight: "1.6kg",
            shape: "Mummy"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/sleeping-bag.jpg"
    },
    {
        providerId: "bbf770ed-7aec-4408-ae06-082f30c2cfca",
        categoryId: "5b8fc5f3-a0d6-41c8-940c-53724a765655",
        title: "Mountain Bike 29\"",
        description: "Aluminum frame mountain bike with hydraulic disc brakes.",
        brand: "Giant",
        pricePerDay: 1200.0,
        stock: 8,
        specifications: {
            frame: "Aluminum",
            wheelSize: "29 inch",
            gears: 21,
            brakes: "Hydraulic Disc"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/mountain-bike.jpg"
    },
    {
        providerId: "c9509188-70c6-4665-8f35-2f5ac83d24f5",
        categoryId: "5b8fc5f3-a0d6-41c8-940c-53724a765655",
        title: "Cycling Helmet",
        description: "Lightweight safety helmet with adjustable fit.",
        brand: "Giro",
        pricePerDay: 200.0,
        stock: 25,
        specifications: {
            size: "M/L",
            weight: "280g",
            certification: "CE Certified",
            ventilation: 22
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/cycling-helmet.jpg"
    },
    {
        providerId: "d993e8b2-1459-422e-a512-7a38b2ccba21",
        categoryId: "c7db8f5b-22b7-4f60-9dfc-2b289b66eb12",
        title: "Adjustable Dumbbell Set",
        description: "Pair of adjustable dumbbells from 5kg to 25kg.",
        brand: "Bowflex",
        pricePerDay: 700.0,
        stock: 12,
        specifications: {
            weightRange: "5-25kg",
            material: "Steel",
            adjustable: true
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/dumbbells.jpg"
    },
    {
        providerId: "818c7955-aea3-48a6-a256-4f2f2284574a",
        categoryId: "c7db8f5b-22b7-4f60-9dfc-2b289b66eb12",
        title: "Treadmill Pro X200",
        description: "Foldable motorized treadmill with incline settings.",
        brand: "NordicTrack",
        pricePerDay: 2500.0,
        stock: 4,
        specifications: {
            motor: "2.5 HP",
            maxSpeed: "18 km/h",
            incline: "15%",
            foldable: true
        },
        availability: GearAvailability.MAINTENANCE,
        image: "https://example.com/images/treadmill.jpg"
    },
    {
        providerId: "a51a84d4-7ced-4cde-87d6-1619b67b3f3f",
        categoryId: "d4478220-c91d-4057-8624-f4d7a0a40835",
        title: "FIFA Quality Football",
        description: "Official size 5 football suitable for professional matches.",
        brand: "Adidas",
        pricePerDay: 150.0,
        stock: 30,
        specifications: {
            size: 5,
            material: "PU Leather",
            certification: "FIFA Quality Pro",
            color: "White/Black"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/football.jpg"
    },
    {
        providerId: "bbf770ed-7aec-4408-ae06-082f30c2cfca",
        categoryId: "d4478220-c91d-4057-8624-f4d7a0a40835",
        title: "Football Goal Post Set",
        description: "Portable football goal post for training and small matches.",
        brand: "QuickPlay",
        pricePerDay: 600.0,
        stock: 6,
        specifications: {
            dimensions: "12ft x 6ft",
            material: "Steel",
            portable: true
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/goal-post.jpg"
    },
    {
        providerId: "c9509188-70c6-4665-8f35-2f5ac83d24f5",
        categoryId: "d1997430-1d28-49e0-86fc-154ce0faafa0",
        title: "Adult Swimming Fins",
        description: "Comfortable swimming fins for training and snorkeling.",
        brand: "Speedo",
        pricePerDay: 180.0,
        stock: 18,
        specifications: {
            size: "42-44",
            material: "Silicone",
            color: "Blue"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/swimming-fins.jpg"
    },
    {
        providerId: "818c7955-aea3-48a6-a256-4f2f2284574a",
        categoryId: "d1997430-1d28-49e0-86fc-154ce0faafa0",
        title: "Swimming Goggles",
        description: "Anti-fog UV protection swimming goggles for adults.",
        brand: "Arena",
        pricePerDay: 120.0,
        stock: 40,
        specifications: {
            antiFog: true,
            uvProtection: true,
            lens: "Polycarbonate",
            strap: "Silicone"
        },
        availability: GearAvailability.AVAILABLE,
        image: "https://example.com/images/swimming-goggles.jpg"
    }
];

async function main() {
    console.log(`Seeding ${gearData.length} gear records...`);
    await prisma.gear.createMany({
        data: gearData as any,
        skipDuplicates: true,
    });
    console.log("Gear seed complete.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
