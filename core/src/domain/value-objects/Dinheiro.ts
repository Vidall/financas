export class Dinheiro {
  private readonly _centavos: number;

  private constructor(centavos: number) {
    this._centavos = centavos;
  }

  static de(valor: number): Dinheiro {
    if (valor < 0) throw new Error(`Valor monetário não pode ser negativo: ${valor}`);
    return new Dinheiro(Math.round(valor * 100));
  }

  static zero(): Dinheiro {
    return new Dinheiro(0);
  }

  get valor(): number {
    return this._centavos / 100;
  }

  somar(outro: Dinheiro): Dinheiro {
    return new Dinheiro(this._centavos + outro._centavos);
  }

  subtrair(outro: Dinheiro): Dinheiro {
    const resultado = this._centavos - outro._centavos;
    if (resultado < 0) throw new Error('Resultado monetário negativo não permitido');
    return new Dinheiro(resultado);
  }

  subtrairPermitindoNegativo(outro: Dinheiro): number {
    return (this._centavos - outro._centavos) / 100;
  }

  multiplicar(fator: number): Dinheiro {
    return new Dinheiro(Math.round(this._centavos * fator));
  }

  percentualDe(total: Dinheiro): number {
    if (total._centavos === 0) return 0;
    return (this._centavos / total._centavos) * 100;
  }

  maiorQue(outro: Dinheiro): boolean {
    return this._centavos > outro._centavos;
  }

  menorQue(outro: Dinheiro): boolean {
    return this._centavos < outro._centavos;
  }

  igual(outro: Dinheiro): boolean {
    return this._centavos === outro._centavos;
  }

  eZero(): boolean {
    return this._centavos === 0;
  }

  toString(): string {
    return `R$ ${this.valor.toFixed(2)}`;
  }
}
