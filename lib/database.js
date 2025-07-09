import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync("atividades");

export const createTables = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS DiasDaSemana (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Atividades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      apelido TEXT,
      descricao TEXT,
      dia_da_semana_id INTEGER,
      tipo TEXT NOT NULL,
      FOREIGN KEY (dia_da_semana_id) REFERENCES DiasDaSemana(id)
    );

    CREATE TABLE IF NOT EXISTS CheckInsCheckOuts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      atividade_id INTEGER,
      data_hora_checkin TEXT DEFAULT CURRENT_TIMESTAMP,
      latitude REAL,
      longitude REAL,
      FOREIGN KEY (atividade_id) REFERENCES Atividades(id)
    );

    CREATE TABLE IF NOT EXISTS Historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      atividade_id INTEGER,
      check_in_id INTEGER,
      check_out_id INTEGER,
      FOREIGN KEY (atividade_id) REFERENCES Atividades(id),
      FOREIGN KEY (check_in_id) REFERENCES CheckInsCheckOuts(id),
      FOREIGN KEY (check_out_id) REFERENCES CheckInsCheckOuts(id)
    );
  `);

  const dias = [
    'Segunda', 'Terça', 'Quarta',
    'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];
  for (const dia of dias) {
    try {
      await db.runAsync(`INSERT INTO DiasDaSemana (nome) VALUES (?)`, dia);
    } catch {}
  }
};

/////////////////////////////////Atividade

export const getAtividadesPorDia = async (dia_nome, setAtividades) => {
  const rows = await db.getAllAsync(`
    SELECT A.*, D.nome as dia_nome
    FROM Atividades A
    JOIN DiasDaSemana D ON A.dia_da_semana_id = D.id
    WHERE D.nome = ?
  `, [dia_nome]);
  setAtividades(rows);
};

export const getAtividadePorId = async (id) => {
  const result = await db.getFirstAsync(
    `SELECT A.*, D.nome as dia_nome
     FROM Atividades A
     JOIN DiasDaSemana D ON A.dia_da_semana_id = D.id
     WHERE A.id = ?`,
    [id]
  );
  return result;
};


export const criarAtividade = async ({ nome, apelido, descricao, tipo, dia_nome }) => {
  if (!nome || !tipo) {
    throw new Error("Nome e tipo são obrigatórios.");
  }

  if (apelido.length > 4) {
    throw new Error("Apelido deve ter no máximo 4 letras.");
  }

  const dia = await db.getFirstAsync(
    'SELECT id FROM DiasDaSemana WHERE nome = ?',
    [dia_nome]
  );

  if (!dia) {
    throw new Error("Dia da semana não encontrado.");
  }

  const diaId = dia.id;

  await db.runAsync(`
    INSERT INTO Atividades (nome, apelido, descricao, dia_da_semana_id, tipo)
    VALUES (?, ?, ?, ?, ?)
  `, [nome, apelido, descricao, diaId, tipo]);
};

export const excluirAtividade = async (atividadeId) => {
  await db.runAsync(`DELETE FROM Atividades WHERE id = ?`, [atividadeId]);
};
///////////////////////////////// Logicas para o chein 


export const verificarStatusAtividade = async (atividadeId) => {
  const aberto = await db.getFirstAsync(`
    SELECT * FROM Historico
    WHERE atividade_id = ? AND check_out_id IS NULL
    ORDER BY id DESC
    LIMIT 1
  `, [atividadeId]);

  if (aberto) return 'checkout';
  return 'checkin';
};

export const registrarCheckInOuOut = async (atividadeId) => {
  const status = await verificarStatusAtividade(atividadeId);

  if (status === 'checkin') {
    const dataHora = new Date().toISOString();
    await db.runAsync(`
      INSERT INTO CheckInsCheckOuts (atividade_id, data_hora_checkin)
      VALUES (?, ?)
    `, [atividadeId, dataHora]);

    const checkin = await db.getFirstAsync(`
      SELECT id FROM CheckInsCheckOuts
      WHERE atividade_id = ? AND data_hora_checkin = ?
    `, [atividadeId, dataHora]);

    await db.runAsync(`
      INSERT INTO Historico (atividade_id, check_in_id)
      VALUES (?, ?)
    `, [atividadeId, checkin.id]);

    return 'checkin';

  } else if (status === 'checkout') {
    const dataHora = new Date().toISOString();
    await db.runAsync(`
      INSERT INTO CheckInsCheckOuts (atividade_id, data_hora_checkin)
      VALUES (?, ?)
    `, [atividadeId, dataHora]);

    const checkout = await db.getFirstAsync(`
      SELECT id FROM CheckInsCheckOuts
      WHERE atividade_id = ? AND data_hora_checkin = ?
    `, [atividadeId, dataHora]);

    await db.runAsync(`
      UPDATE Historico
      SET check_out_id = ?
      WHERE atividade_id = ? AND check_out_id IS NULL
    `, [checkout.id, atividadeId]);

    const atividade = await getAtividadePorId(atividadeId);
    if (atividade.tipo === 'unica') {
      await excluirAtividade(atividadeId);
    }

    return 'checkout';
  }
};




