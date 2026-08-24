"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = void 0;
const User_1 = require("../models/User");
const Property_1 = require("../models/Property");
const seedInitialData = async () => {
    try {
        const userCount = await User_1.User.countDocuments();
        let agentId;
        if (userCount === 0) {
            console.log('[Seeder]: Populating initial demo users...');
            const admin = await User_1.User.create({
                name: 'Platform Administrator',
                email: 'admin@estateintel.com',
                password: 'Password123!',
                role: 'ADMIN',
                phone: '+91 9876543210',
                isVerified: true,
            });
            const agent = await User_1.User.create({
                name: 'Rajesh Sharma',
                email: 'agent@estateintel.com',
                password: 'Password123!',
                role: 'AGENT',
                phone: '+91 9876543211',
                agencyName: 'Apex Realty Solutions',
                isVerified: true,
            });
            await User_1.User.create({
                name: 'Priya Sundaram',
                email: 'buyer@estateintel.com',
                password: 'Password123!',
                role: 'BUYER',
                phone: '+91 9876543212',
            });
            agentId = agent._id;
            console.log('[Seeder]: Demo users created successfully.');
            console.log('   -> Admin: admin@estateintel.com / Password123!');
            console.log('   -> Agent: agent@estateintel.com / Password123!');
            console.log('   -> Buyer: buyer@estateintel.com / Password123!');
        }
        else {
            const existingAgent = await User_1.User.findOne({ role: 'AGENT' });
            agentId = existingAgent?._id;
        }
        const propertyCount = await Property_1.Property.countDocuments();
        if (propertyCount === 0 && agentId) {
            console.log('[Seeder]: Populating sample luxury properties...');
            const sampleProperties = [
                {
                    title: 'Luxury 3BHK Apartment in OMR Tech Corridor',
                    description: 'Spacious 3BHK apartment with premium wooden flooring, modular kitchen, smart home automation, and 24/7 security. Located in the heart of OMR IT hub near top international schools.',
                    propertyType: 'Apartment',
                    listingType: 'Sale',
                    price: 7850000, // 78.5 Lakhs
                    bedrooms: 3,
                    bathrooms: 3,
                    area: 1650,
                    floor: 8,
                    totalFloors: 14,
                    propertyAge: 2,
                    furnishedStatus: 'Fully Furnished',
                    constructionStatus: 'Ready to Move',
                    amenities: ['Gymnasium', 'Swimming Pool', 'Clubhouse', 'Power Backup', '24x7 Security', 'Covered Parking'],
                    parking: true,
                    address: 'Plot 42, Rajiv Gandhi Salai, OMR',
                    city: 'Chennai',
                    locality: 'OMR',
                    latitude: 12.9348,
                    longitude: 80.2321,
                    location: { type: 'Point', coordinates: [80.2321, 12.9348] },
                    images: [
                        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
                        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
                        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
                    ],
                    agentId,
                    verificationStatus: 'APPROVED',
                    fraudRiskScore: 12,
                    fraudReasons: ['Normal pricing distribution'],
                    views: 340,
                    favoritesCount: 28,
                    inquiriesCount: 9,
                },
                {
                    title: 'Premium 4BHK Independent Villa with Private Pool',
                    description: 'Architect-designed independent villa featuring a landscaped garden, private swimming pool, Italian marble flooring, and solar water heater.',
                    propertyType: 'Villa',
                    listingType: 'Sale',
                    price: 24500000, // 2.45 Cr
                    bedrooms: 4,
                    bathrooms: 4,
                    area: 3400,
                    floor: 1,
                    totalFloors: 2,
                    propertyAge: 1,
                    furnishedStatus: 'Semi-Furnished',
                    constructionStatus: 'Ready to Move',
                    amenities: ['Private Pool', 'Landscaped Garden', 'Solar Panels', 'CCTV Surveillance', '24x7 Security', 'Visitor Parking'],
                    parking: true,
                    address: '12 Beach Road, ECR',
                    city: 'Chennai',
                    locality: 'ECR',
                    latitude: 12.8712,
                    longitude: 80.2456,
                    location: { type: 'Point', coordinates: [80.2456, 12.8712] },
                    images: [
                        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
                    ],
                    agentId,
                    verificationStatus: 'APPROVED',
                    fraudRiskScore: 8,
                    fraudReasons: ['Verified seller credentials'],
                    views: 520,
                    favoritesCount: 45,
                    inquiriesCount: 14,
                },
                {
                    title: 'Modern 2BHK Flat near Velachery Metro Station',
                    description: 'Ideal compact 2BHK flat situated within 5 minutes walking distance from Velachery metro. Excellent rental yield and high connectivity.',
                    propertyType: 'Apartment',
                    listingType: 'Sale',
                    price: 5200000, // 52 Lakhs
                    bedrooms: 2,
                    bathrooms: 2,
                    area: 980,
                    floor: 3,
                    totalFloors: 5,
                    propertyAge: 4,
                    furnishedStatus: 'Semi-Furnished',
                    constructionStatus: 'Ready to Move',
                    amenities: ['Elevator', 'Power Backup', 'Water Purifier', 'Security Guard'],
                    parking: true,
                    address: '15 Main Road, Velachery',
                    city: 'Chennai',
                    locality: 'Velachery',
                    latitude: 12.9754,
                    longitude: 80.2206,
                    location: { type: 'Point', coordinates: [80.2206, 12.9754] },
                    images: [
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
                    ],
                    agentId,
                    verificationStatus: 'APPROVED',
                    fraudRiskScore: 15,
                    fraudReasons: ['Standard local market rates'],
                    views: 210,
                    favoritesCount: 19,
                    inquiriesCount: 6,
                },
                {
                    title: 'Prime Commercial Office Space in Indiranagar',
                    description: 'Plug-and-play modern corporate office space with 40 workstations, 2 conference rooms, cafeteria, and high-speed fiber internet.',
                    propertyType: 'Commercial Property',
                    listingType: 'Rent',
                    price: 180000, // 1.8L / month
                    bedrooms: 0,
                    bathrooms: 2,
                    area: 2200,
                    floor: 4,
                    totalFloors: 6,
                    propertyAge: 3,
                    furnishedStatus: 'Fully Furnished',
                    constructionStatus: 'Ready to Move',
                    amenities: ['Conference Rooms', 'High-Speed Fiber', '24/7 Access', 'Air Conditioning', 'Basement Parking'],
                    parking: true,
                    address: '100 Feet Road, Indiranagar',
                    city: 'Bangalore',
                    locality: 'Indiranagar',
                    latitude: 12.9784,
                    longitude: 77.6408,
                    location: { type: 'Point', coordinates: [77.6408, 12.9784] },
                    images: [
                        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
                    ],
                    agentId,
                    verificationStatus: 'APPROVED',
                    fraudRiskScore: 10,
                    fraudReasons: [],
                    views: 410,
                    favoritesCount: 31,
                    inquiriesCount: 11,
                },
            ];
            await Property_1.Property.insertMany(sampleProperties);
            console.log('[Seeder]: Sample real estate properties created successfully.');
        }
    }
    catch (err) {
        console.error('[Seeder Error]:', err);
    }
};
exports.seedInitialData = seedInitialData;
