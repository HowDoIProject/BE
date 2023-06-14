const { Users } = require("../models"); // 모델 가져오기

class UserRepository {

	//유저 조회

	getOneUser = async (condition) => {
		const user = await Users.findOne({
			attributes: ["user_id", "user_number", "nickname", "password", "user_type","category"],
			where: condition,
		})
		return user;
	}
}

module.exports = UserRepository;