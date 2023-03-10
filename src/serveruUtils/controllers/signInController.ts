import { NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

import { NextRequest } from "../../../types";
import userCollection from "../collection/userCollection";
import client from "../databaseClient/client";
import signInValidation from "../validations/signInValidation";

const signInController = async (req: NextRequest, res: NextApiResponse) => {
  // Environment Variables
  const saltRound: number = +process.env.SALT!;
  const jwtSecret = process.env.JWT_SECRET_KEY!;

  // Check The Request Method
  if (req.method === "POST") {
    // Database Connection
    try {
      await client.connect();
    } catch (err) {
      // Closing Connection With Database
      await client.close();
      return res
        .status(500)
        .send({ message: "اتصال با دیتابیس با خطا مواجه شد!" });
    }
    // Validating Request Body
    const success = signInValidation.safeParse(req.body)?.success;

    if (!success) {
      // Closing Connection With Database
      await client.close();
      return res
        .status(400)
        .send({ message: "لطفا فیلدها را به درستی پر کنید!" });
    }

    // Search For User In Database
    const findUser = await userCollection
      .find({ email: req.body.email })
      .toArray();

    if (findUser.length !== 0) {
      // Closing Connection With Database
      await client.close();
      return res
        .status(404)
        .send({ message: "این ایمیل قبلا استفاده شده است!" });
    }

    // Hashing Password
    const hashPassword = await bcrypt.hash(req.body.password, saltRound);

    // Creating User In Database In case There Is No Similar User
    await userCollection.insertOne({
      email: req.body.email,
      password: hashPassword,
      contacts: [],
    });

    // Creating JsonWebToken
    const token = sign(JSON.stringify({ email: req.body.email }), jwtSecret);

    // Closing Connection With Database
    await client.close();

    // Sending Response
    res.setHeader("x-authentication-token", token);
    return res.send({ message: "ثبت نام با موفقیت انجام شد." });
  }
};

export default signInController;
