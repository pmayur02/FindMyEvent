const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db } = require("../Connection/dbConnection");
const queries = require("../Connection/dbQueries/dbQueries.json")
const { generateToken } = require("../Utilities/utils")


module.exports.register = async (payload) => {
    try {
        const { name, email, password } = payload;
        if (!name || !email || !password) {
            return {
                status: 400,
                message: "Missing Field(s)"
            }
        }

        const isExist = await db.query(queries.isExist, [email]);
        if (isExist[0].length !== 0) {
            return {
                status: 400,
                message: "User Already Exists"
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const registerUser = await db.query(queries.registerUser, [name, email, hashPassword]);
        if (!registerUser[0].insertId) {
            return {
                status: 500,
                message: "Failed to Register User"
            }
        }

        const currentUser = await db.query(queries.fetchUserByEmailId, [email]);
        if (!currentUser[0].length === 0) {
            return {
                status: 404,
                message: "User Not Found"
            }
        }
        const tokenData = { id: currentUser[0][0].id, name: currentUser[0][0].name }
        const token = generateToken(tokenData);

        return {
            status: 201,
            message: "User registered Successfully!",
            data: token
        }


    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

module.exports.login = async (payload) => {
    try {
        const { email, password } = payload;

        if (!email || !password) {
            return {
                status: 400,
                message: "Missing Field(s)"
            }
        }

        const isExist = await db.query(queries.fetchUserByEmailId, [email]);
        if (!isExist || isExist[0].length == 0) {
            return {
                status: 404,
                message: "No user found."
            }
        }

        const validPassword = await bcrypt.compare(password, isExist[0][0].password);
        if (!validPassword) {
            return {
                status: 400,
                message: "Invalid Credentials."
            }
        }

        const tokenData = { id: isExist[0][0].id, name: isExist[0][0].name }
        const token = generateToken(tokenData);

        return {
            status: 201,
            message: "Logged In Successfully!",
            data: token
        }



    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}


module.exports.fetchUser = async (userId) => {
    try {
        if (!userId) {
            return {
                status: 400,
                message: "Missing Field(s)"
            }
        }

        const user = await db.query(queries.fetchUserById, [userId]);
        if (user[0].length == 0) {
            return {
                status: 404,
                message: "No user found"
            }
        }

        return {
            status: 200,
            message: "user details fetched successfully!",
            data: user[0][0]
        }

    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}


module.exports.fetchUsers = async (_) => {
    try {
        const allUsers = await db.query(queries.fetchAllUsers);
        if (allUsers[0].length === 0) {
            return {
                status: 404,
                message: "No Users Found",
            }
        }

        return {
            status: 200,
            message: "user details fetched successfully!",
            data: allUsers[0]
        }

    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

module.exports.updateUser = async (userId, payload) => {
    try {
        if (!userId || !payload || Object.keys(payload).length == 0) {
            return {
                status: 400,
                message: "missing payload",
            }
        }

        const isExist = await db.query(queries.fetchUserById, [userId]);
        if (isExist[0]?.length === 0) {
            return {
                status: 404,
                message: "No Users Found",
            }
        }

        let updatePayloadFields = [];
        for (let [key, val] of Object.entries(payload)) {
            let string = `${key}='${val}' `
            updatePayloadFields.push(string);
        }

        let payloadString = updatePayloadFields.join(",")
        const newQuery = queries.updateUsersData.replace("{expr}", payloadString);

        const updatedStatus = await db.query(newQuery);
        if(!updatedStatus[0].affectedRows){
                        return {
                status: 500,
                message: "Failed to Delete User"
            }
        }

        return{
            status: 200,
            message: "User Updated Successfully!",
        }
        

    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

module.exports.deleteUser = async (userId) => {
    try {
        if (!userId) {
            return {
                status: 400,
                message: "missing userId",
            }
        }

        const isExist = await db.query(queries.fetchUserById, [userId]);
        if (isExist[0]?.length === 0) {
            return {
                status: 404,
                message: "No Users Found",
            }
        }
        const deleteStatus = await db.query(queries.deleteUser, [userId]);
        if (!deleteStatus[0].affectedRows) {
            return {
                status: 500,
                message: "Failed to Delete User"
            }
        }

        return {
            status: 200,
            message: "User Deleted Successfully!",
        }




    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

