import { CriarFuncionarioUseCase, CriarSupervisorUseCase } from "shift-swap";
import { pool } from "../db";
import { PgFuncionarioRepository } from "./funcionario.repository";
import { PgSupervisorRepository } from "./supervisor.repository";

const funcionarioRepository = new PgFuncionarioRepository(pool);
const supervisorRepository = new PgSupervisorRepository(pool);

export const criarFuncionario = new CriarFuncionarioUseCase(funcionarioRepository);
export const criarSupervisor = new CriarSupervisorUseCase(supervisorRepository);
