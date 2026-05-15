export class CategoriaDespesa {
  private constructor(
    private readonly _nome: string,
    private readonly _icone: string,
  ) {}

  static de(nome: string, icone: string = '💰'): CategoriaDespesa {
    const nomeTrimado = nome.trim();
    if (!nomeTrimado) throw new Error('Nome da categoria não pode ser vazio');
    return new CategoriaDespesa(nomeTrimado, icone);
  }

  // Categorias pré-definidas derivadas do JSON
  static readonly Gasolina = CategoriaDespesa.de('Gasolina', '⛽');
  static readonly PlanoTelefonico = CategoriaDespesa.de('Plano Telefônico', '📱');
  static readonly SaudeEBemEstar = CategoriaDespesa.de('Saúde e Bem-estar', '🏃');
  static readonly Lazer = CategoriaDespesa.de('Lazer', '🎉');
  static readonly Restaurante = CategoriaDespesa.de('Restaurante', '🍽️');
  static readonly Casa = CategoriaDespesa.de('Casa', '🏠');

  get nome(): string { return this._nome; }
  get icone(): string { return this._icone; }

  igual(outro: CategoriaDespesa): boolean {
    return this._nome.toLowerCase() === outro._nome.toLowerCase();
  }

  toString(): string { return `${this._icone} ${this._nome}`; }
}
