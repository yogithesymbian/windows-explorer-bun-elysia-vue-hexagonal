// import apiClient from "@/infrastructure/api-client"
// import { IUserApiPort } from "@/domain/ports/user-api.port"
// import { User } from "@/domain/entities/user.entity"
// import { UserMapper } from "@/infrastructure/mappers/user.mapper"

// export class UserApiAdapter implements IUserApiPort {
//   async getUsers(): Promise<User[]> {
//     const response = await apiClient.get("/users")
//     return response.data.map((item: any) => UserMapper.toDomain(item))
//   }

//   async getUserById(id: string): Promise<User> {
//     const response = await apiClient.get(`/users/${id}`)
//     return UserMapper.toDomain(response.data)
//   }

//   async createUser(data: Partial<User>): Promise<User> {
//     const dto = UserMapper.toDTO(data as User)
//     const response = await apiClient.post("/users", dto)
//     return UserMapper.toDomain(response.data)
//   }

//   async updateUser(id: string, data: Partial<User>): Promise<User> {
//     const dto = UserMapper.toDTO(data as User)
//     const response = await apiClient.put(`/users/${id}`, dto)
//     return UserMapper.toDomain(response.data)
//   }

//   async deleteUser(id: string): Promise<void> {
//     await apiClient.delete(`/users/${id}`)
//   }
// }
