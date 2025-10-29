import User from "@/models/User";

export const MongooseAdapter = {
  async createUser(data) {
    const user = await User.create({
      name: data.name,
      email: data.email,
      image: data.image,
      role: "user",
    });
    return user.toObject();
  },

  async getUser(id) {
    return await User.findById(id).lean();
  },

  async getUserByEmail(email) {
    return await User.findOne({ email }).lean();
  },

  async getUserByAccount({ providerAccountId }) {
    return await User.findOne({ providerAccountId }).lean();
  },

  async updateUser(user) {
    return await User.findByIdAndUpdate(user.id, user, { new: true }).lean();
  },

  async deleteUser(id) {
    return await User.findByIdAndDelete(id).lean();
  },

  // These are required but can be minimal
  async linkAccount() {
    return null;
  },
  async unlinkAccount() {
    return null;
  },
  async createSession() {
    return null;
  },
  async getSessionAndUser() {
    return null;
  },
  async updateSession() {
    return null;
  },
  async deleteSession() {
    return null;
  },
};
