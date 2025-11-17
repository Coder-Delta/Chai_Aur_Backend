import{asyncHandler} from "../utils/asyncHandler.js"

const registerUser = asyncHandler(async (req, res) => {//4 parameter err, req, res, next
    res.status(200).json({
        message: "Ok"
    })
})

export {registerUser}//import me me iss name se hi import kar sakta hu