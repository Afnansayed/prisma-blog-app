import { prisma } from "../lib/prisma";
import { UserRole } from "../modules/posts/posts.router";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin Saheb",
      email: "admin@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };

    console.log("***** The user is already exist or not !");
    const existAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    // console.log(existAdmin);

    if (existAdmin) {
      throw new Error("This user already exists.");
    }

    console.log("**** start  creating a admin.");
    const signupAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signupAdmin.ok) {
      console.log("Amdimn create succfully");

      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("******** update user emailVerified status");
    }
    console.log("***** success ******");
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
