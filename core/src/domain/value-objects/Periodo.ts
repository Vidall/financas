export class Periodo {
  private constructor(
    private readonly _mes: number,
    private readonly _ano: number,
  ) {}

  static de(mes: number, ano: number): Periodo {
    if (mes < 1 || mes > 12) throw new Error(`Mês inválido: ${mes}`);
    if (ano < 2000 || ano > 2100) throw new Error(`Ano inválido: ${ano}`);
    return new Periodo(mes, ano);
  }

  get mes(): number { return this._mes; }
  get ano(): number { return this._ano; }

  get chave(): string { return `${this._ano}-${String(this._mes).padStart(2, '0')}`; }

  igual(outro: Periodo): boolean {
    return this._mes === outro._mes && this._ano === outro._ano;
  }

  toString(): string {
    const nomes = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${nomes[this._mes]} ${this._ano}`;
  }
}
