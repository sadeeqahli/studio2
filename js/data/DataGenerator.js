import { faker } from '@faker-js/faker';

export class DataGenerator {
  constructor() {
    faker.seed(42); // For consistent data
  }

  generatePitches() {
    const amenities = ['Parking', 'Lighting', 'Seating', 'Changing Rooms', 'Shower', 'Snack Bar', 'WiFi', 'Security'];
    const locations = ['Victoria Island', 'Lekki', 'Ikeja', 'Surulere', 'Mainland', 'Ikoyi', 'Yaba', 'Gbagada'];
    
    return Array.from({ length: 24 }, (_, i) => ({
      id: `pitch-${i + 1}`,
      name: `${faker.company.name()} Football Arena`,
      location: faker.helpers.arrayElement(locations) + ', Lagos',
      sport: 'Football',
      pitchSize: faker.helpers.arrayElement(['5-a-side', '7-a-side', '11-a-side']),
      rating: parseFloat((faker.number.float({ min: 3.5, max: 5.0 })).toFixed(1)),
      price: faker.number.int({ min: 5000, max: 25000 }),
      image: `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x200/22c55e/ffffff?text=Pitch+${i + 1}`,
      amenities: faker.helpers.arrayElements(amenities, { min: 3, max: 6 }),
      description: faker.lorem.paragraph(),
      capacity: faker.number.int({ min: 10, max: 22 }),
      surface: faker.helpers.arrayElement(['Grass', 'Artificial Turf', 'Hybrid'])
    }));
  }

  generateProducts() {
    const categories = ['Boots', 'Jerseys', 'Balls', 'Accessories'];
    const brands = ['Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance'];
    
    return Array.from({ length: 32 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `${faker.helpers.arrayElement(brands)} ${faker.commerce.productName()}`,
      category: faker.helpers.arrayElement(categories),
      price: faker.number.int({ min: 2500, max: 45000 }),
      image: `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x300/3b82f6/ffffff?text=Product+${i + 1}`,
      description: faker.commerce.productDescription(),
      stock: faker.number.int({ min: 0, max: 50 }),
      rating: parseFloat((faker.number.float({ min: 3.0, max: 5.0 })).toFixed(1)),
      reviews: faker.number.int({ min: 5, max: 150 })
    }));
  }
  
  generatePlayerListings() {
    const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Any'];
    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: `player-${i + 1}`,
      name: faker.person.fullName(),
      avatar: faker.person.firstName().charAt(0) + faker.person.lastName().charAt(0),
      preferredPosition: faker.helpers.arrayElement(positions),
      skillLevel: faker.helpers.arrayElement(skillLevels),
      location: faker.location.city() + ', Lagos',
      availability: `Weekends, ${faker.helpers.arrayElement(['Mornings', 'Afternoons', 'Evenings'])}`,
      lookingFor: `Looking for a competitive ${faker.helpers.arrayElement(['5-a-side', '7-a-side'])} team.`
    }));
  }

  generateAnalyticsData() {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        revenue: faker.number.int({ min: 50000, max: 200000 }),
        bookings: faker.number.int({ min: 10, max: 45 })
      };
    });

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: faker.number.int({ min: 800000, max: 2000000 })
      };
    });

    const timeSlots = ['9:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];
    const popularHours = timeSlots.map(time => ({
      time,
      bookings: faker.number.int({ min: 5, max: 35 })
    }));

    return {
      totalBookings: faker.number.int({ min: 800, max: 1500 }),
      totalRevenue: faker.number.int({ min: 8000000, max: 15000000 }),
      averageBookingValue: faker.number.int({ min: 8000, max: 18000 }),
      occupancyRate: parseFloat((faker.number.float({ min: 65, max: 85 })).toFixed(1)),
      weeklyRevenue: last7Days,
      monthlyRevenue: last6Months,
      popularHours,
      pitchPerformance: this.generatePitches().slice(0, 10).map(pitch => ({
        name: pitch.name,
        revenue: faker.number.int({ min: 100000, max: 500000 }),
        bookings: faker.number.int({ min: 20, max: 80 })
      }))
    };
  }

  generateTimeSlots() {
    return [
      '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ];
  }

  generateNext14Days() {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        number: date.getDate(),
        full: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    
    return days;
  }
}
