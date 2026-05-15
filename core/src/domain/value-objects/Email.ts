export class Email {
  private static readonly REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly _valor: string;

  private constructor(valor: string) {
    this._valor = valor;
  }

  static de(valor: string): Email {
    const v = valor.trim().toLowerCase();
    if (!Email.REGEX.test(v)) throw new Error(`Email inválido: ${valor}`);
    return new Email(v);
  }

  get valor(): string { return this._valor; }

  igual(outro: Email): boolean { return this._valor === outro._valor; }

  toString(): string { return this._valor; }
}
