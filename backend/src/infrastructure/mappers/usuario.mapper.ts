import type { Usuario as UsuarioPrisma } from '@prisma/client';
import { Usuario, Email } from '@financas/core';

export class UsuarioMapper {
  static toDomain(raw: UsuarioPrisma): Usuario {
    return Usuario.reconstituir({
      id: raw.id,
      nome: raw.nome,
      email: Email.de(raw.email),
      senhaHash: raw.senhaHash,
      criadoEm: raw.criadoEm,
    });
  }

  static toPrismaCreate(domain: Usuario): Omit<UsuarioPrisma, 'criadoEm'> {
    return {
      id: domain.id,
      nome: domain.nome,
      email: domain.email.valor,
      senhaHash: domain.senhaHash,
    };
  }
}
