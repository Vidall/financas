import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    verificar() {
        return {status: "ok"}
    }
}
