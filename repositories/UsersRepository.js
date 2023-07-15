const { Users } = require("../models");
const { Op } = require("sequelize");
class UsersRepository {
    constructor() { }

    checkUserAge = async ({ user_id }) => {
        return await Users.findOne({
            attributes: ["age"],
            where: { user_id },
            raw: true,
        });
    }
    checkUserGender = async ({ user_id }) => {
        return await Users.findOne({
            attributes: ["gender"],
            where: { user_id },
            raw: true,
        });
    }
    checkUserCategory = async ({ user_id }) => {
        return await Users.findOne({
            attributes: ["category"],
            where: { user_id },
            raw: true,
        });
    }
    findAllUser = async ({ user_type, age, gender, user_id, one, two, three }) => {
        return await Users.findAll({
            where: {
                user_type,
                age,
                gender,
                user_id: {
                    [Op.ne]: user_id
                },
                category: {
                    [Op.or]: [
                        { [Op.like]: "%" + one + "%" },
                        { [Op.like]: "%" + two + "%" },
                        { [Op.like]: "%" + three + "%" }
                    ]
                }
            },
            limit: 3,
            raw: true,
        });
    }
}

module.exports = UsersRepository;