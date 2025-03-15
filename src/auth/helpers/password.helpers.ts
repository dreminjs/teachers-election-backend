import * as bcrypt from 'bcrypt';

export async function hashPassword({
  password,
  salt,
}: {
  password: string;
  salt: string;
}): Promise<string> {
  return await bcrypt.hash(password, salt);
}
export async function comparePassword({
  password,
  hashPassword,
}: {
  password: string;
  hashPassword: string;
}): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
}
