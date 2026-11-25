import { Global, Module } from '@nestjs/common';
import { CaslAbilityService } from './casl-ability/casl-ability.service.js';

@Global() // pode ser usado sem importar nos modulos
@Module({
    providers: [CaslAbilityService],
    exports: [CaslAbilityService] // pode ser usado outros modulos
})
export class CaslModule { }
