const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const COUNTRIES = [
  {
    name: "United States",
    iso2: "US",
    iso3: "USA",
    phone_code: "+1",
    currency: "USD",
    capital: "Washington, D.C.",
    region: "Americas",
    subregion: "Northern America",
  },
];

const LOCATION_FIXTURES = {
  Indonesia: {
    "DKI Jakarta": {
      type: "province",
      iso2: "JK",
      timezone: "Asia/Jakarta",
      cities: [
        { name: "Jakarta Selatan", latitude: -6.2615, longitude: 106.8106 },
        { name: "Jakarta Pusat", latitude: -6.1865, longitude: 106.8341 },
        { name: "Jakarta Barat", latitude: -6.1674, longitude: 106.7637 },
        { name: "Jakarta Timur", latitude: -6.225, longitude: 106.9004 },
        { name: "Jakarta Utara", latitude: -6.1389, longitude: 106.8636 },
      ],
    },
    "Jawa Barat": {
      type: "province",
      iso2: "JB",
      timezone: "Asia/Jakarta",
      cities: [
        { name: "Bandung", latitude: -6.9175, longitude: 107.6191 },
        { name: "Bekasi", latitude: -6.2383, longitude: 106.9756 },
        { name: "Bogor", latitude: -6.595, longitude: 106.8166 },
        { name: "Depok", latitude: -6.4025, longitude: 106.7942 },
        { name: "Cimahi", latitude: -6.8722, longitude: 107.5425 },
        { name: "Cirebon", latitude: -6.732, longitude: 108.5523 },
      ],
    },
    "Jawa Tengah": {
      type: "province",
      iso2: "JT",
      timezone: "Asia/Jakarta",
      cities: [
        { name: "Semarang", latitude: -6.9667, longitude: 110.4167 },
        { name: "Surakarta", latitude: -7.5755, longitude: 110.8243 },
        { name: "Magelang", latitude: -7.4797, longitude: 110.2177 },
        { name: "Tegal", latitude: -6.8797, longitude: 109.1256 },
        { name: "Purwokerto", latitude: -7.4242, longitude: 109.2396 },
      ],
    },
    "Jawa Timur": {
      type: "province",
      iso2: "JI",
      timezone: "Asia/Jakarta",
      cities: [
        { name: "Surabaya", latitude: -7.2575, longitude: 112.7521 },
        { name: "Malang", latitude: -7.9797, longitude: 112.6304 },
        { name: "Mojokerto", latitude: -7.4722, longitude: 112.4336 },
        { name: "Sidoarjo", latitude: -7.4478, longitude: 112.7183 },
        { name: "Pasuruan", latitude: -7.6451, longitude: 112.9075 },
        { name: "Banyuwangi", latitude: -8.2191, longitude: 114.3691 },
      ],
    },
    "Bali": {
      type: "province",
      iso2: "BA",
      timezone: "Asia/Makassar",
      cities: [
        { name: "Denpasar", latitude: -8.6705, longitude: 115.2126 },
        { name: "Ubud", latitude: -8.5069, longitude: 115.2625 },
      ],
    },
    "Kalimantan Timur": {
      type: "province",
      iso2: "KI",
      timezone: "Asia/Makassar",
      cities: [
        { name: "Balikpapan", latitude: -1.2379, longitude: 116.8529 },
        { name: "Samarinda", latitude: -0.5022, longitude: 117.1537 },
        { name: "Bontang", latitude: 0.1333, longitude: 117.5 },
      ],
    },
    "Riau": {
      type: "province",
      iso2: "RI",
      timezone: "Asia/Jakarta",
      cities: [
        { name: "Pekanbaru", latitude: 0.5333, longitude: 101.45 },
        { name: "Dumai", latitude: 1.6664, longitude: 101.4478 },
      ],
    },
    "Sulawesi Selatan": {
      type: "province",
      iso2: "SN",
      timezone: "Asia/Makassar",
      cities: [
        { name: "Makassar", latitude: -5.1477, longitude: 119.4327 },
        { name: "Gowa", latitude: -5.3166, longitude: 119.742 },
        { name: "Bone", latitude: -4.5554, longitude: 120.3259 },
      ],
    },
    "Sumatera Utara": {
      type: "province",
      iso2: "SU",
      timezone: "Asia/Jakarta",
      cities: [
        { name: "Medan", latitude: 3.5952, longitude: 98.6722 },
        { name: "Binjai", latitude: 3.6001, longitude: 98.4854 },
        { name: "Pematangsiantar", latitude: 2.9595, longitude: 99.0687 },
      ],
    },
    "Papua": {
      type: "province",
      iso2: "PA",
      timezone: "Asia/Jayapura",
      cities: [
        { name: "Jayapura", latitude: -2.5337, longitude: 140.7181 },
        { name: "Sorong", latitude: -0.8762, longitude: 131.2558 },
      ],
    },
  },
  "United Kingdom": {
    England: {
      type: "country",
      iso2: "ENG",
      timezone: "Europe/London",
      cities: [
        { name: "London", latitude: 51.5072, longitude: -0.1276 },
        { name: "Manchester", latitude: 53.4808, longitude: -2.2426 },
        { name: "Birmingham", latitude: 52.4862, longitude: -1.8904 },
        { name: "Leeds", latitude: 53.8008, longitude: -1.5491 },
        { name: "Sheffield", latitude: 53.3811, longitude: -1.4701 },
      ],
    },
    Scotland: {
      type: "country",
      iso2: "SCT",
      timezone: "Europe/London",
      cities: [
        { name: "Edinburgh", latitude: 55.9533, longitude: -3.1883 },
        { name: "Glasgow", latitude: 55.8642, longitude: -4.2518 },
      ],
    },
    Wales: {
      type: "country",
      iso2: "WLS",
      timezone: "Europe/London",
      cities: [{ name: "Cardiff", latitude: 51.4816, longitude: -3.1791 }],
    },
  },
  Malaysia: {
    Selangor: {
      type: "state",
      iso2: "SGR",
      timezone: "Asia/Kuala_Lumpur",
      cities: [
        { name: "Shah Alam", latitude: 3.0738, longitude: 101.5183 },
        { name: "Petaling Jaya", latitude: 3.1073, longitude: 101.6067 },
        { name: "Klang", latitude: 3.0438, longitude: 101.4458 },
        { name: "Ampang", latitude: 3.15, longitude: 101.75 },
      ],
    },
    "Kuala Lumpur": {
      type: "territory",
      iso2: "KUL",
      timezone: "Asia/Kuala_Lumpur",
      cities: [
        { name: "Kuala Lumpur City", latitude: 3.139, longitude: 101.6869 },
        { name: "Bukit Bintang", latitude: 3.1466, longitude: 101.7109 },
      ],
    },
    Johor: {
      type: "state",
      iso2: "JHR",
      timezone: "Asia/Kuala_Lumpur",
      cities: [{ name: "Johor Bahru", latitude: 1.4927, longitude: 103.7414 }],
    },
    Penang: {
      type: "state",
      iso2: "PNG",
      timezone: "Asia/Kuala_Lumpur",
      cities: [{ name: "George Town", latitude: 5.4141, longitude: 100.3288 }],
    },
    Sabah: {
      type: "state",
      iso2: "SBH",
      timezone: "Asia/Kuala_Lumpur",
      cities: [{ name: "Kota Kinabalu", latitude: 5.9804, longitude: 116.0735 }],
    },
  },
  "Saudi Arabia": {
    "Makkah Region": {
      type: "region",
      iso2: "02",
      timezone: "Asia/Riyadh",
      cities: [
        { name: "Jeddah", latitude: 21.4858, longitude: 39.1925 },
        { name: "Mecca", latitude: 21.3891, longitude: 39.8579 },
        { name: "Taif", latitude: 21.2703, longitude: 40.4158 },
      ],
    },
    "Riyadh Region": {
      type: "region",
      iso2: "01",
      timezone: "Asia/Riyadh",
      cities: [
        { name: "Riyadh", latitude: 24.7136, longitude: 46.6753 },
        { name: "Al Kharj", latitude: 24.1536, longitude: 47.3122 },
      ],
    },
    "Madinah Region": {
      type: "region",
      iso2: "03",
      timezone: "Asia/Riyadh",
      cities: [
        { name: "Medina", latitude: 24.5247, longitude: 39.5692 },
        { name: "Yanbu", latitude: 24.0895, longitude: 38.0618 },
      ],
    },
    "Eastern Province": {
      type: "region",
      iso2: "04",
      timezone: "Asia/Riyadh",
      cities: [{ name: "Dammam", latitude: 26.4207, longitude: 50.0888 }],
    },
  },
  Egypt: {
    "Cairo Governorate": {
      type: "governorate",
      iso2: "C",
      timezone: "Africa/Cairo",
      cities: [
        { name: "Cairo", latitude: 30.0444, longitude: 31.2357 },
        { name: "Heliopolis", latitude: 30.1094, longitude: 31.3439 },
      ],
    },
    "Alexandria": {
      type: "governorate",
      iso2: "ALX",
      timezone: "Africa/Cairo",
      cities: [
        { name: "Alexandria", latitude: 31.2001, longitude: 29.9187 },
        { name: "Sidi Gaber", latitude: 31.2186, longitude: 29.942 },
      ],
    },
    "Giza": {
      type: "governorate",
      iso2: "GZ",
      timezone: "Africa/Cairo",
      cities: [{ name: "Giza", latitude: 30.0131, longitude: 31.2089 }],
    },
  },
  Pakistan: {
    "Punjab": {
      type: "province",
      iso2: "PB",
      timezone: "Asia/Karachi",
      cities: [
        { name: "Lahore", latitude: 31.5204, longitude: 74.3587 },
        { name: "Faisalabad", latitude: 31.4504, longitude: 73.135 },
        { name: "Rawalpindi", latitude: 33.5651, longitude: 73.0169 },
        { name: "Multan", latitude: 30.1575, longitude: 71.5249 },
      ],
    },
    "Sindh": {
      type: "province",
      iso2: "SD",
      timezone: "Asia/Karachi",
      cities: [
        { name: "Karachi", latitude: 24.8607, longitude: 67.0011 },
        { name: "Hyderabad", latitude: 25.396, longitude: 68.3578 },
      ],
    },
    "Khyber Pakhtunkhwa": {
      type: "province",
      iso2: "KP",
      timezone: "Asia/Karachi",
      cities: [{ name: "Peshawar", latitude: 34.0151, longitude: 71.5249 }],
    },
  },
  Bangladesh: {
    "Dhaka Division": {
      type: "division",
      iso2: "C",
      timezone: "Asia/Dhaka",
      cities: [
        { name: "Dhaka", latitude: 23.8103, longitude: 90.4125 },
        { name: "Narayanganj", latitude: 23.6238, longitude: 90.5 },
        { name: "Gazipur", latitude: 23.9999, longitude: 90.4203 },
      ],
    },
    "Chittagong Division": {
      type: "division",
      iso2: "B",
      timezone: "Asia/Dhaka",
      cities: [
        { name: "Chittagong", latitude: 22.3569, longitude: 91.7832 },
        { name: "Cox's Bazar", latitude: 21.4272, longitude: 92.0058 },
      ],
    },
  },
  Turkey: {
    "Istanbul": {
      type: "province",
      iso2: "34",
      timezone: "Europe/Istanbul",
      cities: [
        { name: "Istanbul", latitude: 41.0082, longitude: 28.9784 },
        { name: "Kadıköy", latitude: 40.9917, longitude: 29.0277 },
        { name: "Beşiktaş", latitude: 41.0422, longitude: 29.0083 },
      ],
    },
    "Ankara": {
      type: "province",
      iso2: "06",
      timezone: "Europe/Istanbul",
      cities: [
        { name: "Ankara", latitude: 39.9334, longitude: 32.8597 },
        { name: "Çankaya", latitude: 39.9179, longitude: 32.8628 },
      ],
    },
    "Izmir": {
      type: "province",
      iso2: "35",
      timezone: "Europe/Istanbul",
      cities: [{ name: "Izmir", latitude: 38.4237, longitude: 27.1428 }],
    },
  },
  "United Arab Emirates": {
    "Abu Dhabi": {
      type: "emirate",
      iso2: "AZ",
      timezone: "Asia/Dubai",
      cities: [
        { name: "Abu Dhabi", latitude: 24.4539, longitude: 54.3773 },
        { name: "Al Ain", latitude: 24.2075, longitude: 55.7447 },
      ],
    },
    "Dubai": {
      type: "emirate",
      iso2: "DU",
      timezone: "Asia/Dubai",
      cities: [{ name: "Dubai", latitude: 25.2048, longitude: 55.2708 }],
    },
    "Sharjah": {
      type: "emirate",
      iso2: "SH",
      timezone: "Asia/Dubai",
      cities: [{ name: "Sharjah", latitude: 25.3463, longitude: 55.4209 }],
    },
  },
  Qatar: {
    "Doha Municipality": {
      type: "municipality",
      iso2: "DA",
      timezone: "Asia/Qatar",
      cities: [{ name: "Doha", latitude: 25.2854, longitude: 51.531 }],
    },
    "Al Rayyan": {
      type: "municipality",
      iso2: "RA",
      timezone: "Asia/Qatar",
      cities: [{ name: "Al Rayyan", latitude: 25.2919, longitude: 51.4244 }],
    },
  },
  "United States": {
    "Alaska": {
      type: "state",
      iso2: "AK",
      timezone: "America/Anchorage",
      cities: [
        { name: "Anchorage", latitude: 61.2181, longitude: -149.9003 },
        { name: "Fairbanks", latitude: 64.8378, longitude: -147.7164 },
      ],
    },
    "Arizona": {
      type: "state",
      iso2: "AZ",
      timezone: "America/Phoenix",
      cities: [
        { name: "Phoenix", latitude: 33.4484, longitude: -112.074 },
        { name: "Tucson", latitude: 32.2226, longitude: -110.9747 },
      ],
    },
    "California": {
      type: "state",
      iso2: "CA",
      timezone: "America/Los_Angeles",
      cities: [
        { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
        { name: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
      ],
    },
    "Colorado": {
      type: "state",
      iso2: "CO",
      timezone: "America/Denver",
      cities: [
        { name: "Denver", latitude: 39.7392, longitude: -104.9903 },
        { name: "Colorado Springs", latitude: 38.8339, longitude: -104.8214 },
      ],
    },
    "Hawaii": {
      type: "state",
      iso2: "HI",
      timezone: "America/Honolulu",
      cities: [
        { name: "Honolulu", latitude: 21.3069, longitude: -157.8583 },
        { name: "Hilo", latitude: 19.7076, longitude: -155.0816 },
      ],
    },
    "Illinois": {
      type: "state",
      iso2: "IL",
      timezone: "America/Chicago",
      cities: [
        { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
        { name: "Springfield", latitude: 39.7817, longitude: -89.6501 },
      ],
    },
    "New York": {
      type: "state",
      iso2: "NY",
      timezone: "America/New_York",
      cities: [
        { name: "New York City", latitude: 40.7128, longitude: -74.006 },
        { name: "Buffalo", latitude: 42.8864, longitude: -78.8784 },
      ],
    },
  },
};

async function loadTable(table) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    throw new Error(`Failed to load ${table}: ${error.message}`);
  }
  return data;
}

async function insertRow(table, payload) {
  const { data, error } = await supabase.from(table).insert([payload]).select().single();
  if (error) {
    throw new Error(`Failed to insert into ${table}: ${error.message}`);
  }
  return data;
}

async function updateRow(table, id, payload) {
  const { error } = await supabase.from(table).update(payload).eq("id", id);
  if (error) {
    throw new Error(`Failed to update ${table}#${id}: ${error.message}`);
  }
}

async function ensureCountry(payload, countries) {
  const existing = countries.find((country) => country.name === payload.name);
  if (existing) {
    return existing;
  }

  const inserted = await insertRow("countries", payload);
  countries.push(inserted);
  console.log(`Inserted country: ${payload.name}`);
  return inserted;
}

async function ensureState(country, stateName, stateConfig, states) {
  const existing = states.find(
    (state) => state.country_id === country.id && state.name === stateName,
  );

  if (existing) {
    return existing;
  }

  const inserted = await insertRow("states", {
    country_id: country.id,
    name: stateName,
    iso2: stateConfig.iso2,
    type: stateConfig.type,
  });
  states.push(inserted);
  console.log(`Inserted state: ${country.name} / ${stateName}`);
  return inserted;
}

async function ensureCity(country, state, cityConfig, timezone, cities) {
  const existing = cities.find(
    (city) => city.state_id === state.id && city.name === cityConfig.name,
  );

  const payload = {
    country_id: country.id,
    state_id: state.id,
    name: cityConfig.name,
    latitude: cityConfig.latitude,
    longitude: cityConfig.longitude,
    timezone,
  };

  if (!existing) {
    const inserted = await insertRow("cities", payload);
    cities.push(inserted);
    console.log(`Inserted city: ${country.name} / ${state.name} / ${cityConfig.name}`);
    return;
  }

  const needsUpdate =
    existing.country_id !== payload.country_id ||
    existing.timezone !== payload.timezone ||
    Number(existing.latitude) !== Number(payload.latitude) ||
    Number(existing.longitude) !== Number(payload.longitude);

  if (!needsUpdate) {
    return;
  }

  await updateRow("cities", existing.id, payload);
  Object.assign(existing, payload);
  console.log(`Updated city: ${country.name} / ${state.name} / ${cityConfig.name}`);
}

async function run() {
  const countries = await loadTable("countries");
  const states = await loadTable("states");
  const cities = await loadTable("cities");

  for (const countryPayload of COUNTRIES) {
    await ensureCountry(countryPayload, countries);
  }

  for (const [countryName, statesMap] of Object.entries(LOCATION_FIXTURES)) {
    const country = countries.find((item) => item.name === countryName);
    if (!country) {
      throw new Error(`Country not found after ensure step: ${countryName}`);
    }

    for (const [stateName, stateConfig] of Object.entries(statesMap)) {
      const state = await ensureState(country, stateName, stateConfig, states);

      for (const cityConfig of stateConfig.cities) {
        await ensureCity(country, state, cityConfig, stateConfig.timezone, cities);
      }
    }
  }

  console.log("Location timezone seeding completed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
