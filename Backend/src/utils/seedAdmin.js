import { Admin } from "../models/admin.model.js";

export const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = process.env.ADMIN_EMAIL || "admin@codex.com";
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      await Admin.create({
        name: "Super Admin",
        email: defaultEmail,
        password: defaultPassword,
      });
      console.log(`Default admin created. Email: ${defaultEmail}`);
    } else {
      console.log("Admin already exists, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};
