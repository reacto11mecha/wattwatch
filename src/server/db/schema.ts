import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  real,
  index,
  pgTable,
  pgTableCreator,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `pg-drizzle_${name}`);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// --- 1. ENTITAS LOKASI / GEDUNG (Tertaut ke User/UMKM) ---
export const gedung = createTable(
  "gedung",
  (d) => ({
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // Tautan ke pengelola UMKM
    nama: text("nama").notNull(), // cth: "Pabrik Roti Cabang A"
    alamat: text("alamat"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }),
  (t) => [index("gedung_user_id_idx").on(t.userId)],
);

// --- 2. ENTITAS RUANGAN ---
export const ruangan = createTable(
  "ruangan",
  (d) => ({
    id: text("id").primaryKey(),
    gedungId: text("gedung_id")
      .notNull()
      .references(() => gedung.id, { onDelete: "cascade" }),
    nama: text("nama").notNull(), // cth: "Ruang Produksi"

    // Status Terkini (Bisa di-update langsung oleh ESP32 secara real-time)
    status: text("status", { enum: ["Normal", "Warning", "Abnormal"] })
      .notNull()
      .default("Normal"),
    efisiensiScore: integer("efisiensi_score").notNull().default(100),

    // Pembacaan sensor terkini (DHT22 & PIR HC-SR501)
    suhu: real("suhu"),
    kelembapan: real("kelembapan"),
    adaOrang: boolean("ada_orang").default(false),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  }),
  (t) => [index("ruangan_gedung_id_idx").on(t.gedungId)],
);

// --- 3. TABEL RIWAYAT KONSUMSI (Untuk Grafik Recharts/Tren) ---
// Data dari PZEM-004T akan masuk ke sini secara berkala (misal: setiap 15 menit)
export const logKonsumsi = createTable(
  "log_konsumsi",
  (d) => ({
    id: text("id").primaryKey(),
    ruanganId: text("ruangan_id")
      .notNull()
      .references(() => ruangan.id, { onDelete: "cascade" }),
    konsumsiKwh: real("konsumsi_kwh").notNull(),
    estimasiBiaya: real("estimasi_biaya").notNull(), // Hasil konversi kWh ke Rupiah
    timestamp: timestamp("timestamp").notNull().defaultNow(),
  }),
  (t) => [
    index("log_ruangan_id_idx").on(t.ruanganId),
    index("log_timestamp_idx").on(t.timestamp), // Penting untuk query grafik time-series
  ],
);

// --- 4. ENTITAS PERANGKAT (Opsional, untuk UI Status) ---
export const perangkat = createTable(
  "perangkat",
  (d) => ({
    id: text("id").primaryKey(),
    ruanganId: text("ruangan_id")
      .notNull()
      .references(() => ruangan.id, { onDelete: "cascade" }),
    nama: text("nama").notNull(),
    tipe: text("tipe", {
      enum: ["AC", "Lampu", "Kulkas", "Oven", "Lainnya"],
    }).notNull(),
    isAktif: boolean("is_aktif").notNull().default(false),
  }),
  (t) => [index("perangkat_ruangan_id_idx").on(t.ruanganId)],
);

// --- 5. NOTIFIKASI & ALERT ---
export const notifikasi = createTable(
  "notifikasi",
  (d) => ({
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // Tertaut langsung ke user agar mudah difilter
    ruanganId: text("ruangan_id").references(() => ruangan.id, {
      onDelete: "set null",
    }),
    judul: text("judul").notNull(),
    deskripsi: text("deskripsi").notNull(),
    severity: text("severity", {
      enum: ["Urgent", "Warning", "Info", "Success"],
    }).notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }),
  (t) => [
    index("notif_user_id_idx").on(t.userId),
    index("notif_ruangan_id_idx").on(t.ruanganId),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
  gedung: many(gedung),
  notifikasi: many(notifikasi),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const gedungRelations = relations(gedung, ({ one, many }) => ({
  user: one(user, { fields: [gedung.userId], references: [user.id] }),
  ruangan: many(ruangan),
}));

export const ruanganRelations = relations(ruangan, ({ one, many }) => ({
  gedung: one(gedung, { fields: [ruangan.gedungId], references: [gedung.id] }),
  logKonsumsi: many(logKonsumsi),
  perangkat: many(perangkat),
  notifikasi: many(notifikasi),
}));

export const logKonsumsiRelations = relations(logKonsumsi, ({ one }) => ({
  ruangan: one(ruangan, {
    fields: [logKonsumsi.ruanganId],
    references: [ruangan.id],
  }),
}));
