import { Admin } from "../models/admin.model.js";
import { getSuperAdminCredentials } from "./superAdminHelper.js";

export const seedAdmin = async () => {
  try {
    // 1. Synchronize Super Admin from existing ADMIN_EMAIL / ADMIN_USERNAME and ADMIN_PASSWORD
    const { email: superAdminEmail, password: superAdminPassword, name: superAdminName } = getSuperAdminCredentials();

    let superAdmin = await Admin.findOne({
      $or: [
        { role: 'SuperAdmin' },
        { email: superAdminEmail }
      ]
    });

    if (!superAdmin) {
      await Admin.create({
        name: superAdminName,
        email: superAdminEmail,
        password: superAdminPassword,
        role: "SuperAdmin",
      });
      console.log(`[AUTH] Super Admin initialized from ADMIN_EMAIL credentials: ${superAdminEmail}`);
    } else {
      let isUpdated = false;
      if (superAdmin.role !== "SuperAdmin") {
        superAdmin.role = "SuperAdmin";
        isUpdated = true;
      }
      if (superAdmin.email !== superAdminEmail) {
        superAdmin.email = superAdminEmail;
        isUpdated = true;
      }
      // Only initialize password if the super admin has no password set
      if (!superAdmin.password) {
        superAdmin.password = superAdminPassword;
        isUpdated = true;
      }
      if (isUpdated) {
        await superAdmin.save();
        console.log(`[AUTH] Super Admin credentials synchronized with ADMIN_PASSWORD in .env: ${superAdminEmail}`);
      }
    }
  } catch (error) {
    console.error("Error seeding or synchronizing admin:", error);
  }
};
