import bcrypt from "bcrypt";
import database from "../config/database.js";
import { User, CreateUserDTO } from "../types/index.js";

class UserRepository {
  // create a new user
  async create(data: CreateUserDTO): Promise<User> {
    const salt = 10;
    const password_hash = await bcrypt.hash(data.password, salt);

    const query = `
            INSERT INTO users (email, password) 
            VALUES ($1, $2) 
            RETURNING id, email, created_at, updated_at
        `;

    const values = [data.email, password_hash];
    const result = await database.query(query, values);

    return result.rows[0];
  }

  // find user by email
  async findByEmail(email: string): Promise<User | null> {
    const query = `
        SELECT * FROM users WHERE email = $1
    `;

    const values = [email];
    const result = await database.query(query, values);

    return result.rows[0] || null;
  }

  // find user by email
  async findById(id: string): Promise<User | null> {
    const query = `
        SELECT id, email, created_at, updated_at FROM users WHERE id = $1
    `;

    const values = [id];
    const result = await database.query(query, values);

    return result.rows[0] || null;
  }

  // verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // update the user
  async update(id: string, data: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];

    let index = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "id" && key !== "password") {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING id, email, created_at, updated_at
    `;

    const result = await database.query(query, values);

    return result.rows[0] || null;
  }

  // Delete a user
  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM users WHERE id=$1";

    const result = await database.query(query, [id]);

    return result.rowCount ? result.rowCount > 0 : false;
  }

  async emailExists(email: string): Promise<boolean> {
    const query = "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)";

    const result = await database.query(query, [email]);

    return result.rows[0].exists;
  }
}

export default new UserRepository();
