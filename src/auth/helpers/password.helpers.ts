import * as bcrypt from 'bcrypt';

export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  return await bcrypt.hash(password, salt);
}
export async function comparePassword(
  password: string,
  hashPassword: string
): Promise<boolean> {
  this.logger.log(`Password: ${password}`);

  return await bcrypt.compare(password, hashPassword);
}
