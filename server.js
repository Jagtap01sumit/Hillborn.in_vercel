const express = require("express");
require("dotenv").config({ path: "./config.env" });
const connectDB = require("./config/db");
const ErrorResponse = require("./middlewares/ErrorResponse");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const Themes = require("./models/Themes");
connectDB();
const app = express();

// app.use(cors({
//     origin:"https://myknot-official.netlify.app",
//     // credentials: true
// }))

app.use(
  cors({
    origin: [
      "https://myknot-pstc.vercel.app",
      "https://myknot-intern-kuvc.vercel.app/",
      "http://localhost:3000/login",
      "http://localhost:3000",
      "http://localhost",

      "http://65.0.19.30:3000",
      "http://3.111.5.157",
    ],
    credentials: true,
  })
);
// module.exports = {
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "Cross-Origin-Opener-Policy",
//             value: "same-origin", // "same-origin-allow-popups"
//           },
//         ],
//       },
//     ];
//   },
// };

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/sendThemesData", async (req, res) => {
  try {
    const { title, description, img, price, category, siteurl, numOfReviews } =
      req.body;

    const themes = new Themes({
      title,
      description,
      img,
      price,
      category,
      siteurl,
      numOfReviews,
    });
    const r = await themes.save();
    console.log(r);
    res.json({ message: "Successfully send" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/userRoutes.js"));
app.use("/api/img", require("./routes/imageRoutes.js"));
app.use("/api/themes", require("./routes/themeRoutes.js"));
app.use("/api/cart", require("./routes/cartRoutes.js"));
app.use("/api/payement", require("./routes/payementRoutes.js"));
app.use("/api/orders", require("./routes/orderRoutes.js"));
app.use("/api/category", require("./routes/categoryRoutes.js"));

app.get("*", (req, res) => {
  let url = path.join(__dirname, "/public/", "index.html");
  res.sendFile(url);
});

app.use(ErrorResponse);

app.listen(process.env.PORT || 80, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
