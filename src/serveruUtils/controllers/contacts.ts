import { NextApiResponse } from "next";
import { CustomNextRequest } from "../../../types";
import userCollection from "../collection/userCollection";
import client from "../databaseClient/client";
import verifyToken from "../middleware/verifyToken";

const contacts = async (req: CustomNextRequest, res: NextApiResponse) => {
  // Database Connection
  try {
    await client.connect();
  } catch (err) {
    return res
      .status(500)
      .send({ message: "اتصال با دیتابیس با خطا مواجه شد!" });
  }

  // Getting Queries From URL
  const search = req.query.search || "false";
  const page = req.query.page;

  // Validate Request JsonWebToken
  const verifiedUser = verifyToken(req);

  if (!verifiedUser || !verifiedUser.email) {
    await client.close();
    return res.status(500).send({ message: "شما به این صفحه درسترسی ندارید!" });
  }

  const userEmail = verifiedUser.email;

  // Find User In Database
  const user = await userCollection.findOne({ email: userEmail });
  if (!user) {
    await client.close();
    return res.status(404).send({ message: "کاربر مورد نظر یافت نشد!" });
  }

  // Closing Database Connection
  await client.close();

  // Check If There Is Page Query In URL Or Not
  if (page === "0" || !page || isNaN(+page)) {
    // If There Isn't page Query Then Return All Data
    if (search !== "true") {
      return res.status(200).send({ contacts: user.contacts });
    } else {
      // If There Is Search Query Equal To True Then Just Return Data For Search
      return res.status(200).send({
        contacts: user.contacts.map((contact) => ({
          _id: contact._id,
          fullname: contact.fullname,
        })),
      });
    }
  } else {
    // If There Is Page Query Then Do The Procces For Pagination
    const numberOfItemInEveryPage = 12;
    const amountOfPages = Math.ceil(
      user.contacts.length / numberOfItemInEveryPage
    );

    const paginatedContacts = user.contacts.slice(
      (+page - 1) * numberOfItemInEveryPage,
      numberOfItemInEveryPage * +page
    );

    // Sending Paginated Data As Response
    return res
      .status(200)
      .send({ contacts: paginatedContacts, pagesNumber: amountOfPages });
  }
};

export default contacts;
