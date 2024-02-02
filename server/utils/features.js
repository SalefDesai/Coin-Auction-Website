import jwt from "jsonwebtoken";

export const sendCookie = (id, res, message, statusCode = 200, user) => {
  try {
    const token = jwt.sign({ _id: id }, process.env.JWT_SECRET,{expiresIn:'1d'});

    // console.log("generated Token : ", token);
    const jsonObj = {
      success: true,
      message,
    };

    if (user) {
        jsonObj.user = user;
    }

    // console.log("user in setcookie", user);

    res.cookie("Coin_Auction_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        // Add other attributes if needed
      })

    res
      .status(statusCode)
      .json(jsonObj);
  } catch (error) {
    console.error("Error setting cookie:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const logout = (req, res) => {

    try {
        return res.status(200).cookie("Coin_Auction_token","",{
            maxAge : new Date(new Date())
        }).json({
            success : true,
            message : "logout out"
        })
    } catch (error) {
        console.log("error : ", error);
    }
}