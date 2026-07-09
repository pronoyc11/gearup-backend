import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma/client";
// import type { GearCreateManyInput } from "./generated/prisma/client";
import {
    GearAvailability,
    PaymentStatus,
    RentalStatus,
    UserRole,
    UserStatus,
} from "./generated/prisma/enums";

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

const seedCategories = [
    { name: "Strength Training", description: "Weights, racks, benches, and strength equipment." },
    { name: "Cardio Equipment", description: "Treadmills, rowers, bikes, and conditioning machines." },
    { name: "Football", description: "Footballs, goals, cones, bibs, and training kits." },
    { name: "Basketball", description: "Basketballs, hoops, and court training equipment." },
    { name: "Cricket", description: "Bats, pads, helmets, wickets, balls, and practice nets." },
    { name: "Racket Sports", description: "Badminton, tennis, squash, and table tennis equipment." },
    { name: "Combat Sports", description: "Boxing, MMA, and martial arts training gear." },
    { name: "Outdoor Fitness", description: "Cycling, running, and field training equipment." },
] as const;

const seedUsers = [
    {
        name: "GearUp Admin",
        email: "admin@gearup.test",
        role: UserRole.ADMIN,
        phone: "+8801700000001",
        address: "Gulshan, Dhaka",
    },
    {
        name: "Iron House Rentals",
        email: "ironhouse@gearup.test",
        role: UserRole.PROVIDER,
        phone: "+8801700000002",
        address: "Banani, Dhaka",
    },
    {
        name: "Pitch Perfect Sports",
        email: "pitchperfect@gearup.test",
        role: UserRole.PROVIDER,
        phone: "+8801700000003",
        address: "Mirpur, Dhaka",
    },
    {
        name: "Court Side Supply",
        email: "courtside@gearup.test",
        role: UserRole.PROVIDER,
        phone: "+8801700000004",
        address: "Dhanmondi, Dhaka",
    },
    {
        name: "Ayesha Rahman",
        email: "ayesha@gearup.test",
        role: UserRole.CUSTOMER,
        phone: "+8801700000005",
        address: "Uttara, Dhaka",
    },
    {
        name: "Tanvir Hasan",
        email: "tanvir@gearup.test",
        role: UserRole.CUSTOMER,
        phone: "+8801700000006",
        address: "Mohammadpur, Dhaka",
    },
    {
        name: "Nabila Karim",
        email: "nabila@gearup.test",
        role: UserRole.CUSTOMER,
        phone: "+8801700000007",
        address: "Bashundhara R/A, Dhaka",
    },
] as const;

const seedGearItems = [
    {
        providerEmail: "ironhouse@gearup.test",
        categoryName: "Strength Training",
        title: "Bowflex SelectTech 552 Adjustable Dumbbells",
        description: "Pair of adjustable dumbbells for home gym strength sessions.",
        brand: "Bowflex",
        pricePerDay: "700.00",
        stock: 10,
        specifications: { weightRange: "2.5kg to 24kg each", included: ["2 dumbbells", "storage trays"] },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
    },
    {
        providerEmail: "ironhouse@gearup.test",
        categoryName: "Strength Training",
        title: "Olympic Barbell and Bumper Plate Set",
        description: "Competition-style barbell with bumper plates for deadlifts, squats, and presses.",
        brand: "Rogue Fitness",
        pricePerDay: "1200.00",
        stock: 5,
        specifications: { barLength: "7ft", maxLoad: "315kg", plates: ["5kg", "10kg", "15kg", "20kg"] },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f",
    },
    {
        providerEmail: "ironhouse@gearup.test",
        categoryName: "Strength Training",
        title: "Foldable Squat Rack",
        description: "Space-saving squat rack with pull-up bar and safety arms.",
        brand: "PRx Performance",
        pricePerDay: "1500.00",
        stock: 3,
        specifications: { height: "229cm", capacity: "450kg", features: ["pull-up bar", "j-cups", "safety arms"] },
        availability: GearAvailability.MAINTENANCE,
        image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    },
    {
        providerEmail: "ironhouse@gearup.test",
        categoryName: "Cardio Equipment",
        title: "NordicTrack Commercial Treadmill",
        description: "Motorized treadmill with incline control for endurance and interval training.",
        brand: "NordicTrack",
        pricePerDay: "2500.00",
        stock: 4,
        specifications: { motor: "3.5 CHP", maxSpeed: "20 km/h", incline: "0-15%", foldable: true },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
    },
    {
        providerEmail: "ironhouse@gearup.test",
        categoryName: "Cardio Equipment",
        title: "Concept2 RowErg",
        description: "Indoor rowing machine for low-impact full-body conditioning.",
        brand: "Concept2",
        pricePerDay: "1800.00",
        stock: 6,
        specifications: { monitor: "PM5", resistance: "Air", userCapacity: "227kg" },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
    },
    {
        providerEmail: "pitchperfect@gearup.test",
        categoryName: "Football",
        title: "Adidas UEFA Match Football",
        description: "Size 5 match football suitable for club games and training.",
        brand: "Adidas",
        pricePerDay: "150.00",
        stock: 30,
        specifications: { size: 5, material: "PU leather", certification: "FIFA Quality Pro" },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1551958219-acbc608c6377",
    },
    {
        providerEmail: "pitchperfect@gearup.test",
        categoryName: "Football",
        title: "Portable Football Goal Pair",
        description: "Pair of portable goals for five-a-side matches and training drills.",
        brand: "QuickPlay",
        pricePerDay: "600.00",
        stock: 8,
        specifications: { dimensions: "12ft x 6ft", setupTime: "3 minutes", includesCarryBag: true },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
    },
    {
        providerEmail: "courtside@gearup.test",
        categoryName: "Basketball",
        title: "Spalding NBA Basketball",
        description: "Indoor and outdoor basketball for training and pickup games.",
        brand: "Spalding",
        pricePerDay: "180.00",
        stock: 20,
        specifications: { size: 7, material: "Composite leather", use: ["indoor", "outdoor"] },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },
    {
        providerEmail: "courtside@gearup.test",
        categoryName: "Basketball",
        title: "Portable Basketball Hoop",
        description: "Adjustable hoop system for driveway, school, or event courts.",
        brand: "Lifetime",
        pricePerDay: "900.00",
        stock: 5,
        specifications: { backboard: "44 inch polycarbonate", heightRange: "7.5ft to 10ft", wheels: true },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1519861531473-9200262188bf",
    },
    {
        providerEmail: "pitchperfect@gearup.test",
        categoryName: "Cricket",
        title: "Kookaburra Kahuna Cricket Bat",
        description: "English willow cricket bat for match play and net sessions.",
        brand: "Kookaburra",
        pricePerDay: "500.00",
        stock: 10,
        specifications: { willow: "English willow", size: "Short handle", weight: "2lb 9oz" },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
    },
    {
        providerEmail: "pitchperfect@gearup.test",
        categoryName: "Cricket",
        title: "Cricket Protective Kit",
        description: "Pads, gloves, thigh guard, arm guard, and helmet for batting safety.",
        brand: "Gray-Nicolls",
        pricePerDay: "650.00",
        stock: 7,
        specifications: { size: "Adult", includes: ["helmet", "batting pads", "gloves", "guards"] },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972",
    },
    {
        providerEmail: "courtside@gearup.test",
        categoryName: "Racket Sports",
        title: "Yonex Astrox Badminton Racket Set",
        description: "Two-racket badminton set with shuttlecocks for doubles practice.",
        brand: "Yonex",
        pricePerDay: "300.00",
        stock: 14,
        specifications: { rackets: 2, weight: "4U", shuttlecocks: 6 },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
    },
    {
        providerEmail: "courtside@gearup.test",
        categoryName: "Combat Sports",
        title: "Everlast Boxing Glove and Pad Kit",
        description: "Boxing gloves and focus mitts for sparring practice and coaching.",
        brand: "Everlast",
        pricePerDay: "450.00",
        stock: 12,
        specifications: { gloveWeight: "14oz", mitts: 2, material: "Synthetic leather" },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed",
    },
    {
        providerEmail: "ironhouse@gearup.test",
        categoryName: "Outdoor Fitness",
        title: "Giant Talon Mountain Bike",
        description: "Trail-ready mountain bike for outdoor fitness rides and weekend events.",
        brand: "Giant",
        pricePerDay: "1200.00",
        stock: 6,
        specifications: { frame: "Aluminum", wheelSize: "29 inch", gears: 21, brakes: "Hydraulic disc" },
        availability: GearAvailability.AVAILABLE,
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
    },
] as const;

const seedRentals = [
    {
        customerEmail: "ayesha@gearup.test",
        gearTitle: "Concept2 RowErg",
        quantity: "1",
        totalAmount: "5400.00",
        startDate: "2026-07-01",
        endDate: "2026-07-04",
        status: RentalStatus.RETURNED,
        payment: { amount: "5400.00", transactionId: "seed_txn_rowerg_001", status: PaymentStatus.SUCCESS, paidAt: "2026-06-30T10:30:00.000Z" },
        review: { rating: 5, comment: "Clean machine, smooth pickup, and perfect for our group session." },
    },
    {
        customerEmail: "tanvir@gearup.test",
        gearTitle: "Adidas UEFA Match Football",
        quantity: "4",
        totalAmount: "1200.00",
        startDate: "2026-07-05",
        endDate: "2026-07-07",
        status: RentalStatus.PAID,
        payment: { amount: "1200.00", transactionId: "seed_txn_football_002", status: PaymentStatus.SUCCESS, paidAt: "2026-07-04T15:15:00.000Z" },
    },
    {
        customerEmail: "nabila@gearup.test",
        gearTitle: "Portable Basketball Hoop",
        quantity: "1",
        totalAmount: "2700.00",
        startDate: "2026-07-10",
        endDate: "2026-07-13",
        status: RentalStatus.CONFIRMED,
        payment: { amount: "2700.00", transactionId: "seed_txn_hoop_003", status: PaymentStatus.PENDING, paidAt: null },
    },
    {
        customerEmail: "ayesha@gearup.test",
        gearTitle: "Kookaburra Kahuna Cricket Bat",
        quantity: "2",
        totalAmount: "2000.00",
        startDate: "2026-07-15",
        endDate: "2026-07-17",
        status: RentalStatus.PLACED,
    },
] as const;

async function main() {
    console.log("Resetting seedable tables...");
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.rentalOrder.deleteMany();
    await prisma.gear.deleteMany();
    await prisma.category.deleteMany();

    const password = await bcrypt.hash("Password123!", 12);

    console.log(`Upserting ${seedUsers.length} users...`);
    const createdUsers = await Promise.all(
        seedUsers.map((user) =>
            prisma.user.upsert({
                where: { email: user.email },
                update: {
                    name: user.name,
                    role: user.role,
                    status: UserStatus.ACTIVE,
                    phone: user.phone,
                    address: user.address,
                },
                create: {
                    ...user,
                    status: UserStatus.ACTIVE,
                    password,
                },
            }),
        ),
    );

    console.log(`Creating ${seedCategories.length} sports and gym categories...`);
    const createdCategories = await Promise.all(
        seedCategories.map((category) => prisma.category.create({ data: category })),
    );

    const userByEmail = new Map(createdUsers.map((user) => [user.email, user]));
    const categoryByName = new Map(createdCategories.map((category) => [category.name, category]));

    console.log(`Creating ${seedGearItems.length} sports and gym gear items...`);
    const createdGear = await Promise.all(
        seedGearItems.map((gear) => {
            const provider = userByEmail.get(gear.providerEmail);
            const category = categoryByName.get(gear.categoryName);

            if (!provider || !category) {
                throw new Error(`Missing provider or category for ${gear.title}`);
            }

            return prisma.gear.create({
                data: {
                    providerId: provider.id,
                    categoryId: category.id,
                    title: gear.title,
                    description: gear.description,
                    brand: gear.brand,
                    pricePerDay: gear.pricePerDay,
                    stock: gear.stock,
                    specifications: gear.specifications,
                    availability: gear.availability,
                    image: gear.image,
                },
            });
        }),
    );

    const gearByTitle = new Map(createdGear.map((gear) => [gear.title, gear]));

    console.log(`Creating ${seedRentals.length} sample rental orders...`);
    for (const rental of seedRentals) {
        const customer = userByEmail.get(rental.customerEmail);
        const gear = gearByTitle.get(rental.gearTitle);

        if (!customer || !gear) {
            throw new Error(`Missing customer or gear for rental: ${rental.gearTitle}`);
        }

        const createdRental = await prisma.rentalOrder.create({
            data: {
                customerId: customer.id,
                gearId: gear.id,
                quantity: rental.quantity,
                totalAmount: rental.totalAmount,
                startDate: new Date(`${rental.startDate}T00:00:00.000Z`),
                endDate: new Date(`${rental.endDate}T23:59:59.000Z`),
                status: rental.status,
            },
        });

        if ("payment" in rental && rental.payment) {
            await prisma.payment.create({
                data: {
                    orderId: createdRental.id,
                    amount: rental.payment.amount,
                    transactionId: rental.payment.transactionId,
                    status: rental.payment.status,
                    paidAt: rental.payment.paidAt ? new Date(rental.payment.paidAt) : null,
                },
            });
        }

        if ("review" in rental && rental.review) {
            await prisma.review.create({
                data: {
                    customerId: customer.id,
                    gearId: gear.id,
                    rentalOrderId: createdRental.id,
                    rating: rental.review.rating,
                    comment: rental.review.comment,
                },
            });
        }
    }

    console.log("Seed complete.");
    console.table({
        users: seedUsers.length,
        categories: seedCategories.length,
        gear: seedGearItems.length,
        rentals: seedRentals.length,
    });
    console.log("Default password for seeded users: Password123!");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
