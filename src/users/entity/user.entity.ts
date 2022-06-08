import { compare, hash } from 'bcrypt';

export class User {
  private _password: string;
  constructor(
    private readonly _name: string,
    private readonly _email: string,
    passwordHash?: string
  ) {
    if (passwordHash) {
      this._password = passwordHash;
    }
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  get password() {
    return this._password;
  }

  async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }

  async comparePassword(pass: string): Promise<boolean> {
    return await compare(pass, this._password);
  }
}
